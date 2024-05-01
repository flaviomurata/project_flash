import db from '@/db/drizzle'
import { challengeProgress, courses, userProgress } from '@/db/schema'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { cache } from 'react'

export const getUserProgress = cache(async () => {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  // TODO: Confirm whether order is needed
  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true
    }
  })
  return data
})

export const getUnits = cache(async () => {
  const { userId } = auth()
  const userProgress = await getUserProgress()

  if (!userId || !userProgress?.activeCourseId) {
    return []
  }

  const data = await db.query.units.findMany({
    where: eq(courses.id, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId)
              }
            }
          }
        }
      }
    }
  })

  const normalizedData = data.map((unit) => {
    const lessonWithCompletedStatus = unit.lessons.map((lesson) => {
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => {
            return progress.completed
          })
        )
      })
      return { ...lesson, completed: allCompletedChallenges }
    })
    return { ...unit, lessons: lessonWithCompletedStatus }
  })

  return normalizedData
})

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany()
  return data
})

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId)
    // TODO: Populate units and lessons
  })
  return data
})
