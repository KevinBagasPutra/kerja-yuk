'use client'

import { createReview } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ReviewForm({ reviewerId, revieweeId, jobId, targetName }: { 
  reviewerId: string, revieweeId: string, jobId: string, targetName: string 
}) {
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('revieweeId', revieweeId)
    formData.append('jobId', jobId)
    formData.append('rating', rating.toString())
    formData.append('comment', comment)

    const result = await createReview(formData)
    setLoading(false)

    if (result?.success) {
      alert("Terima kasih! Penilaian Anda telah disimpan.")
      router.refresh()
    } else {
      alert("Gagal menyimpan penilaian.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating Bintang (1-5)</label>
        <div className="flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Komentar (Opsional)</label>
        <textarea 
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`Ceritakan pengalaman Anda bekerja dengan ${targetName}...`}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-sky-700 disabled:opacity-50"
      >
        {loading ? 'Mengirim...' : 'Kirim Penilaian'}
      </button>
    </form>
  )
}