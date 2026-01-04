import { getNotifications, markNotificationsRead } from "@/app/actions"
import { getCurrentUser } from "@/app/actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import MarkReadButton from "@/components/MarkReadButton"
export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const notifications = await getNotifications()
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Notifikasi</h1><MarkReadButton /></div>
      <div className="space-y-4">
        {notifications.length === 0 ? <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">Belum ada notifikasi.</div> : notifications.map((notif) => (
          <div key={notif.id} className={`p-4 rounded-xl border ${notif.read ? 'bg-white border-gray-200 opacity-75' : 'bg-blue-50 border-blue-100'}`}>
            <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-900">{notif.title}</h3><span className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleDateString()}</span></div>
            <p className="text-sm text-gray-700 mb-2">{notif.message}</p>
            {notif.data && (notif.data as any).jobId && (<Link href={`/jobs/${(notif.data as any).jobId}`} className="text-sm text-sky-600 font-medium hover:underline">Lihat Lowongan &rarr;</Link>)}
          </div>
        ))}
      </div>
    </div>
  )
}