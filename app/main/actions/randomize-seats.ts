"use server"

import { getDisabledSeatsByClassId } from "@/lib/database/classDisabledSeats"
import { getClassById } from "@/lib/database/classes"
import { createSeatLayout, deleteSeatLayout, getLatestSeatLayoutByClassId } from "@/lib/database/seatLayouts"
import { createSeatsBulk, getSeatsByLayoutId } from "@/lib/database/seats"
import { getStudentsByClassId } from "@/lib/database/students"
import { SeatInsert, Student } from "@/types/database"

const MAX_ATTEMPTS = 2000

type Coordinate = { row: number; column: number }

type RandomizeSeatsResult =
  | { success: true; layoutId: string }
  | { success: false; error: string }

function toKey(row: number, column: number) {
  return `${row}-${column}`
}

function shuffleStudents(students: Student[]): Student[] {
  const next = [...students]

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = next[i]
    next[i] = next[j]
    next[j] = temp
  }

  return next
}

function buildEnabledCoordinates(
  rows: number,
  columns: number,
  disabledSeatKeySet: Set<string>
): Coordinate[] {
  const enabled: Coordinate[] = []

  for (let row = 1; row <= rows; row += 1) {
    for (let column = 1; column <= columns; column += 1) {
      if (!disabledSeatKeySet.has(toKey(row, column))) {
        enabled.push({ row, column })
      }
    }
  }

  return enabled
}

function buildAllCoordinates(rows: number, columns: number): Coordinate[] {
  const coordinates: Coordinate[] = []

  for (let row = 1; row <= rows; row += 1) {
    for (let column = 1; column <= columns; column += 1) {
      coordinates.push({ row, column })
    }
  }

  return coordinates
}

function getPartnerCoordinate(row: number, column: number, columns: number): Coordinate | null {
  if (column % 2 === 1) {
    const rightColumn = column + 1
    if (rightColumn > columns) {
      return null
    }

    return { row, column: rightColumn }
  }

  return { row, column: column - 1 }
}

function validateAgainstLatestLayout(
  assignmentByStudentId: Map<string, Coordinate>,
  classColumns: number,
  classRows: number,
  latestSeatByStudentId: Map<string, Coordinate>,
  latestPartnerByStudentId: Map<string, string>,
  latestLastRowStudentIds: Set<string>,
  rules: {
    preventSameSeat: boolean
    preventSamePair: boolean
    preventBackToBack: boolean
  }
): boolean {
  for (const [studentId, coordinate] of assignmentByStudentId.entries()) {
    if (rules.preventSameSeat) {
      const previousSeat = latestSeatByStudentId.get(studentId)
      if (previousSeat && previousSeat.row === coordinate.row && previousSeat.column === coordinate.column) {
        return false
      }
    }

    if (rules.preventBackToBack && coordinate.row === classRows && latestLastRowStudentIds.has(studentId)) {
      return false
    }

    if (rules.preventSamePair) {
      const partnerCoordinate = getPartnerCoordinate(coordinate.row, coordinate.column, classColumns)
      const previousPartnerId = latestPartnerByStudentId.get(studentId)

      if (partnerCoordinate && previousPartnerId) {
        const currentPartnerId = Array.from(assignmentByStudentId.entries()).find(([, seat]) => {
          return seat.row === partnerCoordinate.row && seat.column === partnerCoordinate.column
        })?.[0]

        if (currentPartnerId && currentPartnerId === previousPartnerId) {
          return false
        }
      }
    }
  }

  return true
}

