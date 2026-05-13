export interface Event {
  id: number
  titleHu: string
  titleEn?: string
  descriptionHu?: string
  descriptionEn?: string
  eventDate: string
  imageUrl?: string
  category?: string
  priceHuf?: number
  registrationInfo?: string
  featured?: boolean
  active?: boolean
}

export interface MenuCategory {
  id: number
  nameHu: string
  nameEn?: string
  type: 'food' | 'drink'
  sortOrder?: number
  active?: boolean
  items?: MenuItem[]
}

export interface MenuItem {
  id: number
  nameHu: string
  nameEn?: string
  descriptionHu?: string
  descriptionEn?: string
  priceHuf?: number
  priceNote?: string
  imageUrl?: string
  sortOrder?: number
  featured?: boolean
  active?: boolean
  category?: MenuCategory
}

export interface GalleryPhoto {
  id: number
  imageUrl: string
  captionHu?: string
  captionEn?: string
  category?: string
  sortOrder?: number
  featured?: boolean
  active?: boolean
}

export interface Review {
  id: number
  authorName: string
  textHu: string
  textEn?: string
  rating: number
  reviewDate?: string
  source?: string
  featured?: boolean
  active?: boolean
}

export interface OpeningHours {
  id: number
  dayOfWeek: number
  openTime?: string
  closeTime?: string
  closed: boolean
  noteHu?: string
  noteEn?: string
}

export interface ReservationSlot {
  id: number
  slotDate: string
  slotTime: string
  capacity: number
  booked: number
}

export interface Reservation {
  id: number
  slot: ReservationSlot
  guestName: string
  phone: string
  email?: string
  partySize: number
  notes?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  createdAt: string
}
