import { Reservation } from './types'
import { normalizePhone } from './crm'
import fs from 'fs'
import path from 'path'

/**
 * 예약 저장소.
 *
 * 지원하는 백엔드(자동 감지):
 *  - ioredis   : REDIS_URL 등 redis:// · rediss:// 연결 문자열 (Redis Cloud 등)
 *  - upstash   : *_REST_API_URL + *_REST_API_TOKEN (Upstash / Vercel KV)
 *  - file      : 위 둘 다 없으면 로컬 파일(data/reservations.json)로 폴백
 */

const HASH_KEY = 'reservations'

// ---- 연결 정보 감지 ----
function detectConnectionUrl(): string | undefined {
  const env = process.env
  const known = env.REDIS_URL || env.KV_URL || env.REDIS_URI
  if (known && /^rediss?:\/\//i.test(known)) return known
  for (const value of Object.values(env)) {
    if (value && /^rediss?:\/\//i.test(value)) return value
  }
  return undefined
}

function detectRestCreds(): { url?: string; token?: string } {
  const env = process.env
  const url =
    env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL || env.REDIS_REST_API_URL
  const token =
    env.KV_REST_API_TOKEN ||
    env.UPSTASH_REDIS_REST_TOKEN ||
    env.REDIS_REST_API_TOKEN
  return { url, token }
}

const CONN_URL = detectConnectionUrl()
const REST = detectRestCreds()

type Backend = 'ioredis' | 'upstash' | 'file'
const backend: Backend = CONN_URL
  ? 'ioredis'
  : REST.url && REST.token
  ? 'upstash'
  : 'file'

// ---- ioredis (redis:// 연결) ----
async function getIoRedis() {
  const g = globalThis as unknown as { __ioredis?: import('ioredis').Redis }
  if (g.__ioredis) return g.__ioredis
  const IORedis = (await import('ioredis')).default
  g.__ioredis = new IORedis(CONN_URL!, {
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
  })
  return g.__ioredis
}

// ---- Upstash (REST 연결) ----
let upstashClient: import('@upstash/redis').Redis | null = null
async function getUpstash() {
  if (upstashClient) return upstashClient
  const { Redis } = await import('@upstash/redis')
  upstashClient = new Redis({ url: REST.url!, token: REST.token! })
  return upstashClient
}

function parseRow(value: unknown): Reservation {
  if (typeof value === 'string') return JSON.parse(value) as Reservation
  return value as Reservation
}

// ---- 파일 폴백 (로컬 전용) ----
const DATA_FILE = path.join(process.cwd(), 'data', 'reservations.json')
function fileReadAll(): Reservation[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}
function fileWriteAll(rows: Reservation[]) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2))
}

// ---- 내부 통합 접근자 ----
async function readAll(): Promise<Reservation[]> {
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    const all = await r.hgetall(HASH_KEY)
    return Object.values(all).map((v) => parseRow(v))
  }
  if (backend === 'upstash') {
    const r = await getUpstash()
    const all = await r.hgetall<Record<string, unknown>>(HASH_KEY)
    return all ? Object.values(all).map(parseRow) : []
  }
  return fileReadAll()
}

async function writeOne(reservation: Reservation) {
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    await r.hset(HASH_KEY, reservation.orderId, JSON.stringify(reservation))
    return
  }
  if (backend === 'upstash') {
    const r = await getUpstash()
    await r.hset(HASH_KEY, { [reservation.orderId]: reservation })
    return
  }
  const rows = fileReadAll()
  const idx = rows.findIndex((x) => x.orderId === reservation.orderId)
  if (idx === -1) rows.push(reservation)
  else rows[idx] = reservation
  fileWriteAll(rows)
}

// ---- 공개 API ----
export async function getAllReservations(): Promise<Reservation[]> {
  const rows = await readAll()
  return rows.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getReservationByOrderId(
  orderId: string
): Promise<Reservation | null> {
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    const row = await r.hget(HASH_KEY, orderId)
    return row ? parseRow(row) : null
  }
  if (backend === 'upstash') {
    const r = await getUpstash()
    const row = await r.hget<unknown>(HASH_KEY, orderId)
    return row ? parseRow(row) : null
  }
  return fileReadAll().find((x) => x.orderId === orderId) ?? null
}

export async function createReservation(
  data: Omit<Reservation, 'createdAt'>
): Promise<Reservation> {
  const reservation: Reservation = { ...data, createdAt: new Date().toISOString() }
  await writeOne(reservation)
  return reservation
}

