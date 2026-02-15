"use client"

import Sidebar from "@/app/(dashboard)/Sidebar"
import { Class } from "@/types/database"

interface DashboardShellProps {
  user: {
    id: string
    name: string | null
    email: string | null
  }
  organizationName: string | null
  classData: Class | null
  children: React.ReactNode
}

export default function DashboardShell({
  user,
  organizationName,
  classData,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        user={user}
        organizationName={organizationName}
        classData={classData}
      />
      <main className="flex-1 overflow-auto bg-neutral-50">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
