'use server'

import db from '@/db/drizzle'
import { auth, currentUser } from '@clerk/nextjs'

import { getCourseById, getUserProgress } from '@/db/queries'
import { userProgress } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    throw new Error('Unauthorized')
  }

  const course = await getCourseById(courseId)

  if (!course) {
    throw new Error('Course not found')
  }

  // TODO: Enable once units and lessons are implemented
  // // Ensure course has units and lessons
  // if (!course.units.length || !course.units[0].lessons.length) {
  //   throw new Error('Course has no units or lessons')
  // }

  const existingUserProgress = await getUserProgress()

  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || 'User',
      userImageSrc: user.imageUrl || '/logo.svg'
    })
    revalidatePath('/courses')
    revalidatePath('/learn')
    redirect('/learn')
  }

  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || 'User',
    userImageSrc: user.imageUrl || '/logo.svg'
  })

  revalidatePath('/courses')
  revalidatePath('/learn')
  redirect('/learn')
}
