"use server"

import { createClient } from "@/lib/supabase/server"
import { Class, ClassInsert } from "@/types/database"

// Create a new class
export async function createClass(
  classData: ClassInsert
): Promise<Class | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("classes")
    .insert(classData)
    .select()
    .single()

  if (error) {
    console.error("Error creating class:", error)
    return null
  }

  return data as Class
}

// Get classes by user id
export async function getClassesByUserId(userId: string): Promise<Class[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching classes:", error)
    return []
  }

  return data as Class[]
}

// Get classes by organization id
export async function getClassesByOrganizationId(
  organizationId: string
): Promise<Class[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("organization_id", organizationId)

  if (error) {
    console.error("Error fetching classes:", error)
    return []
  }

  return data as Class[]
}
