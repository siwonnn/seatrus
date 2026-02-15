import { getUser } from "@/lib/user"
import { getClassesByUserId } from "@/lib/database/classes"
import { getStudentsByClassId } from "@/lib/database/students"
import { Student } from "@/types/database"
import Students from "./Students"

export default async function StudentsPage() {
  const user = await getUser()
  const classes = await getClassesByUserId(user.id)
  const classData = classes[0] || null

  let initialStudents: Student[] = []
  if (classData?.id) {
    initialStudents = await getStudentsByClassId(classData.id)
  }

  return <Students classId={classData?.id || null} initialStudents={initialStudents} />
}
