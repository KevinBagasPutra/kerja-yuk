'use client'
import { applyJob } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
export default function ApplyButton({ jobId, hasApplied }: { jobId: string, hasApplied: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(hasApplied)
  async function handleApply() {
    setLoading(true)
    const result = await applyJob(jobId)
    setLoading(false)
    if (result?.success) setApplied(true)
    else alert(result?.message || "Gagal melamar")
  }
  if (applied) {
    return (<button disabled className="w-full bg-green-100 text-green-700 font-bold py-4 rounded-xl border border-green-200 flex items-center justify-center gap-2">✅ Sudah Melamar</button>)
  }
  return (<button onClick={handleApply} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2">{loading ? 'Mengirim...' : <>👍 Saya Tertarik</>}</button>)
}