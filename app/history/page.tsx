import AppShell from "@/app/AppShell"
import { getAppShellContext } from "@/lib/appShellContext"
import { getSeatLayoutsByClassId } from "@/lib/database/seatLayouts"
import History from "./History"

export default async function HistoryPage() {
  const shellContext = await getAppShellContext()
  const classId = shellContext.classData?.id || null

  const layouts = classId ? await getSeatLayoutsByClassId(classId, 100) : []

  return (
    <AppShell
      user={shellContext.user}
      organizationName={shellContext.organizationName}
      classData={shellContext.classData}
    >
      <History layouts={layouts} />
    </AppShell>
  )
}
