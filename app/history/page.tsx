import AppShell from "@/app/AppShell"
import { getAppShellContext } from "@/lib/appShellContext"
import History from "./History"

export default async function HistoryPage() {
  const shellContext = await getAppShellContext()

  return (
    <AppShell
      user={shellContext.user}
      organizationName={shellContext.organizationName}
      classData={shellContext.classData}
    >
      <History />
    </AppShell>
  )
}
