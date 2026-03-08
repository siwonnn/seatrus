"use server"

import { replaceDisabledSeats } from "@/lib/database/classDisabledSeats"
import { updateClassSeatStructure } from "@/lib/database/classes"

type SaveStructureResult =
  | { success: true; rows: number; columns: number }
  | { success: false; error: string }

export async function saveStructureDraft(
  classId: string,
  rows: number,
  columns: number,
  disabledSeats: Array<{ row: number; column: number }>
): Promise<SaveStructureResult> {
  if (!classId) {
    return { success: false, error: "학급 정보가 없습니다." }
  }

  if (rows < 1 || columns < 1) {
    return { success: false, error: "행과 열은 1 이상이어야 합니다." }
  }

  const hasInvalidSeat = disabledSeats.some(
    (seat) => seat.row < 1 || seat.column < 1 || seat.row > rows || seat.column > columns
  )

  if (hasInvalidSeat) {
    return { success: false, error: "비활성 자리 정보가 올바르지 않습니다." }
  }

  try {
    const updatedClass = await updateClassSeatStructure(classId, rows, columns)

    if (!updatedClass) {
      return { success: false, error: "자리 구조 저장에 실패했습니다." }
    }

    const replaced = await replaceDisabledSeats(classId, disabledSeats)
    if (!replaced) {
      return { success: false, error: "비활성 자리 저장에 실패했습니다." }
    }

    return {
      success: true,
      rows: updatedClass.rows,
      columns: updatedClass.columns,
    }
  } catch (error) {
    console.error("Error saving seat structure draft:", error)
    return { success: false, error: "자리 구조 저장에 실패했습니다." }
  }
}
