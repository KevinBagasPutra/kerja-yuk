import Link from 'next/link'

export default function JobCard({ job }: { job: any }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{job.category.replace('_', ' ')}</span>
        {job.urgent && <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">Mendesak</span>}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
      <div className="flex items-center gap-2 text-orange-600 font-bold mb-4">
        <span>Rp {job.salaryMin.toLocaleString('id-ID')}</span> <span className="text-gray-400 font-normal">-</span> <span>Rp {job.salaryMax.toLocaleString('id-ID')}</span>
        <span className="text-gray-500 text-sm font-normal">/ {job.salaryType === 'PER_DAY' ? 'Hari' : 'Minggu'}</span>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
        <span className="flex items-center gap-1">📍 {job.location}</span>
        <span className="flex items-center gap-1">🏢 {job.employer.name}</span>
      </div>
      <Link href={`/jobs/${job.id}`} className="block w-full text-center border border-sky-600 text-sky-600 py-2 rounded-lg font-medium hover:bg-sky-50 transition-colors">Lihat Detail</Link>
    </div>
  )
}