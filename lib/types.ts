export type ReservationStatus = 'pending' | 'paid' | 'cancelled'
export type PayMethod = 'card' | 'transfer'

export interface Reservation {
  id: string
  name: string
  phone: string
  date: string
  time: string // 입실 예정 시간
  duration: number // 이용 시간 (현재: 24시간 이용권)
  amount: number
  orderId: string
  paymentKey?: string
  status: ReservationStatus
  method?: PayMethod
  createdAt: string
}

// 계좌이체 입금 계좌 (손님에게 안내되는 공개 정보)
export const BANK_INFO = {
  bank: '농협',
  account: '670-02-173387',
  holder: '차신영',
}

export interface BookingFormData {
  name: string
  phone: string
  date: string
  time: string
  duration: 1 | 2
}

// 24시간 이용권 단일 요금제
export const DAY_PASS = {
  hours: 24,
  price: 4500,
  label: '24시간 이용권',
}

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00',
]
