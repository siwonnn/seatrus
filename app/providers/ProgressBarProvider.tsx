"use client"

import { ProgressProvider } from "@bprogress/next/app"

export default function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="3px"
      color="#ff8c43"
      options={{ showSpinner: false }}
    >
      {children}
    </ProgressProvider>
  )
}
