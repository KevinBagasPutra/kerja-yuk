'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;
    if (!userId) return null;
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { workerProfile: true, employerProfile: true }
    });
  } catch (error) { return null; }
}

export async function register(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as 'WORKER' | 'EMPLOYER'

  const existingUser = await prisma.user.findUnique({ where: { phone } })
  if (existingUser) throw new Error("Nomor telepon sudah terdaftar")

  const user = await prisma.user.create({
    data: { name, phone, password, role, location: 'Indonesia' }
  })

  if (role === 'WORKER') {
    await prisma.workerProfile.create({ data: { userId: user.id, experience: 'Baru', skills: [] } })
  } else {
    await prisma.employerProfile.create({ data: { userId: user.id, projectType: 'Umum' } })
  }

  const cookieStore = cookies()
  cookieStore.set('userId', user.id)
  redirect('/dashboard')
}

export async function login(formData: FormData) {
  const phone = formData.get('phone') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({ where: { phone, password } })
  if (!user) throw new Error("Nomor atau password salah")

  const cookieStore = cookies()
  cookieStore.set('userId', user.id)
  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete('userId')
  redirect('/')
}

export async function createJob(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'EMPLOYER') throw new Error("Unauthorized")

  const data = {
    title: formData.get('title') as string,
    category: formData.get('category') as any,
    salaryType: formData.get('salaryType') as any,
    salaryMin: Number(formData.get('salaryMin')),
    salaryMax: Number(formData.get('salaryMax')),
    location: formData.get('location') as string,
    description: formData.get('description') as string,
    urgent: formData.get('urgent') === 'true',
    startDate: new Date(),
    employerId: user.id
  }

  await prisma.job.create({ data })
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function getJobs(filter?: { category?: string, location?: string, search?: string }) {
  const where: any = {
    status: 'ACTIVE',
    ...(filter?.category && { category: filter.category }),
    ...(filter?.location && { location: { contains: filter.location, mode: 'insensitive' } }),
    ...(filter?.search && {
      OR: [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } }
      ]
    })
  };

  return await prisma.job.findMany({
    where,
    include: { employer: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function applyJob(jobId: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'WORKER') throw new Error("Unauthorized")

  const existing = await prisma.application.findUnique({
    where: { jobId_workerId: { jobId, workerId: user.id } }
  })
  if (existing) return { success: false, message: "Sudah melamar" }

  const job = await prisma.job.findUnique({ where: { id: jobId } })
  if (!job) throw new Error("Job not found")

  await prisma.application.create({ data: { jobId, workerId: user.id, status: 'PENDING' } })
  await prisma.job.update({ where: { id: jobId }, data: { applicantsCount: { increment: 1 } } })

  await prisma.notification.create({
    data: {
      userId: job.employerId,
      type: 'APPLICATION',
      title: 'Pelamar Baru!',
      message: `${user.name} tertarik dengan lowongan "${job.title}"`,
      data: { jobId, applicantId: user.id }
    }
  })

  revalidatePath('/dashboard')
  return { success: true, message: "Berhasil melamar!" }
}

export async function updateJobStatus(jobId: string, status: 'FILLED' | 'CANCELLED' | 'ACTIVE') {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")
  const job = await prisma.job.findUnique({ where: { id: jobId } })
  if (job?.employerId !== user.id) throw new Error("Bukan lowongan Anda")
  await prisma.job.update({ where: { id: jobId }, data: { status } })
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateApplicationStatus(applicationId: string, status: 'ACCEPTED' | 'REJECTED') {
  const user = await getCurrentUser()
  if (!user || user.role !== 'EMPLOYER') throw new Error("Unauthorized")

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true }
  })

  if (!application) throw new Error("Aplikasi tidak ditemukan")
  if (application.job.employerId !== user.id) throw new Error("Bukan pelamar lowongan Anda")

  await prisma.application.update({ where: { id: applicationId }, data: { status } })

  if (status === 'ACCEPTED') {
    await prisma.notification.create({
      data: {
        userId: application.workerId,
        type: 'JOB_OFFER',
        title: 'Selamat! Lamaran Diterima',
        message: `Mandor menerima lamaran Anda untuk posisi "${application.job.title}".`,
        data: { jobId: application.jobId }
      }
    })
  } else {
    await prisma.notification.create({
      data: {
        userId: application.workerId,
        type: 'JOB_UPDATE',
        title: 'Lamaran Ditolak',
        message: `Maaf, lamaran Anda untuk posisi "${application.job.title}" tidak cocok.`,
        data: { jobId: application.jobId }
      }
    })
  }

  revalidatePath('/dashboard')
  return { success: true, message: `Pelamar ${status === 'ACCEPTED' ? 'diterima' : 'ditolak'}` }
}

