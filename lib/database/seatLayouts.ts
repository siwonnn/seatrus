"use server"

import { createClient } from "@/lib/supabase/server"
import { SeatLayout, SeatLayoutInsert } from "@/types/database"

export interface AdminSeatLayoutHistoryItem {
  id: string
  created_at: string
  is_demo: boolean
  occupiedSeatCount: number
  organizationName: string | null
  grade: number | null
  className: string | null
  runnerName: string | null
}

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
  classId: string,
  options?: { includeDemo?: boolean }
): Promise<SeatLayout | null> {
  const supabase = await createClient()
  const includeDemo = options?.includeDemo ?? true

  let query = supabase
    .from("seat_layouts")
    .select("*")
    .eq("class_id", classId)

  if (!includeDemo) {
    query = query.eq("is_demo", false)
  }

  const { data, error } = await query
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
    .eq("is_demo", false)
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

export async function getSeatLayoutHistoryForAdmin(
  limit = 200
): Promise<AdminSeatLayoutHistoryItem[]> {
  const supabase = await createClient()

  const { data: layouts, error: layoutsError } = await supabase
    .from("seat_layouts")
    .select("id, created_at, class_id, is_demo")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (layoutsError || !layouts) {
    console.error("Error fetching seat layout history for admin:", layoutsError)
    return []
  }

  const layoutIds = layouts.map((layout) => layout.id)
  const occupiedCountByLayoutId = new Map<string, number>()

  if (layoutIds.length > 0) {
    const { data: occupiedSeats, error: seatsError } = await supabase
      .from("seats")
      .select("layout_id")
      .in("layout_id", layoutIds)
      .not("student_name_snapshot", "is", null)

    if (seatsError) {
      console.error("Error fetching occupied seats for admin history:", seatsError)
    } else {
      for (const seat of occupiedSeats ?? []) {
        const current = occupiedCountByLayoutId.get(seat.layout_id) ?? 0
        occupiedCountByLayoutId.set(seat.layout_id, current + 1)
      }
    }
  }

  const classIds = Array.from(new Set(layouts.map((layout) => layout.class_id).filter(Boolean)))

  if (classIds.length === 0) {
    return layouts.map((layout) => ({
      id: layout.id,
      created_at: layout.created_at,
      is_demo: layout.is_demo,
      occupiedSeatCount: occupiedCountByLayoutId.get(layout.id) ?? 0,
      organizationName: null,
      grade: null,
      className: null,
      runnerName: null,
    }))
  }

  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("id, organization_id, user_id, grade, class_name")
    .in("id", classIds)

  if (classesError || !classes) {
    console.error("Error fetching classes for admin history:", classesError)
    return layouts.map((layout) => ({
      id: layout.id,
      created_at: layout.created_at,
      is_demo: layout.is_demo,
      occupiedSeatCount: occupiedCountByLayoutId.get(layout.id) ?? 0,
      organizationName: null,
      grade: null,
      className: null,
      runnerName: null,
    }))
  }

  const organizationIds = Array.from(
    new Set(classes.map((classItem) => classItem.organization_id).filter(Boolean))
  )
  const runnerIds = Array.from(new Set(classes.map((classItem) => classItem.user_id).filter(Boolean)))

  const [{ data: organizations, error: organizationsError }, { data: users, error: usersError }] =
    await Promise.all([
      organizationIds.length
        ? supabase.from("organizations").select("id, name").in("id", organizationIds)
        : Promise.resolve({ data: [], error: null }),
      runnerIds.length
        ? supabase.from("users").select("id, name").in("id", runnerIds)
        : Promise.resolve({ data: [], error: null }),
    ])

  if (organizationsError) {
    console.error("Error fetching organizations for admin history:", organizationsError)
  }

  if (usersError) {
    console.error("Error fetching users for admin history:", usersError)
  }

  const classesById = new Map(classes.map((classItem) => [classItem.id, classItem]))
  const organizationsById = new Map((organizations ?? []).map((organization) => [organization.id, organization]))
  const usersById = new Map((users ?? []).map((user) => [user.id, user]))

  return layouts.map((layout) => {
    const classItem = classesById.get(layout.class_id)
    const organization = classItem ? organizationsById.get(classItem.organization_id) : null
    const runner = classItem ? usersById.get(classItem.user_id) : null

    return {
      id: layout.id,
      created_at: layout.created_at,
      is_demo: layout.is_demo,
      occupiedSeatCount: occupiedCountByLayoutId.get(layout.id) ?? 0,
      organizationName: organization?.name ?? null,
      grade: classItem?.grade ?? null,
      className: classItem?.class_name ?? null,
      runnerName: runner?.name ?? null,
    }
  })
}
