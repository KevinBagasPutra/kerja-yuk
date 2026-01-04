import { getCurrentUser } from "@/app/actions"
import { getSavedJobs } from "@/app/actions"
import { redirect } from "next/navigation"
import Link from "next/link"
export default async function SavedJobsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const jobs = await getSavedJobs()
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Lowongan Tersimpan</h1>
      {jobs.length === 0 ? <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">Belum ada lowongan yang disimpan.</div> : (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <div key={job.id} className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.employer.name} • {job.location}</p>
                <p className="text-orange-600 font-bold mt-1">Rp {job.salaryMin.toLocaleString('id-ID')} - {job.salaryMax.toLocaleString('id-ID')}</p>
              </div>
              <Link href={`/jobs/${job.id}`} className="btn btn-primary">Lihat</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}