import { getServerSideSession } from "@/lib/session"
import { getAppUser } from "@/lib/database/users"
import { redirect } from "next/navigation"
import Onboarding from "./Onboarding"

export default async function OnboardingPage() {
  const session = await getServerSideSession()
  
  if (!session) {
    redirect("/")
  }

  // check if user completed onboarding
  const appUser = await getAppUser(session.user.id)  
  if (appUser?.onboarded) {
    redirect("/main")
  }

  return <Onboarding />
}