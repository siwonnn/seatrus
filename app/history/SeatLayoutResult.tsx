import { Seat } from "@/types/database"

interface SeatLayoutResultProps {
  rows: number
  columns: number
  seats: Seat[]
  mode?: "student" | "teacher"
}

export default function SeatLayoutResult({
  rows,
  columns,
  seats,
  mode = "student",
}: SeatLayoutResultProps) {
  const seatByCoordinate = new Map<string, Seat>()
  for (const seat of seats) {
    seatByCoordinate.set(`${seat.row}-${seat.column}`, seat)
  }

  const pairGroups = Array.from({ length: Math.ceil(columns / 2) }, (_, index) => {
    const leftColumn = index * 2 + 1
    const rightColumn = leftColumn + 1 <= columns ? leftColumn + 1 : null

    return { leftColumn, rightColumn }
  })

  const orderedRows =
    mode === "teacher"
      ? Array.from({ length: rows }, (_, rowIndex) => rows - rowIndex)
      : Array.from({ length: rows }, (_, rowIndex) => rowIndex + 1)

  const orderedPairGroups =
    mode === "teacher"
      ? [...pairGroups].reverse().map((group) => ({
          leftColumn: group.rightColumn ?? group.leftColumn,
          rightColumn: group.rightColumn ? group.leftColumn : null,
        }))
      : pairGroups

  const renderSeatCell = (row: number, column: number) => {
    const key = `${row}-${column}`
    const seat = seatByCoordinate.get(key)

    if (!seat || !seat.student_id) {
      return (
        <div
          key={key}
          className="relative flex min-h-22 min-w-28 items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 p-2 text-center"
        >
          <p className="text-xs font-medium text-muted-foreground">빈자리</p>
        </div>
      )
    }

    return (
      <div
        key={key}
        className="relative flex min-h-22 min-w-28 items-center justify-center rounded-lg border border-primary/30 bg-primary/5 p-2"
      >
        <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {seat.student_number_snapshot}
        </div>
        <p className="px-1 text-center font-semibold text-lg text-foreground">
          {seat.student_name_snapshot}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {mode === "student" ? (
        <div className="flex justify-center">
          <div className="rounded-md border border-border bg-white px-8 py-4 font-semibold text-foreground">
            교탁
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto pb-1">
        <div className="min-w-max space-y-3">
          {orderedRows.map((row) => (
            <div key={row} className="flex justify-center">
              <div className="flex gap-6">
                {orderedPairGroups.map((group) => (
                  <div key={`pair-${row}-${group.leftColumn}`} className="flex gap-2">
                    {renderSeatCell(row, group.leftColumn)}
                    {group.rightColumn ? renderSeatCell(row, group.rightColumn) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {mode === "teacher" ? (
        <div className="flex justify-center">
          <div className="rounded-md border border-border bg-white px-8 py-4 font-semibold text-foreground">
            교탁
          </div>
        </div>
      ) : null}
    </div>
  )
}
