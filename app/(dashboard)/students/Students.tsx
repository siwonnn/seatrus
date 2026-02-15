"use client"

import { useState, useEffect, useRef } from "react"
import { Student } from "@/types/database"
import { getStudentsByClassId, createStudent, deleteStudent } from "@/lib/database/students"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, User, UserPlus } from "lucide-react"

interface StudentsProps {
  classId: string | null
}

export default function Students({ classId }: StudentsProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [studentNumber, setStudentNumber] = useState("")
  const [studentName, setStudentName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const numberInputRef = useRef<HTMLInputElement>(null)

  const loadStudents = async () => {
    if (!classId) return

    setIsLoading(true)
    const data = await getStudentsByClassId(classId)
    setStudents(data)
    setIsLoading(false)
  }

  useEffect(() => {
    if (classId) {
      loadStudents()
    }
  }, [classId])

  const handleAddStudent = async () => {
    if (!classId) {
      setError("학급 정보가 없습니다.")
      return
    }

    const number = parseInt(studentNumber)
    const name = studentName.trim()

    if (!studentNumber || isNaN(number) || number <= 0) {
      setError("번호를 올바르게 입력해주세요.")
      return
    }

    if (!name) {
      setError("이름을 입력해주세요.")
      return
    }

    setIsLoading(true)
    setError("")

    const result = await createStudent({
      class_id: classId,
      number: number,
      name: name,
      deleted_at: null,
    })

    if (result.success && result.student) {
      setStudents([...students, result.student].sort((a, b) => a.number - b.number))
      setStudentNumber("")
      setStudentName("")
      setTimeout(() => {
        numberInputRef.current?.focus()
      }, 0)
    } else {
      setError(result.error || "학생 추가에 실패했습니다.")
    }

    setIsLoading(false)
  }

  const handleDeleteStudent = async (studentId: string) => {
    setIsLoading(true)
    const success = await deleteStudent(studentId)

    if (success) {
      setStudents(students.filter((student) => student.id !== studentId))
    } else {
      setError("학생 삭제에 실패했습니다.")
    }

    setIsLoading(false)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAddStudent()
    }
  }

  const isFormValid = studentNumber.trim() !== "" && studentName.trim() !== ""

  if (!classId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">학생 관리</h1>
          <p className="text-muted-foreground mt-2">학급을 먼저 생성해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">학생 관리</h1>
        <p className="text-muted-foreground mt-2">학생을 추가하고 관리하세요.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            새 학생 추가
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="w-24">
              <input
                ref={numberInputRef}
                type="number"
                min="1"
                placeholder="번호"
                value={studentNumber}
                onChange={(event) => setStudentNumber(event.target.value)}
                onKeyDown={handleKeyPress}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40"
                disabled={isLoading}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="이름"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                onKeyDown={handleKeyPress}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40"
                disabled={isLoading}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            학생 목록
          </CardTitle>
          <CardDescription>총 {students.length}명</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              등록된 학생이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
