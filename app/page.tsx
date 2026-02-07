import { getServerSideSession } from "@/lib/session"
import HomeClient from "./HomeClient"

export default async function HomePage() {
  const session = await getServerSideSession()
  const isLoggedIn = session != null
  return <HomeClient isLoggedIn={isLoggedIn} />
}