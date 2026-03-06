"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Check, Minus, Plus, X } from "lucide-react"
import { saveClassRules, saveSeatStructure, toggleSeatEnabled } from "./actions"

interface SeatSettingsProps {
  classId: string | null
  initialRows: number
  initialColumns: number
  initialPreventSameSeat: boolean
  initialPreventSamePair: boolean
  initialPreventBackToBack: boolean
  studentCount: number
  initialDisabledSeats: Array<{ row: number; column: number }>
}

export default function SeatSettings({
  classId,
  initialRows,
  initialColumns,
  initialPreventSameSeat,
  initialPreventSamePair,
  initialPreventBackToBack,
  studentCount,
  initialDisabledSeats,
}: SeatSettingsProps) {
  const disabledSeatKeySet = new Set(initialDisabledSeats.map((seat) => `${seat.row}-${seat.column}`))
  const [rows, setRows] = useState(initialRows)
  const [columns, setColumns] = useState(initialColumns)
  const [enabledSeats, setEnabledSeats] = useState<boolean[]>(
    Array.from({ length: initialRows * initialColumns }, (_, index) => {
      const row = Math.floor(index / initialColumns) + 1
      const column = (index % initialColumns) + 1
      return !disabledSeatKeySet.has(`${row}-${column}`)
    })
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [preventSameSeat, setPreventSameSeat] = useState(initialPreventSameSeat)
  const [preventSamePair, setPreventSamePair] = useState(initialPreventSamePair)
  const [preventBackToBack, setPreventBackToBack] = useState(initialPreventBackToBack)

  const enabledSeatCount = enabledSeats.filter(Boolean).length
  const isSeatCountMatched = enabledSeatCount === studentCount

  const resizeEnabledSeats = (nextRows: number, nextColumns: number) => {
    const nextTotal = nextRows * nextColumns
    setEnabledSeats((previous) => {
      if (previous.length === nextTotal) {
        return previous
      }

      if (previous.length > nextTotal) {
        return previous.slice(0, nextTotal)
      }

      return [...previous, ...Array.from({ length: nextTotal - previous.length }, () => true)]
    })
  }

  const updateStructure = async (nextRows: number, nextColumns: number) => {
    if (!classId) {
      setError("학급 정보가 없습니다.")
      return
    }

    if (nextRows < 1 || nextColumns < 1) {
      return
    }

    setIsLoading(true)
    setError("")

    const result = await saveSeatStructure(classId, nextRows, nextColumns)

    if (result.success) {
      setRows(result.rows)
      setColumns(result.columns)
      resizeEnabledSeats(result.rows, result.columns)
    } else {
      setError(result.error || "자리 구조 저장에 실패했습니다.")
    }

    setIsLoading(false)
  }

  const handleAddRow = () => updateStructure(rows + 1, columns)
  const handleRemoveRow = () => updateStructure(rows - 1, columns)
  const handleAddColumn = () => updateStructure(rows, columns + 1)
  const handleRemoveColumn = () => updateStructure(rows, columns - 1)

  const handleToggleSeat = async (seatIndex: number) => {
    if (isLoading || !classId) {
      return
    }

    const row = Math.floor(seatIndex / columns) + 1
    const column = (seatIndex % columns) + 1
    const currentEnabled = enabledSeats[seatIndex] ?? true
    const nextEnabled = !currentEnabled

    setIsLoading(true)
    setError("")

    const result = await toggleSeatEnabled(classId, row, column, nextEnabled)

    if (result.success) {
      setEnabledSeats((previous) =>
        previous.map((isEnabled, index) => (index === seatIndex ? nextEnabled : isEnabled))
      )
    } else {
      setError(result.error || "자리 구조 저장에 실패했습니다.")
    }

    setIsLoading(false)
  }

  const handleToggleRule = async (
    key: "prevent_same_seat" | "prevent_same_pair" | "prevent_back_to_back"
  ) => {
    if (isLoading || !classId) {
      return
    }

    const nextRules = {
      prevent_same_seat: key === "prevent_same_seat" ? !preventSameSeat : preventSameSeat,
      prevent_same_pair: key === "prevent_same_pair" ? !preventSamePair : preventSamePair,
      prevent_back_to_back: key === "prevent_back_to_back" ? !preventBackToBack : preventBackToBack,
    }

    setIsLoading(true)
    setError("")

    const result = await saveClassRules(classId, nextRules)

    if (result.success) {
      setPreventSameSeat(result.prevent_same_seat)
      setPreventSamePair(result.prevent_same_pair)
      setPreventBackToBack(result.prevent_back_to_back)
    } else {
      setError(result.error || "규칙 저장에 실패했습니다.")
    }

    setIsLoading(false)
  }

  if (!classId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">배치 설정</h1>
            <p className="text-muted-foreground mt-2">학급을 먼저 생성해주세요.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">배치 설정</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>자리 구조 설정</CardTitle>
          <p className="text-muted-foreground">{rows}행 {columns}열 / 활성 자리 {enabledSeatCount}개 / 학생 {studentCount}명</p>
          <p className="text-sm text-muted-foreground">
            
          </p>
          {!isSeatCountMatched && (
            <p className="text-sm text-destructive">활성 자리 수를 학생 수와 같게 맞춰주세요.</p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="inline-flex gap-3 items-start">
            <div className="space-y-3">
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: rows * columns }).map((_, index) => {
                  const isEnabled = enabledSeats[index] ?? true

                  return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleToggleSeat(index)}
                    disabled={isLoading}
                    aria-pressed={isEnabled}
                    className={
                      isEnabled
                        ? "h-12 w-16 rounded-xl border border-primary/50 bg-primary/20 text-primary flex items-center justify-center transition-colors"
                        : "h-12 w-16 rounded-xl border border-destructive/50 bg-destructive/20 text-destructive flex items-center justify-center transition-colors"
                    }
                  >
                    {isEnabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>
                )})}
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleAddRow}
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleRemoveRow}
                  disabled={isLoading || rows <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div
              className="flex flex-col justify-center gap-2"
              style={{
                height: `calc(${rows} * 3rem + ${Math.max(rows - 1, 0)} * 0.5rem)`,
              }}
            >
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleAddColumn}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleRemoveColumn}
                disabled={isLoading || columns <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>규칙 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="grid grid-cols-[1fr_auto] items-start gap-3">
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">같은 자리 방지</p>
                <p className="text-sm text-muted-foreground">이전 배치와 같은 자리에 같은 학생이 다시 배정되는 것을 막습니다.</p>
              </div>
              <Switch
                checked={preventSameSeat}
                onCheckedChange={() => handleToggleRule("prevent_same_seat")}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="grid grid-cols-[1fr_auto] items-start gap-3">
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">같은 짝 방지</p>
                <p className="text-sm text-muted-foreground">이전 배치에서 짝이었던 학생들이 다시 짝이 되지 않도록 합니다.</p>
              </div>
              <Switch
                checked={preventSamePair}
                onCheckedChange={() => handleToggleRule("prevent_same_pair")}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="grid grid-cols-[1fr_auto] items-start gap-3">
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">연속 맨 뒷자리 방지</p>
                <p className="text-sm text-muted-foreground">특정 학생이 연속으로 맨 뒷자리에 배정되지 않도록 합니다.</p>
              </div>
              <Switch
                checked={preventBackToBack}
                onCheckedChange={() => handleToggleRule("prevent_back_to_back")}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
