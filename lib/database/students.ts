"use server"

import { createClient } from "@/lib/supabase/server"
import { Student, StudentInsert } from "@/types/database"

// Get students by class id
export async function getStudentsByClassId(classId: string): Promise<Student[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("class_id", classId)
    .is("deleted_at", null)
    .order("number", { ascending: true })

  if (error) {
    console.error("Error fetching students:", error)
    return []
  }

  return data as Student[]
}

// Create a new student
export async function createStudent(
  studentData: StudentInsert
): Promise<{ success: boolean; student?: Student; error?: string }> {
  const supabase = await createClient()

  // Check if student number already exists in this class
  const { data: existingStudent } = await supabase
    .from("students")
    .select("id")
    .eq("class_id", studentData.class_id)
    .eq("number", studentData.number)
    .is("deleted_at", null)
    .single()

  if (existingStudent) {
    return { success: false, error: "이미 같은 번호의 학생이 존재합니다." }
  }

  const { data, error } = await supabase
    .from("students")
    .insert(studentData)
    .select()
    .single()

  if (error) {
    console.error("Error creating student:", error)
    return { success: false, error: "학생 추가 중 오류가 발생했습니다." }
  }

  return { success: true, student: data as Student }
}

// Soft delete a student
export async function deleteStudent(studentId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("students")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", studentId)

  if (error) {
    console.error("Error deleting student:", error)
    return false
  }

  return true
}
