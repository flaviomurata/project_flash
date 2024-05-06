import { Quiz } from '@/app/lesson/quiz'
import { getLesson, getUserProgress } from '@/db/queries'
import { redirect } from 'next/navigation'

const LessonPage = async () => {
  const lessonData = getLesson()
  const userProgressData = getUserProgress()

  const [lesson, userProgress] = await Promise.all([
    lessonData,
    userProgressData
  ])

  if (!lesson || !userProgress) {
    redirect('/learn')
  }

  const initialPercentage =
    (lesson.challenges.filter((challenge) => {
      challenge.completed
    }).length /
      lesson.challenges.length) *
    100

  return (
    <Quiz
      initialLessonId={lesson.id}
      initalLessonChallenges={lesson.challenges}
      initialPercentage={initialPercentage}
      initialHearts={userProgress.hearts}
    />
  )
}

export default LessonPage
