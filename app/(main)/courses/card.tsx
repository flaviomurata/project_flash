import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import Image from 'next/image'

type Props = {
  title: string
  id: number
  imageSrc: string
  onClick: (id: number) => void
  disabled?: boolean
  active?: boolean
}

export const Card = ({
  title,
  id,
  imageSrc,
  onClick,
  disabled,
  active
}: Props) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        'h-full border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 flex flex-col items-center justift-between p-3 pb-6 min-h-[217px] min-w-[200px]',
        disabled && 'pointer-events-none opacity-50'
      )}
    >
      <div className="min-[24px] w-full flex items-center justify-end">
        {active && (
          <div className="rounded-md bg-green-500 flex items-center justify-center">
            <Check className="text-white stroke-[3] h-5 w-5" />
          </div>
        )}
      </div>
      <Image
        src={imageSrc}
        alt={title}
        height={70}
        width={93.33}
        className="rounded-lg drop-shadow-md border object-cover"
      />
      <p className="text-neutral-700 text-center font-bold mt-3">{title}</p>
    </div>
  )
}