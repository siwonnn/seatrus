"use server"

import { createStudent, deleteStudent, getStudentsByClassId } from "@/lib/database/students"
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
    return await createStudent(studentData)
  } catch (error) {
    console.error("Error adding student:", error)
    return { success: false, error: "학생 추가에 실패했습니다." }
  }
}

export async function removeStudent(studentId: string) {
  try {
    return await deleteStudent(studentId)
  } catch (error) {
    console.error("Error deleting student:", error)
    return false
  }
}
