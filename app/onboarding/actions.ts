"use server"

import { getServerSideSession } from "@/lib/session"
import { updateAppUser } from "@/lib/database/users"
import { getOrCreateOrganization } from "@/lib/database/organizations"
import { createClass } from "@/lib/database/classes"

interface OnboardingData {
  organizationName: string
  grade: number
  className: string
}

export async function submitOnboarding(data: OnboardingData) {
  const session = await getServerSideSession()
  if (!session) {
    return { ok: false, message: "Unauthorized" }
  }

  try {
    // get or create organization
    const organization = await getOrCreateOrganization(data.organizationName)
    if (!organization) {
      return { ok: false, message: "Failed to create or fetch organization" }
    }

    // update user's organization_id and onboarded status
    const updatedUser = await updateAppUser(session.user.id, {
      organization_id: organization.id,
      onboarded: true,
    })

    if (!updatedUser) {
      return { ok: false, message: "Failed to update user" }
    }

    // create a new class for the user
    const newClass = await createClass({
      organization_id: organization.id,
      user_id: session.user.id,
      grade: data.grade,
      class_name: data.className,
      rows: 5,
      columns: 6,
      prevent_same_pair: false,
      prevent_back_to_back: false,
    })

    if (!newClass) {
      return { ok: false, message: "Failed to create class" }
    }

    return { 
      ok: true, 
      message: "Onboarding completed successfully",
      classId: newClass.id 
    }
  } catch (error) {
    console.error("Onboarding error:", error)
    return { ok: false, message: "An error occurred during onboarding" }
  }
}