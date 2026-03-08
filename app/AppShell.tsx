"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Class } from "@/types/database"

interface AppShellProps {
  user: {
    id: string
    name: string | null
    email: string | null
  }
  organizationName: string | null
  classData: Class | null
  children: React.ReactNode
}

export default function AppShell({
  user,
  organizationName,
  classData,
  children,
}: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/main" className="text-lg font-semibold text-foreground">
              Seatrus
            </Link>
            {classData && (
              <p className="hidden text-sm text-muted-foreground md:block">
                {organizationName || "학교"} · {classData.grade}학년 {classData.class_name}반
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant={pathname === "/main" ? "default" : "outline"}
              size="sm"
            >
              <Link href="/main">메인</Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/history" ? "default" : "outline"}
              size="sm"
            >
              <Link href="/history">히스토리</Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user.email || "No email"}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
            >
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
