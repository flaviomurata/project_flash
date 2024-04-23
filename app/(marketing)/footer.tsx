import { Button } from '@/components/ui/button'
import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/code.svg"
            alt="LPII"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Linguagens de Prog. II
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/programming.svg"
            alt="Arquitetura de Sist. Comp."
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Sistemas Computacionais
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/database.svg"
            alt="Banco de Dados"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Banco de Dados
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/settings.svg"
            alt="Engenharia de Software"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Engenharia de Software
        </Button>
      </div>
    </footer>
  )
}