export async function updateReservation(
  orderId: string,
  updates: Partial<Reservation>
): Promise<Reservation | null> {
  const existing = await getReservationByOrderId(orderId)
  if (!existing) return null
  const updated = { ...existing, ...updates }
  await writeOne(updated)
  return updated
}

export async function deleteReservation(orderId: string): Promise<boolean> {
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    const removed = await r.hdel(HASH_KEY, orderId)
    return removed > 0
  }
  if (backend === 'upstash') {
    const r = await getUpstash()
    const removed = await r.hdel(HASH_KEY, orderId)
    return removed > 0
  }
  const rows = fileReadAll()
  const next = rows.filter((x) => x.orderId !== orderId)
  if (next.length === rows.length) return false
  fileWriteAll(next)
  return true
}

// ═════════ 블로그 초안 저장소 (같은 백엔드 재사용) ═════════

const DRAFT_KEY = 'blog_drafts'
const DRAFT_FILE = path.join(process.cwd(), 'data', 'blog-drafts.json')

export interface BlogDraft {
  id: string
  title: string
  keyword: string
  content: string
  createdAt: string
}

function draftFileReadAll(): BlogDraft[] {
  try {
    if (!fs.existsSync(DRAFT_FILE)) return []
    return JSON.parse(fs.readFileSync(DRAFT_FILE, 'utf-8'))
  } catch {
    return []
  }
}
function draftFileWriteAll(rows: BlogDraft[]) {
  const dir = path.dirname(DRAFT_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DRAFT_FILE, JSON.stringify(rows, null, 2))
}

function parseDraft(value: unknown): BlogDraft {
  if (typeof value === 'string') return JSON.parse(value) as BlogDraft
  return value as BlogDraft
}

export async function listBlogDrafts(): Promise<BlogDraft[]> {
  let rows: BlogDraft[]
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    const all = await r.hgetall(DRAFT_KEY)
    rows = Object.values(all).map(parseDraft)
  } else if (backend === 'upstash') {
    const r = await getUpstash()
    const all = await r.hgetall<Record<string, unknown>>(DRAFT_KEY)
    rows = all ? Object.values(all).map(parseDraft) : []
  } else {
    rows = draftFileReadAll()
  }
  return rows.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function saveBlogDraft(draft: BlogDraft): Promise<void> {
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    await r.hset(DRAFT_KEY, draft.id, JSON.stringify(draft))
    return
  }
  if (backend === 'upstash') {
    const r = await getUpstash()
    await r.hset(DRAFT_KEY, { [draft.id]: draft })
    return
  }
  const rows = draftFileReadAll()
  const idx = rows.findIndex((x) => x.id === draft.id)
  if (idx === -1) rows.push(draft)
  else rows[idx] = draft
  draftFileWriteAll(rows)
}

export async function deleteBlogDraft(id: string): Promise<boolean> {
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    return (await r.hdel(DRAFT_KEY, id)) > 0
  }
  if (backend === 'upstash') {
    const r = await getUpstash()
    return (await r.hdel(DRAFT_KEY, id)) > 0
  }
  const rows = draftFileReadAll()
  const next = rows.filter((x) => x.id !== id)
  if (next.length === rows.length) return false
  draftFileWriteAll(next)
  return true
}

// ═════════ 릴스 레퍼런스 저장소 (같은 백엔드 재사용) ═════════

const REEL_KEY = 'reel_refs'
const REEL_FILE = path.join(process.cwd(), 'data', 'reel-refs.json')

export interface ReelReference {
  id: string
  url: string // 인스타 릴스 링크 (선택)
  why: string // "왜 먹혔나" 한 줄 (필수)
  need: string // 건드린 결핍 (선택)
  formula: string[] // ['hook','proof','list','cta'] 중 해당
  createdAt: number
}

function reelFileReadAll(): ReelReference[] {
  try {
    if (!fs.existsSync(REEL_FILE)) return []
    return JSON.parse(fs.readFileSync(REEL_FILE, 'utf-8'))
  } catch {
    return []
  }
}
function reelFileWriteAll(rows: ReelReference[]) {
  const dir = path.dirname(REEL_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(REEL_FILE, JSON.stringify(rows, null, 2))
}
function parseReel(value: unknown): ReelReference {
  if (typeof value === 'string') return JSON.parse(value) as ReelReference
  return value as ReelReference
}

export async function listReels(): Promise<ReelReference[]> {
  let rows: ReelReference[]
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    const all = await r.hgetall(REEL_KEY)
    rows = Object.values(all).map(parseReel)
  } else if (backend === 'upstash') {
    const r = await getUpstash()
    const all = await r.hgetall<Record<string, unknown>>(REEL_KEY)
    rows = all ? Object.values(all).map(parseReel) : []
  } else {
    rows = reelFileReadAll()
  }
  return rows.sort((a, b) => b.createdAt - a.createdAt)
}

