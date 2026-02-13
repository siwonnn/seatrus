"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LayoutGrid, Users, Settings, History, CirclePlus, LogOut, ChevronRight } from "lucide-react"
import { signOut } from "next-auth/react"

type TabId = "create-seats" | "student-management" | "seat-settings" | "history" | "settings"

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

interface SidebarProps {
  user: {
    id: string
    name: string | null
    email: string | null
  }
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  organizationName: string | null
  classData: {
    grade: number
    class_name: string
  } | null
}

const tabs: Tab[] = [
  { id: "create-seats", label: "자리 배치 생성", icon: <CirclePlus className="w-5 h-5" /> },
  { id: "student-management", label: "학생 관리", icon: <Users className="w-5 h-5" /> },
  { id: "seat-settings", label: "배치 설정", icon: <LayoutGrid className="w-5 h-5" /> },
  { id: "history", label: "히스토리", icon: <History className="w-5 h-5" /> },
]

export default function Sidebar({ user, activeTab, onTabChange, organizationName, classData }: SidebarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <aside className="w-64 border-r border-sidebar-border flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">Seatrus</span>
        </div>
      </div>

      {/* Class Info Section */}
      {classData && (
        <div className="px-4 py-3 border-b border-sidebar-border bg-sidebar-accent/30">
          <p className="text-sm font-semibold text-sidebar-foreground">
            {organizationName || "학교"}
          </p>
          <p className="font-semibold text-sidebar-foreground">
            {classData.grade}학년 {classData.class_name}반
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              activeTab === tab.id
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg hover:brightness-95"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border relative" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors"
        >
          <div className="w-10 h-10 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email || "No email"}</p>
          </div>
          <ChevronRight className={cn("w-4 h-4 shrink-0 transition-transform", isUserMenuOpen && "rotate-90")} />
        </button>

        {/* User Menu Dropdown */}
        {isUserMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-lg shadow-lg z-50">
            <button
              onClick={() => {
                onTabChange("settings")
                setIsUserMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-card-foreground hover:bg-accent transition-colors first:rounded-t-lg"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">설정</span>
            </button>
            <div className="border-t border-border" />
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
              className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors last:rounded-b-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">로그아웃</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
