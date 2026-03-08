"use server"

import { createClient } from "@/lib/supabase/server"
import { Seat, SeatInsert } from "@/types/database"

export async function createSeatsBulk(seats: SeatInsert[]): Promise<boolean> {
  if (seats.length === 0) {
    return true
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("seats")
    .insert(seats)

  if (error) {
    console.error("Error creating seats:", error)
    return false
  }

  return true
}

export async function getSeatsByLayoutId(layoutId: string): Promise<Seat[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("seats")
    .select("*")
    .eq("layout_id", layoutId)
    .order("row", { ascending: true })
    .order("column", { ascending: true })

  if (error) {
    console.error("Error fetching seats by layout id:", error)
    return []
  }

  return data as Seat[]
}
