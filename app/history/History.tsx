import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatSeoulDateTime } from "@/lib/date"
import { SeatLayout } from "@/types/database"

interface HistoryProps {
  layouts: SeatLayout[]
}

export default function History({ layouts }: HistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">히스토리</h1>
        </div>
      </div>

      {layouts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            아직 생성된 자리 배치가 없습니다.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {layouts.map((layout, index) => (
            <Card key={layout.id}>
              <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-lg">배치 #{layouts.length - index}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatSeoulDateTime(layout.created_at)}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/history/${layout.id}`}>결과 보기</Link>
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
