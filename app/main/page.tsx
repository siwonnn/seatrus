import { getDisabledSeatsByClassId } from "@/lib/database/classDisabledSeats"
import { getClassesByUserId } from "@/lib/database/classes"
import { getStudentsByClassId } from "@/lib/database/students"
import AppShell from "@/app/AppShell"
import { getAppShellContext } from "@/lib/appShellContext"
import { Student } from "@/types/database"
import Main from "./Main"

export default async function MainPage() {
  const shellContext = await getAppShellContext()
  const classes = await getClassesByUserId(shellContext.user.id)
  const classData = classes[0] || null

  let initialStudents: Student[] = []
  let studentCount = 0
  let initialDisabledSeats: Array<{ row: number; column: number }> = []
  if (classData?.id) {
    const students = await getStudentsByClassId(classData.id)
    const disabledSeats = await getDisabledSeatsByClassId(classData.id)
    initialStudents = students
    studentCount = students.length
    initialDisabledSeats = disabledSeats.map((seat) => ({ row: seat.row, column: seat.column }))
  }

  return (
    <AppShell
      user={shellContext.user}
      organizationName={shellContext.organizationName}
      classData={shellContext.classData}
    >
      <Main
        classId={classData?.id || null}
        studentCount={studentCount}
        initialRows={Math.max(1, classData?.rows || 1)}
        initialColumns={Math.max(1, classData?.columns || 1)}
        initialPreventSameSeat={classData?.prevent_same_seat ?? false}
        initialPreventSamePair={classData?.prevent_same_pair ?? false}
        initialPreventBackToBack={classData?.prevent_back_to_back ?? false}
        initialStudents={initialStudents}
        initialDisabledSeats={initialDisabledSeats}
      />
    </AppShell>
  )
}
