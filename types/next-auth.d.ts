import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

export interface UserFields {
  id: string
  name: string
  email: string
}

declare module "next-auth" {
  interface User extends DefaultUser, UserFields {}
  interface Session {
    user: UserFields & DefaultSession["user"]
  }
}
