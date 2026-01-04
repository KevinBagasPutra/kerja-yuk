import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "nodejs"

export async function POST() {
  try {
    cookies().delete("userId")

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    )
  }
}
