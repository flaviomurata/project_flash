import { Progress } from '@/components/ui/progress'
import { useExitModal } from '@/store/use-exit-modal'
import { X } from 'lucide-react'
import Image from 'next/image'

type Props = {
  hearts: number
  percentage: number
}

export const Header = ({ hearts, percentage }: Props) => {
  const { open } = useExitModal()
  return (
    <header className="lg:pt-[50px] pt-[20px] flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
      <X
        onClick={open}
        className="text-slate-500 hover:opacity-75 transition cursor-pointer"
      />
      <Progress value={percentage} />
      <div className="text-rose-500 flex items-center font-bold">
        <Image
          src="/heart.svg"
          alt="Heart"
          width={28}
          height={28}
          className="mr-2"
        />
        {hearts}
      </div>
    </header>
  )
}