export async function createReview(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const revieweeId = formData.get('revieweeId') as string
  const jobId = formData.get('jobId') as string
  const rating = Number(formData.get('rating'))
  const comment = formData.get('comment') as string

  if (user.id === revieweeId) throw new Error("Tidak bisa menilai diri sendiri")

  const job = await prisma.job.findUnique({ where: { id: jobId } })
  if (!job) throw new Error("Job tidak ditemukan")

  await prisma.review.create({ data: { reviewerId: user.id, revieweeId, jobId, rating, comment } })

  const reviews = await prisma.review.findMany({ where: { revieweeId } })
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

  const targetUser = await prisma.user.findUnique({ where: { id: revieweeId } })
  if (targetUser?.role === 'WORKER') {
    await prisma.workerProfile.update({ where: { userId: revieweeId }, data: { averageRating: avgRating, rating: avgRating } })
  } else {
    await prisma.employerProfile.update({ where: { userId: revieweeId }, data: { rating: avgRating } })
  }

  revalidatePath('/dashboard/review')
  revalidatePath('/dashboard/profile')
  return { success: true, message: "Penilaian berhasil disimpan!" }
}

export async function getReviewableJobs() {
  const user = await getCurrentUser()
  if (!user) return []

  const applications = await prisma.application.findMany({
    where: {
      status: 'ACCEPTED',
      OR: [{ workerId: user.id }, { job: { employerId: user.id } }],
      NOT: { job: { reviews: { some: { reviewerId: user.id } } } }
    },
    include: { job: { include: { employer: true, reviews: true } }, worker: true }
  })
  return applications
}

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  if (user.role === 'WORKER') {
    const skillsString = formData.get('skills') as string
    const skillsArray = skillsString.split(',').map(s => s.trim()).filter(s => s !== '')
    await prisma.workerProfile.update({
      where: { userId: user.id },
      data: { skills: skillsArray, experience: formData.get('experience') as string, bio: formData.get('bio') as string }
    })
  } else if (user.role === 'EMPLOYER') {
    await prisma.employerProfile.update({
      where: { userId: user.id },
      data: {
        companyName: formData.get('companyName') as string,
        companyAddress: formData.get('companyAddress') as string,
        companyDescription: formData.get('companyDescription') as string
      }
    })
  }
  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function toggleSaveJob(jobId: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'WORKER') throw new Error("Unauthorized")
  const existing = await prisma.savedJob.findUnique({ where: { userId_jobId: { userId: user.id, jobId } } })
  if (existing) {
    await prisma.savedJob.delete({ where: { userId_jobId: { userId: user.id, jobId } } })
    return { success: true, saved: false }
  } else {
    await prisma.savedJob.create({ data: { userId: user.id, jobId } })
    return { success: true, saved: true }
  }
}

export async function getSavedJobs() {
  const user = await getCurrentUser()
  if (!user) return []
  const saved = await prisma.savedJob.findMany({
    where: { userId: user.id },
    include: { job: { include: { employer: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return saved.map(s => s.job)
}

export async function logJobView(jobId: string) {
  const user = await getCurrentUser()
  const existingView = await prisma.jobView.findFirst({
    where: { jobId, userId: user?.id || undefined, viewedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
  })
  if (!existingView) {
    await prisma.jobView.create({ data: { jobId, userId: user?.id, ipAddress: '127.0.0.1' } })
    await prisma.job.update({ where: { id: jobId }, data: { viewsCount: { increment: 1 } } })
  }
}

export async function getNotifications() {
  const user = await getCurrentUser()
  if (!user) return []
  return await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
}

export async function markNotificationsRead() {
  const user = await getCurrentUser()
  if (!user) return
  await prisma.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } })
  revalidatePath('/dashboard/notifications')
}