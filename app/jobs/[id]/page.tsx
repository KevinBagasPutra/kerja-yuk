import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions"
import { notFound } from "next/navigation"
import ApplyButton from "@/components/ApplyButton"
import SaveButton from "@/components/SaveButton"
import Link from "next/link"

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { employer: true }
  })
  const user = await getCurrentUser()
  if (!job) return notFound()
  try { const { logJobView } = await import("@/app/actions"); await logJobView(job.id); } catch (e) {}
  let hasApplied = false
  if (user && user.role === 'WORKER') {
    const application = await prisma.application.findUnique({ where: { jobId_workerId: { jobId: job.id, workerId: user.id } } })
    hasApplied = !!application
  }
  let isSaved = false
  if (user && user.role === 'WORKER') {
    const saved = await prisma.savedJob.findUnique({ where: { userId_jobId: { userId: user.id, jobId: job.id } } })
    isSaved = !!saved
  }
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6"><Link href="/" className="text-gray-500 hover:text-sky-600 flex items-center gap-1 text-sm font-medium"><span>← Kembali ke Beranda</span></Link></div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{job.category.replace('_', ' ')}</span>
            {job.urgent && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Mendesak</span>}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          <div className="flex items-center gap-6 mb-6">
            <div className="text-2xl font-bold text-orange-600">Rp {job.salaryMin.toLocaleString('id-ID')} - {job.salaryMax.toLocaleString('id-ID')}<span className="text-sm text-gray-500 font-normal">/ {job.salaryType === 'PER_DAY' ? 'Hari' : 'Minggu'}</span></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 border-t border-b border-gray-100 py-4">
            <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">📍</span><span>{job.location}</span></div>
            <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">🏢</span><span>{job.employer.name} {job.employer.companyName ? `(${job.employer.companyName})` : ''}</span></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2"><div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200"><h2 className="text-xl font-bold mb-4">Deskripsi Pekerjaan</h2><div className="prose prose-slate max-w-none text-gray-700 whitespace-pre-line">{job.description}</div></div></div>
          <div className="md:col-span-1"><div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24"><h3 className="font-bold text-lg mb-4">Tertarik dengan lowongan ini?</h3>
            {user ? (
              user.role === 'WORKER' ? (
                <>
                  <ApplyButton jobId={job.id} hasApplied={hasApplied} />
                  <SaveButton jobId={job.id} isSaved={isSaved} />
                </>
              ) : <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">Login sebagai akun <b>Pekerja</b> untuk melamar lowongan ini.</div>
            ) : (
              <div className="space-y-3"><p className="text-sm text-gray-500">Silahkan login untuk melamar.</p><Link href="/auth/login" className="block w-full text-center border border-sky-600 text-sky-600 font-bold py-3 rounded-lg hover:bg-sky-50">Masuk</Link><Link href="/auth/register" className="block w-full text-center bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700">Daftar Akun</Link></div>
            )}
          </div></div>
        </div>
      </div>
    </main>
  )
}