import { getServerSession } from "next-auth"
import { authOptions } from "./auth/authOptions"

export async function getServerSideSession() {
  const session = await getServerSession(authOptions)
  return session
}