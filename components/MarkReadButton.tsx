'use client'
import { markNotificationsRead } from "@/app/actions"
import { useRouter } from "next/navigation"
export default function MarkReadButton() {
  const router = useRouter()
  async function handleMark() { await markNotificationsRead(); router.refresh() }
  return (<button onClick={handleMark} className="text-sm text-gray-500 hover:text-sky-600">Tandai semua dibaca</button>)
}