export interface Organization {
  id: string
  name: string
  created_at: string
}

export interface AppUser {
  id: string
  organization_id: string | null
  created_at: string
  name: string | null
  email: string | null
  onboarded: boolean
  credits: number
}

export interface Class {
  id: string
  organization_id: string
  user_id: string
  created_at: string
  grade: number
  class_name: string
  rows: number
  columns: number
  prevent_same_seat: boolean
  prevent_same_pair: boolean
  prevent_back_to_back: boolean
}

export interface Student {
  id: string
  number: number
  name: string
  class_id: string
  created_at: string
  deleted_at: string | null
}

export interface SeatLayout {
  id: string
  created_at: string
  organization_id: string
  class_id: string
  rows: number
  columns: number
  is_demo: boolean
}

export interface Seat {
  id: string
  layout_id: string
  row: number
  column: number
  student_id: string | null
  student_number_snapshot: number | null
  student_name_snapshot: string | null
}

// Insert types
export type OrganizationInsert = Omit<Organization, 'id' | 'created_at'>
export type AppUserInsert = Omit<AppUser, 'created_at'>
export type ClassInsert = Omit<Class, 'id' | 'created_at'>
export type StudentInsert = Omit<Student, 'id' | 'created_at'>
export type SeatLayoutInsert = Omit<SeatLayout, 'id' | 'created_at'>
export type SeatInsert = Omit<Seat, 'id'>

// Update types
export type OrganizationUpdate = Partial<Omit<Organization, 'id' | 'created_at'>>
export type AppUserUpdate = Partial<Omit<AppUser, 'id' | 'created_at'>>
export type ClassUpdate = Partial<Omit<Class, 'id' | 'created_at'>>
export type StudentUpdate = Partial<Omit<Student, 'id' | 'created_at'>>
export type SeatLayoutUpdate = Partial<Omit<SeatLayout, 'id' | 'created_at'>>
export type SeatUpdate = Partial<Omit<Seat, 'id'>>
