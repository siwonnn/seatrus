import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const start = Date.now()
  const { error } = await supabase.from("organizations").select("id").limit(1)
  const latencyMs = Date.now() - start

  if (error) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 503 }
    )
  }

  return NextResponse.json({ status: "ok", latencyMs })
}
