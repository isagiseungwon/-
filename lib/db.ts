import { Reservation } from './types'
import fs from 'fs'
import path from 'path'

/**
 * 예약 저장소.
 *
 * - Vercel 등 배포 환경: Upstash Redis(=Vercel KV)에 저장.
 *   KV 스토어를 프로젝트에 연결하면 아래 환경변수가 자동으로 주입됩니다.
 * - 로컬 개발: 환경변수가 없으면 data/reservations.json 파일에 저장(폴백).
 */

/**
 * Redis REST 접속 정보 자동 탐지.
 * Upstash/Vercel이 주입하는 환경변수 이름은 연동 방식·프리픽스에 따라
 * 제각각(KV_*, UPSTASH_*, STORAGE_* 등)이라, 알려진 이름을 먼저 보고
 * 없으면 REST URL/TOKEN 패턴에 맞는 변수를 통째로 스캔한다.
 */
function detectRedisCreds(): { url?: string; token?: string } {
  const env = process.env

  // 1) 알려진 이름 우선
  const url =
    env.KV_REST_API_URL ||
    env.UPSTASH_REDIS_REST_URL ||
    env.REDIS_REST_API_URL
  const token =
    env.KV_REST_API_TOKEN ||
    env.UPSTASH_REDIS_REST_TOKEN ||
    env.REDIS_REST_API_TOKEN
  if (url && token) return { url, token }

  // 2) 패턴 스캔 (프리픽스가 붙은 경우까지 대응)
  let scannedUrl: string | undefined
  let scannedToken: string | undefined
  for (const [key, value] of Object.entries(env)) {
    if (!value) continue
    if (!scannedUrl && /REST.*URL$/i.test(key) && /^https?:\/\//i.test(value)) {
      scannedUrl = value
    }
    if (!scannedToken && /REST.*TOKEN$/i.test(key)) {
      scannedToken = value
    }
  }
  return { url: url || scannedUrl, token: token || scannedToken }
}

const { url: REDIS_URL, token: REDIS_TOKEN } = detectRedisCreds()

const HASH_KEY = 'reservations'
const hasRedis = Boolean(REDIS_URL && REDIS_TOKEN)

// ---- Redis 클라이언트 (지연 로딩) ----
let redisClient: import('@upstash/redis').Redis | null = null
async function getRedis() {
  if (redisClient) return redisClient
  const { Redis } = await import('@upstash/redis')
  redisClient = new Redis({ url: REDIS_URL!, token: REDIS_TOKEN! })
  return redisClient
}

function normalize(value: unknown): Reservation {
  // Upstash는 JSON을 자동 파싱하지만, 문자열로 올 수도 있어 양쪽 대응
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

// ---- 공개 API ----
export async function getAllReservations(): Promise<Reservation[]> {
  let rows: Reservation[]
  if (hasRedis) {
    const redis = await getRedis()
    const all = await redis.hgetall<Record<string, unknown>>(HASH_KEY)
    rows = all ? Object.values(all).map(normalize) : []
  } else {
    rows = fileReadAll()
  }
  return rows.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getReservationByOrderId(
  orderId: string
): Promise<Reservation | null> {
  if (hasRedis) {
    const redis = await getRedis()
    const row = await redis.hget<unknown>(HASH_KEY, orderId)
    return row ? normalize(row) : null
  }
  return fileReadAll().find((r) => r.orderId === orderId) ?? null
}

export async function createReservation(
  data: Omit<Reservation, 'createdAt'>
): Promise<Reservation> {
  const reservation: Reservation = { ...data, createdAt: new Date().toISOString() }
  if (hasRedis) {
    const redis = await getRedis()
    await redis.hset(HASH_KEY, { [reservation.orderId]: reservation })
  } else {
    const rows = fileReadAll()
    rows.push(reservation)
    fileWriteAll(rows)
  }
  return reservation
}

export async function updateReservation(
  orderId: string,
  updates: Partial<Reservation>
): Promise<Reservation | null> {
  const existing = await getReservationByOrderId(orderId)
  if (!existing) return null
  const updated = { ...existing, ...updates }
  if (hasRedis) {
    const redis = await getRedis()
    await redis.hset(HASH_KEY, { [orderId]: updated })
  } else {
    const rows = fileReadAll()
    const idx = rows.findIndex((r) => r.orderId === orderId)
    if (idx !== -1) {
      rows[idx] = updated
      fileWriteAll(rows)
    }
  }
  return updated
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
