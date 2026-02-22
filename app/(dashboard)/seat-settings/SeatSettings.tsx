"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Minus, Plus, X } from "lucide-react"
import { saveSeatStructure, toggleSeatEnabled } from "./actions"

interface SeatSettingsProps {
  classId: string | null
  initialRows: number
  initialColumns: number
  studentCount: number
  initialDisabledSeats: Array<{ row: number; column: number }>
}

export default function SeatSettings({
  classId,
  initialRows,
  initialColumns,
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
    </div>
  )
}
