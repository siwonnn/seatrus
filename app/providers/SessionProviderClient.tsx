"use client"

import { useEffect, useRef } from "react"
import posthog from "posthog-js"
import { SessionProvider } from "next-auth/react"
import { useSession } from "next-auth/react"

function PostHogIdentitySync() {
  const { data: session, status } = useSession()
  const lastIdentifiedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    const userId = session?.user?.id ?? null

    if (status === "authenticated" && userId) {
      if (lastIdentifiedUserIdRef.current === userId) {
        return
      }

      posthog.identify(userId, {
        email: session.user.email,
        name: session.user.name,
      })
      lastIdentifiedUserIdRef.current = userId
      return
    }

    if (status === "unauthenticated" && lastIdentifiedUserIdRef.current) {
      posthog.reset()
      lastIdentifiedUserIdRef.current = null
    }
  }, [session?.user?.email, session?.user?.id, session?.user?.name, status])

  return null
}

export function SessionProviderClient({ children, session }: { children: React.ReactNode; session?: any }) {
  return (
    <SessionProvider session={session}>
      <PostHogIdentitySync />
      {children}
    </SessionProvider>
  )
}
