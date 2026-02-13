import { getServerSideSession } from "@/lib/session"
import { getAppUser } from "@/lib/database/users"
import { getClassesByUserId } from "@/lib/database/classes"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AppClient from "./AppClient"

export default async function AppPage() {
  const session = await getServerSideSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user completed onboarding
  const appUser = await getAppUser(session.user.id)
  if (!appUser?.onboarded) {
    redirect("/onboarding")
  }

  // Fetch user's classes
  const classes = await getClassesByUserId(session.user.id)

  // Fetch organization name
  let organizationName: string | null = null
  if (appUser.organization_id) {
    const supabase = await createClient()
    const { data } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", appUser.organization_id)
      .single()
    
    organizationName = data?.name || null
  }

  const classData = classes[0] || null

  return <AppClient user={appUser} organizationName={organizationName} classData={classData} />
}
