"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { deleteSeatLayoutAction } from "./actions"

export default function DeleteLayoutButton({ layoutId }: { layoutId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleDelete = async () => {
    setIsPending(true)
    await deleteSeatLayoutAction(layoutId)
    setOpen(false)
    router.refresh()
    setIsPending(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>자리 배치 삭제</DialogTitle>
          <DialogDescription>
            이 자리 배치를 삭제하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>취소</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
