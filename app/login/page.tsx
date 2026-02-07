import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import LoginClient from "./LoginClient"

export default async function LoginPage() {
  const session = await getServerSideSession()
  if (session) {
    redirect("/") 
  }
  return <LoginClient/>
}