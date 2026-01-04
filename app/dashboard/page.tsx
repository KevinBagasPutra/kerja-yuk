import { getCurrentUser, updateJobStatus, updateApplicationStatus } from "@/app/actions"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  if (user.role === 'WORKER') {
    const applications = await prisma.application.findMany({
      where: { workerId: user.id },
      include: { job: { include: { employer: true } } },
      orderBy: { appliedAt: 'desc' }
    })
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Dashboard Pekerja</h1><Link href="/dashboard/saved" className="text-sky-600 font-medium hover:underline">Lowongan Tersimpan &rarr;</Link></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700">Lamaran Saya</div>
          <div className="divide-y divide-gray-100">
            {applications.map((app) => (
              <div key={app.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                <div><h3 className="font-bold text-gray-900">{app.job.title}</h3><p className="text-sm text-gray-500">{app.job.employer.name} • {new Date(app.appliedAt).toLocaleDateString()}</p></div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{app.status === 'PENDING' ? 'Menunggu' : 'Dilihat'}</span>
              </div>
            ))}
            {applications.length === 0 && <p className="p-8 text-center text-gray-500">Belum ada lamaran.</p>}
          </div>
        </div>
      </div>
    )
  }

  if (user.role === 'EMPLOYER') {
    const myJobs = await prisma.job.findMany({
      where: { employerId: user.id },
      include: { applications: { include: { worker: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard Mandor</h1>
          <Link href="/dashboard/post" className="bg-sky-600 text-white px-4 py-2 rounded-lg font-medium">+ Pasang Lowongan</Link>
        </div>
        <div className="space-y-6">
          {myJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{job.status}</span>
                  <h3 className="font-bold text-lg mt-1">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 mt-1"><span className="flex items-center gap-1">👁️ <b>{job.viewsCount}</b> Dilihat</span><span className="flex items-center gap-1">📂 <b>{job.applicationsCount}</b> Pelamar</span></div>
                </div>
                {job.status === 'ACTIVE' && (
                  <form action={async () => { "use server"; await updateJobStatus(job.id, 'FILLED'); }}>
                    <button className="text-sm text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1 rounded">Tutup Lowongan</button>
                  </form>
                )}
              </div>
              <div className="space-y-3 mt-4">
                {job.applications.map((app) => (
                  <div key={app.id} className="flex flex-col md:flex-row justify-between items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-3 md:mb-0">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">{app.worker.name.charAt(0)}</div>
                      <div><p className="font-bold text-gray-900">{app.worker.name}</p><p className="text-xs text-gray-500">{app.worker.phone}</p><div className="text-xs font-semibold mt-1">Status: <span className={`ml-1 px-2 py-0.5 rounded text-xs ${app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{app.status === 'PENDING' ? 'Menunggu' : app.status === 'ACCEPTED' ? 'Diterima' : 'Ditolak'}</span></div></div>
                    </div>
                    {app.status === 'PENDING' && (
                      <div className="flex gap-2 w-full md:w-auto">
                        <form action={async () => { "use server"; await updateApplicationStatus(app.id, 'REJECTED'); }}><button className="flex-1 md:flex-none text-xs bg-white border border-red-200 text-red-600 px-3 py-2 rounded hover:bg-red-50">Tolak</button></form>
                        <form action={async () => { "use server"; await updateApplicationStatus(app.id, 'ACCEPTED'); }}><button className="flex-1 md:flex-none text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">Terima</button></form>
                      </div>
                    )}
                    {app.status !== 'REJECTED' && <div className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">{app.worker.phone}</div>}
                  </div>
                ))}
                {job.applications.length === 0 && <p className="text-sm text-gray-400">Belum ada pelamar.</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return <div>Role tidak dikenali</div>
}