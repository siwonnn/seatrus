"use client"

import { useEffect, useRef, useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Student } from "@/types/database"
import { addStudent, removeStudent } from "@/app/main/actions/students"

interface StudentsProps {
  classId: string | null
  initialStudents: Student[]
  onStudentsChange?: (students: Student[]) => void
}

export default function Students({ classId, initialStudents, onStudentsChange }: StudentsProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [studentNumber, setStudentNumber] = useState("")
  const [studentName, setStudentName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const numberInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setStudents(initialStudents)
  }, [initialStudents])

  useEffect(() => {
    onStudentsChange?.(students)
  }, [onStudentsChange, students])

  const handleAddStudent = async () => {
    if (!classId) {
      setError("학급 정보가 없습니다.")
      return
    }

    const number = parseInt(studentNumber)
    const name = studentName.trim()

    if (!studentNumber || isNaN(number)) {
      setError("번호를 올바르게 입력해주세요.")
      return
    }

    if (number < 1 || number > 100) {
      setError("번호는 1과 100 사이여야 합니다.")
      return
    }

    if (!name) {
      setError("이름을 입력해주세요.")
      return
    }

    setIsLoading(true)
    setStudentNumber("")
    setStudentName("")
    setError("")

    const result = await addStudent({
      class_id: classId,
      number,
      name,
      deleted_at: null,
    })

    const addedStudent = result.student

    if (result.success && addedStudent) {
      setStudents((previous) => [...previous, addedStudent].sort((a, b) => a.number - b.number))
    } else {
      setError(result.error || "학생 추가에 실패했습니다.")
    }

    setIsLoading(false)
  }

  const handleDeleteStudent = async (studentId: string) => {
    setIsLoading(true)
    const success = await removeStudent(studentId)

    if (success) {
      setStudents((previous) => previous.filter((student) => student.id !== studentId))
    } else {
      setError("학생 삭제에 실패했습니다.")
    }

    setIsLoading(false)
  }

  const handleNumberEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return
    }

    event.preventDefault()
    nameInputRef.current?.focus()
  }

  const handleNameEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      numberInputRef.current?.focus()
      handleAddStudent()
    }
  }

  const isFormValid = studentNumber.trim() !== "" && studentName.trim() !== ""

  if (!classId) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">학급을 먼저 생성해주세요.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-3">
        <p className="mb-3 text-sm font-medium text-foreground">새 학생 추가</p>
        <div className="flex gap-3">
          <div className="w-24">
            <Input
              ref={numberInputRef}
              type="number"
              min="1"
              placeholder="번호"
              value={studentNumber}
              onChange={(event) => setStudentNumber(event.target.value)}
              onKeyDown={handleNumberEnter}
            />
          </div>
          <div className="flex-1">
            <Input
              ref={nameInputRef}
              type="text"
              placeholder="이름"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              onKeyDown={handleNameEnter}
            />
          </div>
          <Button
            onClick={handleAddStudent}
            disabled={isLoading || !isFormValid}
            className="px-6"
          >
            추가
          </Button>
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      {students.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">등록된 학생이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-semibold text-primary">{student.number}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteStudent(student.id)}
                disabled={isLoading}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
