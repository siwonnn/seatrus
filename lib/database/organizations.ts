"use server"

import { createClient } from "@/lib/supabase/server"
import { Organization, OrganizationInsert } from "@/types/database"

// Get organization by name
export async function getOrganizationByName(
  name: string
): Promise<Organization | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("name", name)
    .single()

  if (error) {
    return null
  }

  return data as Organization
}

// Create a new organization
export async function createOrganization(
  name: string
): Promise<Organization | null> {
  const supabase = await createClient()

  const newOrganization: OrganizationInsert = {
    name,
  }

  const { data, error } = await supabase
    .from("organizations")
    .insert(newOrganization)
    .select()
    .single()

  if (error) {
    console.error("Error creating organization:", error)
    return null
  }

  return data as Organization
}

// Get or create organization by name
export async function getOrCreateOrganization(
  name: string
): Promise<Organization | null> {
  // try to get existing organization
  let organization = await getOrganizationByName(name)

  // create new if doesn't exist
  if (!organization) {
    organization = await createOrganization(name)
  }

  return organization
}
