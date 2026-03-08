"use client"

import { useState } from "react"
import { Check, Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StructureSettingsProps {
  classId: string | null
  initialRows: number
  initialColumns: number
  studentCount: number
  initialDisabledSeats: Array<{ row: number; column: number }>
  onStructureChange?: (next: {
    rows: number
    columns: number
    disabledSeats: Array<{ row: number; column: number }>
  }) => void
}

export default function StructureSettings({
  classId,
  initialRows,
  initialColumns,
  studentCount,
  initialDisabledSeats,
  onStructureChange,
}: StructureSettingsProps) {
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
  const enabledSeatCount = enabledSeats.filter(Boolean).length
  const isSeatCountMatched = enabledSeatCount === studentCount

  const toDisabledSeats = (seatStates: boolean[], targetColumns: number) => {
    return seatStates
      .map((isEnabled, index) => ({
        isEnabled,
        row: Math.floor(index / targetColumns) + 1,
        column: (index % targetColumns) + 1,
      }))
      .filter((seat) => !seat.isEnabled)
      .map((seat) => ({ row: seat.row, column: seat.column }))
  }

  const resizeEnabledSeats = (nextRows: number, nextColumns: number) => {
    const nextTotal = nextRows * nextColumns
    setEnabledSeats((previous) => {
      if (previous.length === nextTotal) {
        onStructureChange?.({
          rows: nextRows,
          columns: nextColumns,
          disabledSeats: toDisabledSeats(previous, nextColumns),
        })
        return previous
      }

      if (previous.length > nextTotal) {
        const nextSeatStates = previous.slice(0, nextTotal)
        onStructureChange?.({
          rows: nextRows,
          columns: nextColumns,
          disabledSeats: toDisabledSeats(nextSeatStates, nextColumns),
        })
        return nextSeatStates
      }

      const nextSeatStates = [
        ...previous,
        ...Array.from({ length: nextTotal - previous.length }, () => true),
      ]
      onStructureChange?.({
        rows: nextRows,
        columns: nextColumns,
        disabledSeats: toDisabledSeats(nextSeatStates, nextColumns),
      })
      return nextSeatStates
    })
  }

  const updateStructure = (nextRows: number, nextColumns: number) => {
    if (nextRows < 1 || nextColumns < 1) {
      return
    }

    setRows(nextRows)
    setColumns(nextColumns)
    resizeEnabledSeats(nextRows, nextColumns)
  }

  const handleAddRow = () => updateStructure(rows + 1, columns)
  const handleRemoveRow = () => updateStructure(rows - 1, columns)
  const handleAddColumn = () => updateStructure(rows, columns + 1)
  const handleRemoveColumn = () => updateStructure(rows, columns - 1)

  const handleToggleSeat = (seatIndex: number) => {
    if (!classId) {
      return
    }

    const currentEnabled = enabledSeats[seatIndex] ?? true
    const nextEnabled = !currentEnabled

    setEnabledSeats((previous) => {
      const nextSeatStates = previous.map((isEnabled, index) =>
        index === seatIndex ? nextEnabled : isEnabled
      )
      onStructureChange?.({
        rows,
        columns,
        disabledSeats: toDisabledSeats(nextSeatStates, columns),
      })
      return nextSeatStates
    })
  }

  if (!classId) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">학급을 먼저 생성해주세요.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">{rows}행 {columns}열 / 활성 자리 {enabledSeatCount}개 / 학생 {studentCount}명</p>
        {!isSeatCountMatched && (
          <p className="text-sm text-destructive">활성 자리 수를 학생 수와 같게 맞춰주세요.</p>
        )}
      </div>

      <div className="inline-flex items-start gap-2">
        <div className="space-y-2">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: rows * columns }).map((_, index) => {
              const isEnabled = enabledSeats[index] ?? true

              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleToggleSeat(index)}
                  aria-pressed={isEnabled}
                  className={
                    isEnabled
                      ? "flex h-9 w-12 items-center justify-center rounded-lg border border-primary/50 bg-primary/20 text-primary transition-colors"
                      : "flex h-9 w-12 items-center justify-center rounded-lg border border-destructive/50 bg-destructive/20 text-destructive transition-colors"
                  }
                >
                  {isEnabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </button>
              )
            })}
          </div>

          <div className="flex justify-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleAddRow}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleRemoveRow}
              disabled={rows <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className="flex flex-col justify-center gap-2"
          style={{
            height: `calc(${rows} * 2.25rem + ${Math.max(rows - 1, 0)} * 0.375rem)`,
          }}
        >
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleAddColumn}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleRemoveColumn}
            disabled={columns <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
