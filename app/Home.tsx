"use client"

import { signIn } from "next-auth/react"
import { useProgress } from "@bprogress/next"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { start } = useProgress()

  const handleSignIn = () => {
    start()
    signIn("google")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          공정하고 간편한 자리 배치 앱
        </h1>

        <h1 className="text-5xl font-bold tracking-tight text-primary">
          Seatrus
        </h1>

        <div className="mt-8">
          <Button size="lg" variant="default" onClick={handleSignIn}>
            Google로 로그인
          </Button>
        </div>
      </div>
    </main>
  )
}
