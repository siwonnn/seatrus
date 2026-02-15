"use server"

import { getStudentsByClassId, createStudent, deleteStudent } from "@/lib/database/students"
import { StudentInsert } from "@/types/database"

export async function loadStudents(classId: string) {
  try {
    return await getStudentsByClassId(classId)
  } catch (error) {
    console.error("Error loading students:", error)
    return []
  }
}

export async function addStudent(studentData: StudentInsert) {
  try {
    const result = await createStudent(studentData)
    return result
  } catch (error) {
    console.error("Error adding student:", error)
    return { success: false, error: "학생 추가에 실패했습니다." }
  }
}

export async function removeStudent(studentId: string) {
  try {
    const success = await deleteStudent(studentId)
    return success
  } catch (error) {
    console.error("Error deleting student:", error)
    return false
  }
}
