"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import RuleSettings from "./components/RuleSettings"
import StructureSettings from "./components/StructureSettings"
import Students from "./components/Students"
import { Student } from "@/types/database"
import { LayoutGrid, User } from "lucide-react"

interface MainProps {
  classId: string | null
  studentCount: number
  initialRows: number
  initialColumns: number
  initialPreventSameSeat: boolean
  initialPreventSamePair: boolean
  initialPreventBackToBack: boolean
  initialStudents: Student[]
  initialDisabledSeats: Array<{ row: number; column: number }>
}

export default function Main({
  classId,
  studentCount,
  initialRows,
  initialColumns,
  initialPreventSameSeat,
  initialPreventSamePair,
  initialPreventBackToBack,
  initialStudents,
  initialDisabledSeats,
}: MainProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [structure, setStructure] = useState<{
    rows: number
    columns: number
    disabledSeats: Array<{ row: number; column: number }>
  }>({
    rows: initialRows,
    columns: initialColumns,
    disabledSeats: initialDisabledSeats,
  })
  const [studentDialogOpen, setStudentDialogOpen] = useState(false)
  const [structureDialogOpen, setStructureDialogOpen] = useState(false)
  const currentStudentCount = students.length
  const enabledSeatCount = Math.max(0, structure.rows * structure.columns - structure.disabledSeats.length)
  const isSeatCountMatched = enabledSeatCount === currentStudentCount

  const alerts: Array<{ id: string; tone: "warning" | "info"; message: string }> = []
  if (!classId) {
    alerts.push({
      id: "no-class",
      tone: "warning",
      message: "학급 정보가 없습니다. 먼저 학급을 생성해주세요.",
    })
  }
  if (classId && currentStudentCount === 0) {
    alerts.push({
      id: "no-students",
      tone: "warning",
      message: "학생이 없습니다. 학생 설정에서 학생을 등록해주세요.",
    })
  }
  if (classId && currentStudentCount > 0 && !isSeatCountMatched) {
    alerts.push({
      id: "seat-mismatch",
      tone: "warning",
      message: `활성 자리 수(${enabledSeatCount})와 학생 수(${currentStudentCount})가 다릅니다.`,
    })
  }
  if (classId && alerts.length === 0) {
    alerts.push({
      id: "ready",
      tone: "info",
      message: "실행 준비가 완료되었습니다. 규칙을 확인한 뒤 자리 배치를 실행하세요.",
    })
  }

  return (
    <div className="w-full max-w-6xl space-y-5">
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">자리 배치 생성</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            실행 전 상태를 확인하고, 규칙을 점검한 뒤 자리 배치를 실행하세요.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>자리 배치 실행</CardTitle>
          <CardDescription>
            현재 구조/규칙/학생 정보를 바탕으로 새 배치를 생성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={
                  alert.tone === "warning"
                    ? "rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
                    : "rounded-lg border border-primary/40 bg-primary/10 p-3 text-sm text-primary"
                }
              >
                {alert.message}
              </div>
            ))}
          </div>
          <Button type="button" size="lg">자리 배치 실행</Button>
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle>학생 수</CardTitle>
              </div>
              <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">학생 설정</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto" showCloseButton>
                  <DialogHeader>
                    <DialogTitle className="flex gap-2">
                      <User className="h-5 w-5" />
                      학생 설정
                    </DialogTitle>
                  </DialogHeader>
                  <Students
                    classId={classId}
                    initialStudents={students}
                    onStudentsChange={setStudents}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight text-foreground">{currentStudentCount}명</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle>자리 구조</CardTitle>
              </div>
              <Dialog open={structureDialogOpen} onOpenChange={setStructureDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">자리 구조 설정</Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto" showCloseButton>
                  <DialogHeader>
                    <DialogTitle className="flex gap-2">
                      <LayoutGrid className="h-5 w-5" />
                      자리 구조 설정
                    </DialogTitle>
                  </DialogHeader>
                  <StructureSettings
                    classId={classId}
                    initialRows={structure.rows}
                    initialColumns={structure.columns}
                    studentCount={currentStudentCount}
                    initialDisabledSeats={structure.disabledSeats}
                    onStructureChange={setStructure}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-semibold tracking-tight text-foreground">{structure.rows}행 {structure.columns}열</p>
              <p className="text-sm text-muted-foreground">활성 자리 {enabledSeatCount}개</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <RuleSettings
            classId={classId}
            initialPreventSameSeat={initialPreventSameSeat}
            initialPreventSamePair={initialPreventSamePair}
            initialPreventBackToBack={initialPreventBackToBack}
          />
        </div>
      </div>
    </div>
  )
}
