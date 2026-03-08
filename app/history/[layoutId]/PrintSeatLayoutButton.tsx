"use client"

import { useEffect, useRef } from "react"
import { Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"

interface PrintSeatLayoutButtonProps {
  targetId: string
}

const pxToMm = (px: number) => (px * 25.4) / 96

export default function PrintSeatLayoutButton({ targetId }: PrintSeatLayoutButtonProps) {
  const contentRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    contentRef.current = document.getElementById(targetId)
  }, [targetId])

  const reactToPrintFn = useReactToPrint({
    contentRef,
  })

  const handlePrint = async () => {
    const el = contentRef.current
    if (!el) {
      return
    }

    const parentWidthMm = 297
    const parentHeightMm = 210
    const elWidthMm = pxToMm(el.offsetWidth)
    const elHeightMm = pxToMm(el.offsetHeight)

    const scaleX = parentWidthMm / elWidthMm
    const scaleY = parentHeightMm / elHeightMm
    const scale = Math.min(scaleX, scaleY, 1)

    el.style.setProperty("--print-scale", scale.toString())
    await reactToPrintFn()
  }

  return (
    <Button type="button" variant="default" className="gap-2" onClick={handlePrint}>
      <Printer className="h-4 w-4" />
      교사용 자리 배치도 인쇄
    </Button>
  )
}
