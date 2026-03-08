"use server"

import { updateClassRules } from "@/lib/database/classes"

type SaveClassRulesResult =
  | {
      success: true
      prevent_same_seat: boolean
      prevent_same_pair: boolean
      prevent_back_to_back: boolean
    }
  | { success: false; error: string }

export async function saveClassRules(
  classId: string,
  rules: {
    prevent_same_seat: boolean
    prevent_same_pair: boolean
    prevent_back_to_back: boolean
  }
): Promise<SaveClassRulesResult> {
  if (!classId) {
    return { success: false, error: "학급 정보가 없습니다." }
  }

  try {
    const updatedClass = await updateClassRules(classId, rules)

    if (!updatedClass) {
      return { success: false, error: "규칙 저장에 실패했습니다." }
    }

    return {
      success: true,
      prevent_same_seat: updatedClass.prevent_same_seat,
      prevent_same_pair: updatedClass.prevent_same_pair,
      prevent_back_to_back: updatedClass.prevent_back_to_back,
    }
  } catch (error) {
    console.error("Error saving class rules:", error)
    return { success: false, error: "규칙 저장에 실패했습니다." }
  }
}
