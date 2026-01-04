import { login } from "@/app/actions"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Masuk
        </h2>

        <form action={login} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300"
            />
          </div>

          <button className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg">
            Masuk Sekarang
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="text-sky-600 font-bold">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}
