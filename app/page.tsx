import { getServerSideSession } from "@/lib/session"
import { getAppUser } from "@/lib/database/users"
import { redirect } from "next/navigation"
import HomeClient from "./HomeClient"

export default async function HomePage() {
  const session = await getServerSideSession()

  // check if user is logged in | completed onboarding
  if (session) {
    const appUser = await getAppUser(session.user.id)
    if (appUser?.onboarded) {
      redirect("/app")
    } else {
      redirect("/onboarding")
    }
  }

  return <HomeClient />
}