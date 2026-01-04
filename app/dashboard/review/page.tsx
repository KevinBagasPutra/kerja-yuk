import { getCurrentUser, createReview, getReviewableJobs } from "@/app/actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import ReviewForm from "@/components/ReviewForm"
export default async function ReviewPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const reviewableItems = await getReviewableJobs()
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Beri Penilaian & Review</h1><Link href="/dashboard" className="text-gray-500 hover:text-sky-600">&larr; Kembali</Link></div>
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6 text-sm text-blue-800"><p>Anda hanya bisa memberi penilaian 1 kali untuk setiap pekerjaan yang telah diterima (Accepted).</p></div>
      {reviewableItems.length === 0 ? <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">Tidak ada pekerjaan atau pekerja yang perlu dinilai saat ini.</div> : (
        <div className="space-y-6">
          {reviewableItems.map((item: any) => {
            const target = user.id === item.job.employerId ? item.worker : item.job.employer
            const targetName = target.name
            return (
              <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{item.job.title}</h3>
                    <p className="text-sm text-gray-500">Beri nilai untuk: <span className="font-bold text-sky-600">{targetName}</span></p>
                  </div>
                  <div className="text-right"><span className="text-xs text-gray-400">Rating Saat Ini</span><div className="font-bold text-yellow-500 flex items-center gap-1 justify-end">⭐ {target.role === 'WORKER' ? target.workerProfile?.averageRating || 0 : target.employerProfile?.rating || 0}</div></div>
                </div>
                <ReviewForm reviewerId={user.id} revieweeId={target.id} jobId={item.job.id} targetName={targetName} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}