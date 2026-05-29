"use server"

import { deleteSeatLayout } from "@/lib/database/seatLayouts"
import { revalidatePath } from "next/cache"

export async function deleteSeatLayoutAction(layoutId: string): Promise<boolean> {
  const success = await deleteSeatLayout(layoutId)
  if (success) {
    revalidatePath("/history")
  }
  return success
}
