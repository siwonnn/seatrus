import { getServerSideSession } from "./session"

// called in page.tsx to get user data where session is required
export async function getUser() {
  const session = await getServerSideSession()
  if (!session) throw new Error("Unauthorized")
  return session.user
}