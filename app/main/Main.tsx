"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { CircleHelp, LayoutGrid, User } from "lucide-react"
import { randomizeSeatsForClass } from "./actions/randomize-seats"
import { saveStructureDraft } from "./actions/structure"
import { formatSeoulDateLong, formatSeoulRelativeDay } from "@/lib/date"

interface MainProps {
  classId: string | null
  initialRows: number
  initialColumns: number
  initialPreventSameSeat: boolean
  initialPreventSamePair: boolean
  initialPreventBackToBack: boolean
  initialStudents: Student[]
  initialDisabledSeats: Array<{ row: number; column: number }>
  initialLatestLayoutCreatedAt: string | null
  classGrade: number | null
  className: string | null
}

export default function Main({
  classId,
  initialRows,
  initialColumns,
  initialPreventSameSeat,
  initialPreventSamePair,
  initialPreventBackToBack,
  initialStudents,
  initialDisabledSeats,
  initialLatestLayoutCreatedAt,
  classGrade,
  className,
}: MainProps) {
  const router = useRouter()
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
  const [persistedStructure, setPersistedStructure] = useState<{
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
  const [isSavingStructure, setIsSavingStructure] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [runningMode, setRunningMode] = useState<"official" | "demo" | null>(null)
  const [runError, setRunError] = useState("")
  const [latestLayoutCreatedAt, setLatestLayoutCreatedAt] = useState<string | null>(
    initialLatestLayoutCreatedAt
  )
  const [structureSaveError, setStructureSaveError] = useState("")
  const currentStudentCount = students.length
  const enabledSeatCount = Math.max(0, structure.rows * structure.columns - structure.disabledSeats.length)
  const isSeatCountMatched = enabledSeatCount === currentStudentCount
  const mainTitle = classGrade && className
    ? `${classGrade}학년 ${className}반 자리 배치`
    : "자리 배치"

  const alerts: Array<{ id: string; tone: "warning" | "info"; message: string }> = []
  if (runError) {
    alerts.push({
      id: "run-failed",
      tone: "warning",
      message: runError,
    })
  }
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
      message: `활성 자리 수(${enabledSeatCount})와 학생 수(${currentStudentCount})가 다릅니다. 자리 구조 설정에서 활성 자리 수를 조정해주세요.`,
    })
  }
  if (structureSaveError) {
    alerts.push({
      id: "structure-save-failed",
      tone: "warning",
      message: structureSaveError,
    })
  }

  const normalizeDisabledSeats = (seats: Array<{ row: number; column: number }>) => {
    return [...seats].sort((a, b) => (a.row === b.row ? a.column - b.column : a.row - b.row))
  }

  const areStructuresEqual = (
    previous: { rows: number; columns: number; disabledSeats: Array<{ row: number; column: number }> },
    next: { rows: number; columns: number; disabledSeats: Array<{ row: number; column: number }> }
  ) => {
    if (previous.rows !== next.rows || previous.columns !== next.columns) {
      return false
    }

    const previousSeats = normalizeDisabledSeats(previous.disabledSeats)
    const nextSeats = normalizeDisabledSeats(next.disabledSeats)

    if (previousSeats.length !== nextSeats.length) {
      return false
    }

    return previousSeats.every(
      (seat, index) => seat.row === nextSeats[index].row && seat.column === nextSeats[index].column
    )
  }

  const handleStructureDialogOpenChange = async (nextOpen: boolean) => {
    if (isSavingStructure) {
      return
    }

    if (nextOpen) {
      setStructureSaveError("")
      setStructureDialogOpen(true)
      return
    }

    if (!classId) {
      setStructureDialogOpen(false)
      return
    }

    if (areStructuresEqual(persistedStructure, structure)) {
      setStructureDialogOpen(false)
      return
    }

    setIsSavingStructure(true)
    setStructureSaveError("")

    const result = await saveStructureDraft(
      classId,
      structure.rows,
      structure.columns,
      structure.disabledSeats
    )

    if (!result.success) {
      setStructureSaveError(result.error)
      setIsSavingStructure(false)
      return
    }

    setPersistedStructure({
      rows: result.rows,
      columns: result.columns,
      disabledSeats: structure.disabledSeats,
    })

    setIsSavingStructure(false)
    setStructureDialogOpen(false)
  }

  const handleRunSeatRandomization = async (mode: "official" | "demo") => {
    if (!classId || isRunning) {
      return
    }

    if (!isSeatCountMatched) {
      setRunError("활성 자리 수와 학생 수가 같아야 배치를 실행할 수 있습니다.")
      return
    }

    setIsRunning(true)
    setRunningMode(mode)
    setRunError("")

    try {
      const result = await randomizeSeatsForClass(classId, {
        isDemo: mode === "demo",
      })

      if (!result.success) {
        setRunError(result.error)
        setIsRunning(false)
        setRunningMode(null)
        return
      }

      if (mode === "official") {
        setLatestLayoutCreatedAt(new Date().toISOString())
      }
      router.push(`/history/${result.layoutId}`)
    } catch (error) {
      console.error("Error running seat randomization:", error)
      setRunError("자리 배치 실행 중 오류가 발생했습니다. 다시 시도해주세요.")
      setIsRunning(false)
      setRunningMode(null)
    }
  }

  return (
    <div className="w-full space-y-5">
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{mainTitle}</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>자리 배치</CardTitle>
          <CardDescription>
            현재 학생 정보, 자리 구조와 규칙을 바탕으로 새로운 자리를 랜덤 배치합니다.
          </CardDescription>
          {latestLayoutCreatedAt ? (
            <p className="text-sm text-muted-foreground">
              마지막 배치: {formatSeoulDateLong(latestLayoutCreatedAt)} ({formatSeoulRelativeDay(latestLayoutCreatedAt)})
            </p>
          ) : null}
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
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="lg"
              className="text-lg font-semibold"
              onClick={() => handleRunSeatRandomization("official")}
              disabled={
                isRunning ||
                !classId ||
                !isSeatCountMatched ||
                currentStudentCount === 0
              }
            >
              {isRunning && runningMode === "official" ? "배치 실행 중..." : "자리 새로 배치하기"}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="text-md"
              onClick={() => handleRunSeatRandomization("demo")}
              disabled={
                isRunning ||
                !classId ||
                !isSeatCountMatched ||
                currentStudentCount === 0
              }
            >
              {isRunning && runningMode === "demo" ? (
                "시범 배치 중..."
              ) : (
                <span className="flex items-center gap-1.5">
                  시범 배치
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          role="button"
                          aria-label="시범 배치 안내"
                          className="inline-flex h-3 w-3 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                          }}
                        >
                          <CircleHelp className="h-2.5 w-2.5" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={6}>
                        시범 배치는 자리 배치 기록이 히스토리에 남지 않습니다.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              )}
            </Button>
          </div>
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
              <Dialog open={structureDialogOpen} onOpenChange={handleStructureDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm" disabled={isSavingStructure}>
                    {isSavingStructure ? "저장 중..." : "자리 구조 설정"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto" showCloseButton={!isSavingStructure}>
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
