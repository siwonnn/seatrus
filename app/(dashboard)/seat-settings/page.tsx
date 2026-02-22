import { getDisabledSeatsByClassId } from "@/lib/database/classDisabledSeats"
import { getClassesByUserId } from "@/lib/database/classes"
import { getStudentsByClassId } from "@/lib/database/students"
import { getUser } from "@/lib/user"
import SeatSettings from "./SeatSettings"

export default async function SeatSettingsPage() {
  const user = await getUser()
  const classes = await getClassesByUserId(user.id)
  const classData = classes[0] || null

  let studentCount = 0
  let initialDisabledSeats: Array<{ row: number; column: number }> = []
  if (classData?.id) {
    const students = await getStudentsByClassId(classData.id)
    const disabledSeats = await getDisabledSeatsByClassId(classData.id)
    studentCount = students.length
    initialDisabledSeats = disabledSeats.map((seat) => ({ row: seat.row, column: seat.column }))
  }

  return (
    <SeatSettings
      classId={classData?.id || null}
      initialRows={Math.max(1, classData?.rows || 1)}
      initialColumns={Math.max(1, classData?.columns || 1)}
      studentCount={studentCount}
      initialDisabledSeats={initialDisabledSeats}
    />
  )
}
