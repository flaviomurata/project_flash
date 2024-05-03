'use client'

import { challengeOptions, challenges } from '@/db/schema'
import { useState } from 'react'
import { Header } from './header'

type Props = {
  initialPercentage: number
  initialHearts: number
  initialLessonId: number
  initalLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean
    challengeOptions: (typeof challengeOptions.$inferSelect)[]
  })[]
}

export const Quiz = ({
  initialLessonId,
  initialHearts,
  initialPercentage,
  initalLessonChallenges
}: Props) => {
  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(initialPercentage)

  return (
    <>
      <Header hearts={hearts} percentage={percentage} />
    </>
  )
}