export async function saveReel(ref: ReelReference): Promise<void> {
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    await r.hset(REEL_KEY, ref.id, JSON.stringify(ref))
    return
  }
  if (backend === 'upstash') {
    const r = await getUpstash()
    await r.hset(REEL_KEY, { [ref.id]: ref })
    return
  }
  const rows = reelFileReadAll()
  const idx = rows.findIndex((x) => x.id === ref.id)
  if (idx === -1) rows.push(ref)
  else rows[idx] = ref
  reelFileWriteAll(rows)
}

export async function deleteReel(id: string): Promise<boolean> {
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    return (await r.hdel(REEL_KEY, id)) > 0
  }
  if (backend === 'upstash') {
    const r = await getUpstash()
    return (await r.hdel(REEL_KEY, id)) > 0
  }
  const rows = reelFileReadAll()
  const next = rows.filter((x) => x.id !== id)
  if (next.length === rows.length) return false
  reelFileWriteAll(next)
  return true
}

// ═════════ 고객 메모 저장소 (전화번호 → 메모, 같은 백엔드 재사용) ═════════

const NOTE_KEY = 'customer_notes'
const NOTE_FILE = path.join(process.cwd(), 'data', 'customer-notes.json')

function noteFileReadAll(): Record<string, string> {
  try {
    if (!fs.existsSync(NOTE_FILE)) return {}
    return JSON.parse(fs.readFileSync(NOTE_FILE, 'utf-8'))
  } catch {
    return {}
  }
}
function noteFileWriteAll(map: Record<string, string>) {
  const dir = path.dirname(NOTE_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(NOTE_FILE, JSON.stringify(map, null, 2))
}

export async function getAllNotes(): Promise<Record<string, string>> {
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    const all = await r.hgetall(NOTE_KEY)
    return all ?? {}
  }
  if (backend === 'upstash') {
    const r = await getUpstash()
    const all = await r.hgetall<Record<string, string>>(NOTE_KEY)
    return all ?? {}
  }
  return noteFileReadAll()
}

export async function setCustomerNote(phone: string, note: string): Promise<void> {
  const key = normalizePhone(phone)
  if (!key) return
  if (backend === 'ioredis') {
    const r = await getIoRedis()
    if (note) await r.hset(NOTE_KEY, key, note)
    else await r.hdel(NOTE_KEY, key)
    return
  }
  if (backend === 'upstash') {
    const r = await getUpstash()
    if (note) await r.hset(NOTE_KEY, { [key]: note })
    else await r.hdel(NOTE_KEY, key)
    return
  }
  const map = noteFileReadAll()
  if (note) map[key] = note
  else delete map[key]
  noteFileWriteAll(map)
}

// ═════════ 레이트 리미터 (고정 윈도우, 같은 백엔드 재사용) ═════════
// key별 windowSec 동안 limit회 초과하면 false 반환.
// - 로컬(file) 백엔드에선 항상 허용(개발 편의)
// - 리미터 자체 오류 시 사이트를 막지 않도록 fail-open(허용)
export async function rateLimitOk(
  key: string,
  limit: number,
  windowSec: number
): Promise<boolean> {
  const rkey = `rl:${key}`
  try {
    if (backend === 'ioredis') {
      const r = await getIoRedis()
      const n = await r.incr(rkey)
      if (n === 1) await r.expire(rkey, windowSec)
      return n <= limit
    }
    if (backend === 'upstash') {
      const r = await getUpstash()
      const n = await r.incr(rkey)
      if (n === 1) await r.expire(rkey, windowSec)
      return n <= limit
    }
    return true // file 백엔드(로컬) → 제한 없음
  } catch (e) {
    console.error('[rateLimit] 오류(허용 처리):', e)
    return true // fail-open
  }
}

export async function getReservedSlots(date: string): Promise<string[]> {
  const rows = await getAllReservations()
  return rows
    .filter((r) => r.date === date && r.status === 'paid')
    .flatMap((r) => {
      const [hour] = r.time.split(':').map(Number)
      return Array.from(
        { length: r.duration },
        (_, i) => `${String(hour + i).padStart(2, '0')}:00`
      )
    })
}
