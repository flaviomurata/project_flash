import db from '@/db/drizzle'
import { challengeProgress, courses, lessons, userProgress } from '@/db/schema'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { cache } from 'react'

export const getUserProgress = cache(async () => {
  const { userId } = auth()

  if (!userId) {
    return null
  }

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
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(courses.id, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
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
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false }
      }

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
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)]
          }
        }
      }
    }
  })
  return data
})

export const getCourseProgress = cache(async () => {
  const { userId } = auth()
  const userProgress = await getUserProgress()

  if (!userId || !userProgress?.activeCourseId) {
    return null
  }

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(courses.id, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
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

  // Find the first lesson that has an uncompleted challenge

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some((progress) => !progress.completed)
        )
      })
    })

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id
  }
})

export const getLesson = cache(async (id?: number) => {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  const courseProgress = await getCourseProgress()

  const lessonId = id || courseProgress?.activeLessonId

  if (!lessonId) {
    return null
  }

  // find the lesson with the given id

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      unit: true,
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId)
          }
        }
      }
    }
  })

  // if there's no data or no challenges, return null

  if (!data || !data.challenges) {
    return null
  }

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed)

    return {
      ...challenge,
      completed
    }
  })

  return {
    ...data,
    challenges: normalizedChallenges
  }
})

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress()

  if (!courseProgress?.activeLessonId) {
    return 0
  }

  const lesson = await getLesson(courseProgress.activeLessonId)

  if (!lesson) {
    return 0
  }

  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed
  )

  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
  )

  return percentage
})

export const getTopTenUsers = cache(async () => {
  const { userId } = auth()
  if (!userId) {
    return []
  }

  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true
    }
  })

  return data
})
