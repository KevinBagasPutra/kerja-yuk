import { login } from "@/app/actions"
import Link from "next/link"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Masuk
        </h2>

        <form action={login} className="space-y-6">
          <input name="phone" required />
          <input type="password" name="password" required />
          <button>Login</button>
        </form>

        <Link href="/auth/register">Daftar</Link>
      </div>
    </div>
  )
}
