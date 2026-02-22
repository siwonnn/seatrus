"use server"

import { addDisabledSeat, removeDisabledSeat } from "@/lib/database/classDisabledSeats"
import { updateClassSeatStructure } from "@/lib/database/classes"

type SaveSeatStructureResult =
  | { success: true; rows: number; columns: number }
  | { success: false; error: string }

export async function saveSeatStructure(
  classId: string,
  rows: number,
  columns: number
): Promise<SaveSeatStructureResult> {
  if (!classId) {
    return { success: false, error: "학급 정보가 없습니다." }
  }

  if (rows < 1 || columns < 1) {
    return { success: false, error: "행과 열은 1 이상이어야 합니다." }
  }

  try {
    const updatedClass = await updateClassSeatStructure(classId, rows, columns)

    if (!updatedClass) {
      return { success: false, error: "자리 구조 저장에 실패했습니다." }
    }

    return {
      success: true,
      rows: updatedClass.rows,
      columns: updatedClass.columns,
    }
  } catch (error) {
    console.error("Error saving class seat structure:", error)
    return { success: false, error: "자리 구조 저장에 실패했습니다." }
  }
}

type ToggleSeatEnabledResult =
  | { success: true }
  | { success: false; error: string }

export async function toggleSeatEnabled(
  classId: string,
  row: number,
  column: number,
  isEnabled: boolean
): Promise<ToggleSeatEnabledResult> {
  if (!classId) {
    return { success: false, error: "학급 정보가 없습니다." }
  }

  if (row < 1 || column < 1) {
    return { success: false, error: "자리 위치가 올바르지 않습니다." }
  }

  try {
    const success = isEnabled
      ? await removeDisabledSeat(classId, row, column)
      : await addDisabledSeat(classId, row, column)

    if (!success) {
      return { success: false, error: "자리 활성 상태 저장에 실패했습니다." }
    }

    return { success: true }
  } catch (error) {
    console.error("Error toggling seat enabled state:", error)
    return { success: false, error: "자리 활성 상태 저장에 실패했습니다." }
  }
}