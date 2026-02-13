"use server"

import { createClient } from "@/lib/supabase/server"
import { AppUser, AppUserInsert, AppUserUpdate } from "@/types/database"

// Initialize a new user in app.users table when first sign in
export async function initializeAppUser(
  userId: string,
  name: string | null,
  email: string | null
): Promise<AppUser | null> {
  const supabase = await createClient()

  // Create new app user
  const newUser: AppUserInsert = {
    id: userId,
    organization_id: null,
    name,
    email,
    onboarded: false,
    credits: 0,
  }

  const { data, error } = await supabase
    .from("users")
    .insert(newUser)
    .select()
    .single()

  if (error) {
    console.error("Error initializing app user:", error)
    return null
  }

  return data as AppUser
}

// Get app user by id
export async function getAppUser(userId: string): Promise<AppUser | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error fetching app user:", error)
    return null
  }

  return data as AppUser
}

// Update app user
export async function updateAppUser(
  userId: string,
  updates: AppUserUpdate
): Promise<AppUser | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating app user:", error)
    return null
  }

  return data as AppUser
}
