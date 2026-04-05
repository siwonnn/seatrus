import { NextAuthOptions } from "next-auth"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"
import { UserFields } from "@/types/next-auth"
import { getAppUser, initializeAppUser } from "@/lib/database/users"
import { sendSlackWebhook } from "@/lib/slack"

function toPlainText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      const appUser = await getAppUser(user.id)
      const appUserName = toPlainText(appUser?.name)
      const adapterUserName = toPlainText(user.name)
      const email = toPlainText(user.email) || ""

      session.user = {
        ...session.user,
        id: user.id,
        name: appUserName || adapterUserName || email || "Unknown",
        email,
      } as UserFields

      return session
    },
  },
  events: {
    async createUser({ user }) {
      await initializeAppUser(user.id, user.name || null, user.email || null)
      const displayName = toPlainText(user.name) || "Unknown"
      const email = toPlainText(user.email) || "No email"
      await sendSlackWebhook(
        `Seatrus - New User ${displayName} ${email}\nuserId: ${user.id}`
      )
    },
  },
}
