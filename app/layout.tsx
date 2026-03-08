import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import localFont from "next/font/local"
import { SessionProviderClient } from "./providers/SessionProviderClient"

// Initialize fonts
const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
})

export const metadata: Metadata = {
  title: "Seatrus",
  description:
    "공정하고 간편한 자리 배치",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.className} antialiased`}>
        <SessionProviderClient>
          {children}
        </SessionProviderClient>
      </body>
    </html>
  )
}
