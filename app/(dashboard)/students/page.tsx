import { getUser } from "@/lib/user"
import { getClassesByUserId } from "@/lib/database/classes"
import Students from "./Students"

export default async function StudentsPage() {
  const user = await getUser()
  const classes = await getClassesByUserId(user.id)
  const classData = classes[0] || null

  return <Students classId={classData?.id || null} />
}
