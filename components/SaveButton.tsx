'use client'
import { toggleSaveJob } from "@/app/actions"
import { useState } from "react"
export default function SaveButton({ jobId, isSaved }: { jobId: string, isSaved: boolean }) {
  const [saved, setSaved] = useState(isSaved)
  const [loading, setLoading] = useState(false)
  async function handleToggle() {
    setLoading(true)
    const result = await toggleSaveJob(jobId)
    setLoading(false)
    if (result?.success) setSaved(result.saved)
  }
  return (
    <button onClick={handleToggle} disabled={loading} className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors ${saved ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
      {loading ? '...' : (saved ? '❤️ Tersimpan' : '🤍 Simpan')}
    </button>
  )
}