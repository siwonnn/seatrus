"use client"

import { useState } from "react"
import { Class } from "@/types/database"
import Sidebar from "./components/Sidebar"
import CreateSeats from "./components/CreateSeats"
import StudentManagement from "./components/StudentManagement"
import SeatSettings from "./components/SeatSettings"
import History from "./components/History"
import Settings from "./components/Settings"

type TabId = "create-seats" | "student-management" | "seat-settings" | "history" | "settings"

interface AppClientProps {
  user: {
    id: string
    name: string | null
    email: string | null
  }
  organizationName: string | null
  classData: Class | null
}

export default function AppClient({ user, organizationName, classData }: AppClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("create-seats")

  const renderContent = () => {
    switch (activeTab) {
      case "create-seats":
        return <CreateSeats />
      case "student-management":
        return <StudentManagement classId={classData?.id || null} />
      case "seat-settings":
        return <SeatSettings />
      case "history":
        return <History />
      case "settings":
        return <Settings />
      default:
        return <CreateSeats />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        organizationName={organizationName}
        classData={classData}
      />
      <main className="flex-1 overflow-auto bg-neutral-50">
        <div className="container mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
