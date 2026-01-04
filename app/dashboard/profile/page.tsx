import { getCurrentUser, updateProfile } from "@/app/actions"
import Link from "next/link"
import { redirect } from "next/navigation"
export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const workerProfile = user.role === 'WORKER' ? user.workerProfile : null
  const employerProfile = user.role === 'EMPLOYER' ? user.employerProfile : null
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-2 text-gray-500"><Link href="/dashboard" className="hover:text-sky-600">Dashboard</Link> / <span className="text-gray-900 font-medium">Edit Profil</span></div>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center mb-8"><div className="w-24 h-24 bg-sky-100 text-sky-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4">{user.name.charAt(0)}</div><h2 className="text-2xl font-bold text-gray-900">{user.name}</h2><p className="text-gray-500">{user.role === 'WORKER' ? 'Pekerja Harian' : 'Mandor / Perusahaan'}</p><p className="text-sm text-gray-400 mt-1">{user.phone}</p></div>
        <form action={updateProfile} className="space-y-6">
          {user.role === 'WORKER' && (
            <>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman Kerja</label><input type="text" name="experience" defaultValue={workerProfile?.experience || ''} placeholder="Cth: 3 Tahun di Konstruksi" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Keahlian (Skill)</label><input type="text" name="skills" defaultValue={workerProfile?.skills.join(', ') || ''} placeholder="Cth: Tukang Batu, Plester, Cat (Pisahkan dengan koma)" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" /><p className="text-xs text-gray-500 mt-1">Pisahkan setiap skill dengan tanda koma (,)</p></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Bio Singkat</label><textarea name="bio" rows={3} defaultValue={workerProfile?.bio || ''} placeholder="Ceritakan sedikit tentang diri anda..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"></textarea></div>
            </>
          )}
          {user.role === 'EMPLOYER' && (
            <>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Nama Perusahaan / Tim</label><input type="text" name="companyName" defaultValue={employerProfile?.companyName || ''} placeholder="Cth: CV. Maju Mundur" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Alamat Proyek / Kantor</label><input type="text" name="companyAddress" defaultValue={employerProfile?.companyAddress || ''} placeholder="Alamat lengkap" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Perusahaan</label><textarea name="companyDescription" rows={4} defaultValue={employerProfile?.companyDescription || ''} placeholder="Deskripsikan jenis proyek yang biasa dikerjakan..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"></textarea></div>
            </>
          )}
          <div className="pt-4"><button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors">Simpan Perubahan</button></div>
        </form>
      </div>
    </div>
  )
}