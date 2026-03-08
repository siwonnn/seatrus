import { getDisabledSeatsByClassId } from "@/lib/database/classDisabledSeats"
import { getClassesByUserId } from "@/lib/database/classes"
import { getStudentsByClassId } from "@/lib/database/students"
import { getLatestSeatLayoutByClassId } from "@/lib/database/seatLayouts"
import AppShell from "@/app/AppShell"
import { getAppShellContext } from "@/lib/appShellContext"
import { Student } from "@/types/database"
import Main from "./Main"

export default async function MainPage() {
  const shellContext = await getAppShellContext()
  const classes = await getClassesByUserId(shellContext.user.id)
  const classData = classes[0] || null

  let initialStudents: Student[] = []
  let initialDisabledSeats: Array<{ row: number; column: number }> = []
  let initialLatestLayoutCreatedAt: string | null = null
  if (classData?.id) {
    const [students, disabledSeats, latestLayout] = await Promise.all([
      getStudentsByClassId(classData.id),
      getDisabledSeatsByClassId(classData.id),
      getLatestSeatLayoutByClassId(classData.id),
    ])
    initialStudents = students
    initialDisabledSeats = disabledSeats.map((seat) => ({ row: seat.row, column: seat.column }))
    initialLatestLayoutCreatedAt = latestLayout?.created_at ?? null
  }

  return (
    <AppShell
      user={shellContext.user}
      organizationName={shellContext.organizationName}
      classData={shellContext.classData}
    >
      <Main
        classId={classData?.id || null}
        initialRows={Math.max(1, classData?.rows || 1)}
        initialColumns={Math.max(1, classData?.columns || 1)}
        initialPreventSameSeat={classData?.prevent_same_seat ?? false}
        initialPreventSamePair={classData?.prevent_same_pair ?? false}
        initialPreventBackToBack={classData?.prevent_back_to_back ?? false}
        initialStudents={initialStudents}
        initialDisabledSeats={initialDisabledSeats}
        initialLatestLayoutCreatedAt={initialLatestLayoutCreatedAt}
        classGrade={classData?.grade ?? null}
        className={classData?.class_name ?? null}
      />
    </AppShell>
  )
}
