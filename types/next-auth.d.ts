// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

export interface UserFields {
    id: string
    name: string
    email: string
    onboardingCompleted: bool
}

declare module "next-auth" {
    interface User extends DefaultUser, UserFields {}
    interface Session {
        user: UserFields & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT extends Partial<UserFields>, DefaultJWT {}
}