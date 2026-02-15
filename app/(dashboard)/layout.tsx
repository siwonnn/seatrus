import { getServerSideSession } from "@/lib/session"
import { getAppUser } from "@/lib/database/users"
import { getClassesByUserId } from "@/lib/database/classes"
import { redirect } from "next/navigation"
import DashboardShell from "./DashboardShell"
import { getOrganizationById } from "@/lib/database/organizations"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSideSession()

  if (!session) {
    redirect("/login")
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

  const classData = classes[0] || null

  return (
    <DashboardShell
      user={appUser}
      organizationName={organizationName}
      classData={classData}
    >
      {children}
    </DashboardShell>
  )
}
