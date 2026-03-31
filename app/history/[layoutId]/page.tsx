import Link from "next/link"
import { notFound } from "next/navigation"
import AppShell from "@/app/AppShell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getAppShellContext } from "@/lib/appShellContext"
import { formatSeoulDate, formatSeoulDateTime } from "@/lib/date"
import { getClassById } from "@/lib/database/classes"
import { getSeatLayoutById } from "@/lib/database/seatLayouts"
import { getSeatsByLayoutId } from "@/lib/database/seats"
import { ArrowLeft } from "lucide-react"
import SeatLayoutResult from "../SeatLayoutResult"
import PrintSeatLayoutButton from "./PrintSeatLayoutButton"

interface HistoryDetailPageProps {
  params: Promise<{
    layoutId: string
  }>
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { layoutId } = await params
  const shellContext = await getAppShellContext()

  const layout = await getSeatLayoutById(layoutId)

  if (!layout) {
    notFound()
  }

  const [classData, seats] = await Promise.all([
    getClassById(layout.class_id),
    getSeatsByLayoutId(layout.id),
  ])

  if (!classData) {
    notFound()
  }

  return (
    <AppShell
      user={shellContext.user}
      organizationName={shellContext.organizationName}
      classData={shellContext.classData}
    >
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="icon" aria-label="히스토리 목록으로 이동">
            <Link href={layout.is_demo ? "/main" : "/history"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {layout.is_demo ? "시범 배치 결과" : "배치 결과"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatSeoulDateTime(layout.created_at)} 생성
            </p>
          </div>
          <div className="ml-auto print-hide">
            <PrintSeatLayoutButton targetId="seat-layout-print-card" layoutId={layout.id} />
          </div>
        </div>

        <Card id="seat-layout-print-card" className="print-card-area">
          <CardHeader>
            <CardTitle className="text-center text-4xl font-bold tracking-tight">
              {classData.grade}학년 {classData.class_name}반 자리 배치도
            </CardTitle>
            <p className="mt-2 text-center text-muted-foreground">
              {formatSeoulDate(layout.created_at)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="screen-only space-y-3">
              <SeatLayoutResult
                rows={layout.rows}
                columns={layout.columns}
                seats={seats}
                mode="student"
              />
            </div>

            <div className="print-only space-y-3">
              <SeatLayoutResult
                rows={layout.rows}
                columns={layout.columns}
                seats={seats}
                mode="teacher"
              />
            </div>
          </CardContent>
          <CardFooter className="justify-center pt-2">
            <p className="text-sm text-muted-foreground">Seatrus</p>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  )
}
