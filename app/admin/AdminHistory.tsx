import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatSeoulDateTime } from "@/lib/date"
import { AdminSeatLayoutHistoryItem } from "@/lib/database/seatLayouts"
import { Badge } from "@/components/ui/badge"

interface AdminHistoryProps {
  items: AdminSeatLayoutHistoryItem[]
}

export default function AdminHistory({ items }: AdminHistoryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          전체 자리 배치 실행 이력
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            조회할 자리 배치 이력이 없습니다.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <CardTitle className="text-lg">Run #{items.length - index}</CardTitle>
                <Badge variant={item.is_demo ? "secondary" : "default"}>
                  {item.is_demo ? "시범 배치" : "실제 배치"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">생성 시간:</span>{" "}
                  {formatSeoulDateTime(item.created_at)}
                </p>
                <p>
                  <span className="font-medium">반 정보:</span>{" "}
                  {item.organizationName ?? "-"} {item.grade ? `${item.grade}학년` : "-"} {" "}
                  {item.className ? `${item.className}반` : "-"}
                </p>
                <p>
                  <span className="font-medium">실행 사용자:</span> {item.runnerName ?? "-"}
                </p>
                <p>
                  <span className="font-medium">빈자리 제외 좌석 수:</span> {item.occupiedSeatCount}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
