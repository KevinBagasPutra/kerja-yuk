import { register } from "@/app/actions"
import Link from "next/link"
export const dynamic = 'force-dynamic'
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Daftar Akun</h2>
        <p className="text-center text-gray-500 mb-8">Mulai cari kerja atau cari pekerja hari ini.</p>
        <form action={register} className="space-y-5">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
            <label className="cursor-pointer"><input type="radio" name="role" value="WORKER" className="peer sr-only" defaultChecked /><div className="text-center py-2 rounded-md text-sm font-semibold text-gray-500 peer-checked:bg-white peer-checked:text-sky-600 peer-checked:shadow-sm transition-all">Pekerja</div></label>
            <label className="cursor-pointer"><input type="radio" name="role" value="EMPLOYER" className="peer sr-only" /><div className="text-center py-2 rounded-md text-sm font-semibold text-gray-500 peer-checked:bg-white peer-checked:text-orange-600 peer-checked:shadow-sm transition-all">Mandor</div></label>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label><input type="text" name="name" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Cth: Budi Santoso" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon (WhatsApp)</label><input type="tel" name="phone" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="0812..." /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><input type="password" name="password" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none" /></div>
          <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors">Daftar Sekarang</button>
        </form>
        <p className="text-center mt-6 text-gray-600">Sudah punya akun? <Link href="/auth/login" className="text-sky-600 font-bold hover:underline">Masuk</Link></p>
      </div>
    </div>
  )
}