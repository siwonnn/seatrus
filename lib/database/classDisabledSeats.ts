"use server"

import { createClient } from "@/lib/supabase/server"

export interface ClassDisabledSeat {
  id: string
  class_id: string
  row: number
  column: number
}

export async function getDisabledSeatsByClassId(classId: string): Promise<ClassDisabledSeat[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("class_disabled_seats")
    .select("id, class_id, row, column")
    .eq("class_id", classId)

  if (error) {
    console.error("Error fetching disabled seats:", error)
    return []
  }

  return data as ClassDisabledSeat[]
}

export async function addDisabledSeat(classId: string, row: number, column: number): Promise<boolean> {
  const supabase = await createClient()

  const { data: existingSeat, error: existingError } = await supabase
    .from("class_disabled_seats")
    .select("id")
    .eq("class_id", classId)
    .eq("row", row)
    .eq("column", column)
    .maybeSingle()

  if (existingError) {
    console.error("Error checking disabled seat:", existingError)
    return false
  }

  if (existingSeat) {
    return true
  }

  const { error } = await supabase
    .from("class_disabled_seats")
    .insert({ class_id: classId, row, column })

  if (error) {
    console.error("Error inserting disabled seat:", error)
    return false
  }

  return true
}

export async function removeDisabledSeat(classId: string, row: number, column: number): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("class_disabled_seats")
    .delete()
    .eq("class_id", classId)
    .eq("row", row)
    .eq("column", column)

  if (error) {
    console.error("Error deleting disabled seat:", error)
    return false
  }

  return true
}