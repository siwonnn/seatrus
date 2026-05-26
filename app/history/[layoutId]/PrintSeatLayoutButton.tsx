"use client"

import { useEffect, useRef, useState } from "react"
import { Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import { useProgress } from "@bprogress/next"
import { Button } from "@/components/ui/button"
import { notifySeatLayoutPrinted } from "./actions"

interface PrintSeatLayoutButtonProps {
  targetId: string
  layoutId: string
}

const pxToMm = (px: number) => (px * 25.4) / 96

export default function PrintSeatLayoutButton({ targetId, layoutId }: PrintSeatLayoutButtonProps) {
  const contentRef = useRef<HTMLElement | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const { start, stop } = useProgress()

  useEffect(() => {
    contentRef.current = document.getElementById(targetId)
  }, [targetId])

  const reactToPrintFn = useReactToPrint({
    contentRef,
  })

  const handlePrint = async () => {
    const el = contentRef.current
    if (!el || isPrinting) {
      return
    }

    setIsPrinting(true)
    start()

    const parentWidthMm = 297
    const parentHeightMm = 210
    const elWidthMm = pxToMm(el.offsetWidth)
    const elHeightMm = pxToMm(el.offsetHeight)

    const scaleX = parentWidthMm / elWidthMm
    const scaleY = parentHeightMm / elHeightMm
    const scale = Math.min(scaleX, scaleY, 1)

    el.style.setProperty("--print-scale", scale.toString())

    try {
      await notifySeatLayoutPrinted(layoutId)
    } catch (error) {
      console.error("Error notifying printed seat layout:", error)
    }

    await reactToPrintFn()

    stop()
    setIsPrinting(false)
  }

  return (
    <Button type="button" variant="default" className="gap-2" onClick={handlePrint} disabled={isPrinting}>
      <Printer className="h-4 w-4" />
      {isPrinting ? "준비 중..." : "교사용 자리 배치도 인쇄"}
    </Button>
  )
}