export async function randomizeSeatsForClass(classId: string): Promise<RandomizeSeatsResult> {
  if (!classId) {
    return { success: false, error: "학급 정보가 없습니다." }
  }

  const classData = await getClassById(classId)

  if (!classData) {
    return { success: false, error: "학급을 찾을 수 없습니다." }
  }

  const [students, disabledSeats] = await Promise.all([
    getStudentsByClassId(classId),
    getDisabledSeatsByClassId(classId),
  ])

  const disabledSeatKeySet = new Set(disabledSeats.map((seat) => toKey(seat.row, seat.column)))
  const allCoordinates = buildAllCoordinates(classData.rows, classData.columns)
  const enabledCoordinates = buildEnabledCoordinates(classData.rows, classData.columns, disabledSeatKeySet)

  if (enabledCoordinates.length !== students.length) {
    return {
      success: false,
      error: `활성 자리 수(${enabledCoordinates.length})와 학생 수(${students.length})가 다릅니다.`,
    }
  }

  const latestLayout = await getLatestSeatLayoutByClassId(classId)

  const shouldApplyRules = Boolean(latestLayout)
  const latestSeats = latestLayout ? await getSeatsByLayoutId(latestLayout.id) : []

  const latestSeatByStudentId = new Map<string, Coordinate>()
  const latestPartnerByStudentId = new Map<string, string>()
  const latestLastRowStudentIds = new Set<string>()

  if (shouldApplyRules) {
    const latestStudentAtCoordinate = new Map<string, string>()
    const latestLayoutLastRow = latestLayout?.rows ?? classData.rows
    const latestLayoutColumns = latestLayout?.columns ?? classData.columns

    for (const seat of latestSeats) {
      if (!seat.student_id) {
        continue
      }

      latestSeatByStudentId.set(seat.student_id, { row: seat.row, column: seat.column })
      latestStudentAtCoordinate.set(toKey(seat.row, seat.column), seat.student_id)

      if (seat.row === latestLayoutLastRow) {
        latestLastRowStudentIds.add(seat.student_id)
      }
    }

    for (const seat of latestSeats) {
      if (!seat.student_id) {
        continue
      }

      const partnerCoordinate = getPartnerCoordinate(seat.row, seat.column, latestLayoutColumns)
      if (!partnerCoordinate) {
        continue
      }

      const partnerStudentId = latestStudentAtCoordinate.get(toKey(partnerCoordinate.row, partnerCoordinate.column))
      if (partnerStudentId) {
        latestPartnerByStudentId.set(seat.student_id, partnerStudentId)
      }
    }
  }

  const rules = {
    preventSameSeat: classData.prevent_same_seat,
    preventSamePair: classData.prevent_same_pair,
    preventBackToBack: classData.prevent_back_to_back,
  }

  let finalAssignment: Array<{ seat: Coordinate; student: Student }> | null = null

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const shuffledStudents = shuffleStudents(students)
    const assignment = enabledCoordinates.map((seat, index) => ({
      seat,
      student: shuffledStudents[index],
    }))

    if (!shouldApplyRules) {
      finalAssignment = assignment
      break
    }

    const assignmentByStudentId = new Map<string, Coordinate>()
    for (const item of assignment) {
      assignmentByStudentId.set(item.student.id, item.seat)
    }

    const isValid = validateAgainstLatestLayout(
      assignmentByStudentId,
      classData.columns,
      classData.rows,
      latestSeatByStudentId,
      latestPartnerByStudentId,
      latestLastRowStudentIds,
      rules
    )

    if (isValid) {
      finalAssignment = assignment
      break
    }
  }

  if (!finalAssignment) {
    return {
      success: false,
      error: `조건을 만족하는 배치를 찾지 못했습니다. 최대 ${MAX_ATTEMPTS}회 시도 후 중단했습니다.`,
    }
  }

  const layout = await createSeatLayout({
    class_id: classData.id,
    organization_id: classData.organization_id,
    rows: classData.rows,
    columns: classData.columns,
  })

  if (!layout) {
    return { success: false, error: "배치 히스토리 생성에 실패했습니다." }
  }

  const assignmentBySeatKey = new Map(
    finalAssignment.map(({ seat, student }) => [toKey(seat.row, seat.column), student] as const)
  )

  const seatsToInsert: SeatInsert[] = allCoordinates.map((seat) => {
    const assignedStudent = assignmentBySeatKey.get(toKey(seat.row, seat.column))

    if (!assignedStudent) {
      return {
        layout_id: layout.id,
        row: seat.row,
        column: seat.column,
        student_id: null,
        student_number_snapshot: null,
        student_name_snapshot: null,
      }
    }

    return {
      layout_id: layout.id,
      row: seat.row,
      column: seat.column,
      student_id: assignedStudent.id,
      student_number_snapshot: assignedStudent.number,
      student_name_snapshot: assignedStudent.name,
    }
  })

  const insertSuccess = await createSeatsBulk(seatsToInsert)

  if (!insertSuccess) {
    await deleteSeatLayout(layout.id)
    return { success: false, error: "배치 좌석 저장에 실패했습니다." }
  }

  return { success: true, layoutId: layout.id }
}
