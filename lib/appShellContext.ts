import { getClassesByUserId } from "@/lib/database/classes"
import { getOrganizationById } from "@/lib/database/organizations"
import { getAppUser } from "@/lib/database/users"
import { getServerSideSession } from "@/lib/session"
import { Class } from "@/types/database"
import { redirect } from "next/navigation"

interface AppShellContext {
  user: {
    id: string
    name: string | null
    email: string | null
  }
  organizationName: string | null
  classData: Class | null
}

export async function getAppShellContext(): Promise<AppShellContext> {
  const session = await getServerSideSession()

  if (!session) {
    redirect("/")
  }

  const appUser = await getAppUser(session.user.id)
  if (!appUser?.onboarded) {
    redirect("/onboarding")
  }

  const classes = await getClassesByUserId(session.user.id)

  let organizationName: string | null = null
  if (appUser.organization_id) {
    const organization = await getOrganizationById(appUser.organization_id)
    organizationName = organization?.name || null
  }

  return {
    user: {
      id: appUser.id,
      name: appUser.name,
      email: appUser.email,
    },
    organizationName,
    classData: classes[0] || null,
  }
}
