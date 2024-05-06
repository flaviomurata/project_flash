'use client'

import { Challenge } from '@/app/lesson/challenge'
import { QuestionBubble } from '@/app/lesson/question-bubble'
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
  initialHearts,
  initialPercentage,
  initalLessonChallenges
}: Props) => {
  const [hearts] = useState(initialHearts)
  const [percentage] = useState(initialPercentage)
  const [challenges] = useState(initalLessonChallenges)
  const [activeIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    )
    return uncompletedIndex === -1 ? 0 : uncompletedIndex
  })

  const challenge = challenges[activeIndex]
  const options = challenge?.challengeOptions ?? []

  const title =
    challenge.type === 'ASSIST'
      ? 'Assinale o significado correto'
      : challenge.question

  return (
    <>
      <Header hearts={hearts} percentage={percentage} />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === 'ASSIST' && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={() => {}}
                status="none"
                selectedOption={undefined}
                disabled={false}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
