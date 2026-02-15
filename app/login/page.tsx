import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import Login from "./Login"

export default async function LoginPage() {
  const session = await getServerSideSession()
  if (session) {
    redirect("/") 
  }
  return <Login/>
}