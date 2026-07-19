import { Reservation } from './types'
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
