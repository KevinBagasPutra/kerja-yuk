import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

async function getUser() {
  try {
    const cookieStore = cookies(); // Next.js 14: No await needed
    const userId = cookieStore.get('userId')?.value;
    if (!userId) return null;
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch (error) { return null; }
}

export const metadata: Metadata = {
  title: "KerjaYuk - Cari Kerja Harian",
  description: "Platform pencari kerja harian dan mingguan.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}