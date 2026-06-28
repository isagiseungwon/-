import { Reservation } from './types'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'reservations.json')

function readAll(): Reservation[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeAll(reservations: Reservation[]) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(reservations, null, 2))
}

export function getAllReservations(): Reservation[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getReservationByOrderId(orderId: string): Reservation | null {
  return readAll().find((r) => r.orderId === orderId) ?? null
}

export function createReservation(data: Omit<Reservation, 'createdAt'>): Reservation {
  const reservations = readAll()
  const reservation: Reservation = { ...data, createdAt: new Date().toISOString() }
  reservations.push(reservation)
  writeAll(reservations)
  return reservation
}

export function updateReservation(
  orderId: string,
  updates: Partial<Reservation>
): Reservation | null {
  const reservations = readAll()
  const idx = reservations.findIndex((r) => r.orderId === orderId)
  if (idx === -1) return null
  reservations[idx] = { ...reservations[idx], ...updates }
  writeAll(reservations)
  return reservations[idx]
}

export function getReservedSlots(date: string): string[] {
  return readAll()
    .filter((r) => r.date === date && r.status === 'paid')
    .flatMap((r) => {
      const [hour] = r.time.split(':').map(Number)
      return Array.from({ length: r.duration }, (_, i) => `${String(hour + i).padStart(2, '0')}:00`)
    })
}
