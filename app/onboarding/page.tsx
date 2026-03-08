import { getServerSideSession } from "@/lib/session"
import { getAppUser } from "@/lib/database/users"
import { redirect } from "next/navigation"
import Onboarding from "./Onboarding"

const HAFS_DOMAIN = "hafs.hs.kr"
const HAFS_SCHOOL_NAME = "용인한국외국어대학교부설고등학교"

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

  const email = session.user.email?.toLowerCase() ?? ""
  const emailDomain = email.includes("@") ? email.split("@")[1] : ""
  const fixedSchoolName = emailDomain === HAFS_DOMAIN ? HAFS_SCHOOL_NAME : null

  return <Onboarding fixedSchoolName={fixedSchoolName} />
}