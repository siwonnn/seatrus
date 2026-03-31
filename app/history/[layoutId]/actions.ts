"use server"

import { getClassById } from "@/lib/database/classes"
import { getOrganizationById } from "@/lib/database/organizations"
import { getSeatLayoutById } from "@/lib/database/seatLayouts"
import { sendSlackWebhook } from "@/lib/slack"
import { getServerSideSession } from "@/lib/session"

export async function notifySeatLayoutPrinted(layoutId: string): Promise<void> {
  if (!layoutId) {
    return
  }

  const session = await getServerSideSession()
  if (!session?.user?.id) {
    return
  }

  const layout = await getSeatLayoutById(layoutId)
  if (!layout) {
    return
  }

  const classData = await getClassById(layout.class_id)
  if (!classData) {
    return
  }

  const organization = await getOrganizationById(classData.organization_id)

  const userName = session.user.name || session.user.email || "Unknown"
  const organizationName = organization?.name || "Unknown"
  const classInfo = `${classData.grade}학년 ${classData.class_name}반`

  await sendSlackWebhook(
    [
      "Seatrus - Seat Layout Printed",
      `user: ${userName}`,
      `organization: ${organizationName}`,
      `class: ${classInfo}`,
      `layoutId: ${layout.id}`,
    ].join("\n")
  )
}
