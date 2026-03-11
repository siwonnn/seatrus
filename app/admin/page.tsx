import AppShell from "@/app/AppShell"
import { getAppShellContext } from "@/lib/appShellContext"
import { getSeatLayoutHistoryForAdmin } from "@/lib/database/seatLayouts"
import { redirect } from "next/navigation"
import AdminHistory from "./AdminHistory"

function isAllowedAdmin(email: string | null) {
  const raw = process.env.ADMIN_EMAILS ?? ""
  const allowList = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  if (allowList.length === 0 && process.env.NODE_ENV !== "production") {
    return true
  }

  if (!email) {
    return false
  }

  return allowList.includes(email.toLowerCase())
}

export default async function AdminPage() {
  const shellContext = await getAppShellContext()

  if (!isAllowedAdmin(shellContext.user.email)) {
    redirect("/main")
  }

  const items = await getSeatLayoutHistoryForAdmin(300)

  return (
    <AppShell
      user={shellContext.user}
      organizationName={shellContext.organizationName}
      classData={shellContext.classData}
    >
      <AdminHistory items={items} />
    </AppShell>
  )
}
