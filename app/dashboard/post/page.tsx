import { createJob } from "@/app/actions"
import { getCurrentUser } from "@/app/actions"
import { redirect } from "next/navigation"
import Link from "next/link"
export default async function PostJobPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'EMPLOYER') redirect('/')
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-2 text-gray-500"><Link href="/dashboard" className="hover:text-sky-600">Dashboard</Link> / <span className="text-gray-900 font-medium">Pasang Lowongan</span></div>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Buat Lowongan Baru</h2>
        <form action={createJob} className="space-y-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Judul Pekerjaan</label><input type="text" name="title" required placeholder="Cth: Tukang Batu Renovasi Rumah" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label><select name="category" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none bg-white"><option value="CONSTRUCTION">Konstruksi</option><option value="CLEANING">Kebersihan</option><option value="WAREHOUSE">Gudang</option><option value="RETAIL">Retail</option><option value="EVENT">Event</option><option value="OTHER">Lainnya</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label><input type="text" name="location" required placeholder="Cth: Jakarta Selatan" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Tipe Gaji</label><select name="salaryType" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none bg-white"><option value="PER_DAY">Per Hari</option><option value="PER_WEEK">Per Minggu</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Gaji Minimum (Rp)</label><input type="number" name="salaryMin" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Gaji Maksimum (Rp)</label><input type="number" name="salaryMax" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Pekerjaan</label><textarea name="description" rows={5} required placeholder="Jelaskan detail pekerjaan, jam kerja, dan persyaratan..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"></textarea></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="urgent" name="urgent" value="true" className="w-4 h-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500" /><label htmlFor="urgent" className="text-sm text-gray-700">Tandai sebagai Lowongan Mendesak</label></div>
          <div className="flex gap-4 pt-4"><Link href="/dashboard" className="flex-1 text-center border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">Batal</Link><button type="submit" className="flex-[2] bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors">Pasang Lowongan</button></div>
        </form>
      </div>
    </div>
  )
}