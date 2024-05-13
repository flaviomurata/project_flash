'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useHeartsModal } from '@/store/use-hearts-modal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const HeartsModal = () => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { isOpen, close } = useHeartsModal()

  useEffect(() => setIsClient(true), [])

  if (!isClient) return null

  const onClick = () => {
    close()
    router.push('/store')
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image src="/mascot_bad.svg" alt="mascot" height={80} width={80} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            You ran out of hearts!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Get more hearts by purchasing them on the store.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              className="w-full"
              variant="primary"
              size="lg"
              onClick={onClick}
            >
              Get more hearts
            </Button>
            <Button
              className="w-full"
              variant="primaryOutline"
              size="lg"
              onClick={() => {
                close()
              }}
            >
              No thanks
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
