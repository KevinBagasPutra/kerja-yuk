import JobCard from "@/components/JobCard" // Fixed Import
import { getJobs } from "@/app/actions"
import Link from "next/link"

export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const search = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const jobs = await getJobs({ category, search })

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <section className="bg-gradient-to-r from-sky-600 to-sky-800 text-white py-16 px-4 text-center rounded-b-3xl mb-12 shadow-lg">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Temukan Kerja Harian & Mingguan</h1>
        <p className="text-sky-100 text-lg">Platform pencari kerja terpercaya untuk Mandor dan Pekerja Indonesia.</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="hidden md:block">
          <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Filter Kategori</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-600 hover:text-sky-600 font-medium py-1">Semua Kategori</Link>
              <Link href="/?category=CONSTRUCTION" className="block text-gray-600 hover:text-sky-600 font-medium py-1">Konstruksi</Link>
              <Link href="/?category=CLEANING" className="block text-gray-600 hover:text-sky-600 font-medium py-1">Kebersihan</Link>
              <Link href="/?category=WAREHOUSE" className="block text-gray-600 hover:text-sky-600 font-medium py-1">Gudang</Link>
              <Link href="/?category=RETAIL" className="block text-gray-600 hover:text-sky-600 font-medium py-1">Retail</Link>
            </div>
          </div>
        </aside>

        <div className="md:col-span-3">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex gap-4">
            <input 
              type="text" name="search" placeholder="Cari lowongan..." 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              defaultValue={search}
            />
            <button className="bg-sky-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-sky-700">Cari</button>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Lowongan Terbaru ({jobs.length})</h2>
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (<JobCard key={job.id} job={job} />))}
            {jobs.length === 0 && (<div className="text-center py-12 bg-white rounded-xl border border-gray-200"><p className="text-gray-500">Tidak ada lowongan.</p></div>)}
          </div>
        </div>
      </div>
    </main>
  )
}