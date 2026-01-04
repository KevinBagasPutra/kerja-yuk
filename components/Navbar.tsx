'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from "@/app/actions" // Import fungsi logout

export default function Navbar({ user }: { user: any }) {
  const router = useRouter()
  
  const handleLogout = async () => {
    await logout() // Panggil langsung Server Action
    // Fungsi logout di actions.ts sudah melakukan redirect, 
    // jadi router.push disini tidak diperlukan.
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-sky-600 flex items-center gap-2">🔨 KerjaYuk</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'EMPLOYER' && (
                <Link href="/dashboard/notifications" className="relative p-2 text-gray-600 hover:text-sky-600">
                  🔔 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
              )}
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-sky-600">Hi, {user.name.split(' ')[0]}</Link>
              {user.role === 'EMPLOYER' && (
                <Link href="/dashboard/post" className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700">Pasang Lowongan</Link>
              )}
              <button onClick={handleLogout} className="text-sm text-red-500 font-medium">Keluar</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-600 hover:text-sky-600 font-medium">Masuk</Link>
              <Link href="/auth/register" className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}