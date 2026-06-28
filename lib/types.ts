export type ReservationStatus = 'pending' | 'paid' | 'cancelled'

export interface Reservation {
  id: string
  name: string
  phone: string
  date: string
  time: string
  duration: 1 | 2
  amount: number
  orderId: string
  paymentKey?: string
  status: ReservationStatus
  createdAt: string
}

export interface BookingFormData {
  name: string
  phone: string
  date: string
  time: string
  duration: 1 | 2
}

export const PRICES: Record<1 | 2, number> = {
  1: 3000,
  2: 5000,
}

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00',
]
