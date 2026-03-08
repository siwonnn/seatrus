"use server"

import { createClient } from "@/lib/supabase/server"
import { SeatLayout, SeatLayoutInsert } from "@/types/database"

export async function createSeatLayout(
  layoutData: SeatLayoutInsert
): Promise<SeatLayout | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("seat_layouts")
    .insert(layoutData)
    .select("*")
    .single()

  if (error) {
    console.error("Error creating seat layout:", error)
    return null
  }

  return data as SeatLayout
}

export async function deleteSeatLayout(layoutId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("seat_layouts")
    .delete()
    .eq("id", layoutId)

  if (error) {
    console.error("Error deleting seat layout:", error)
    return false
  }

  return true
}

export async function getLatestSeatLayoutByClassId(
  classId: string
): Promise<SeatLayout | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("seat_layouts")
    .select("*")
    .eq("class_id", classId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Error fetching latest seat layout:", error)
    return null
  }

  return (data as SeatLayout | null) ?? null
}

export async function getSeatLayoutsByClassId(
  classId: string,
  limit = 20
): Promise<SeatLayout[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("seat_layouts")
    .select("*")
    .eq("class_id", classId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching seat layouts:", error)
    return []
  }

  return data as SeatLayout[]
}

export async function getSeatLayoutById(layoutId: string): Promise<SeatLayout | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("seat_layouts")
    .select("*")
    .eq("id", layoutId)
    .maybeSingle()

  if (error) {
    console.error("Error fetching seat layout by id:", error)
    return null
  }

  return (data as SeatLayout | null) ?? null
}
