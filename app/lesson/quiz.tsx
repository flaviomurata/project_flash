'use client'

import { Challenge } from '@/app/lesson/challenge'
import { QuestionBubble } from '@/app/lesson/question-bubble'
import { challengeOptions, challenges } from '@/db/schema'
import { useState } from 'react'
import { Footer } from './footer'
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

  const [selectedOption, setSelectedOption] = useState<number | undefined>(0)
  const [status, setStatus] = useState<'correct' | 'incorrect' | 'none'>('none')

  const challenge = challenges[activeIndex]
  const options = challenge?.challengeOptions ?? []

  const onSelect = (id: number) => {
    if (status !== 'none') return

    setSelectedOption(id)
  }

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
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={false}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={!selectedOption} status={status} onCheck={() => {}} />
    </>
  )
}
