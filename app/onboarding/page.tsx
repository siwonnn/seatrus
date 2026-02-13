import { getServerSideSession } from "@/lib/session"
import { getAppUser } from "@/lib/database/users"
import { redirect } from "next/navigation"
import OnboardingClient from "./OnboardingClient"

export default async function OnboardingPage() {
  const session = await getServerSideSession()
  
  if (!session) {
    redirect("/login")
  }

  // check if user completed onboarding
  const appUser = await getAppUser(session.user.id)  
  if (appUser?.onboarded) {
    redirect("/app")
  }

  return <OnboardingClient />
}