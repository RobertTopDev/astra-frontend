import Image from 'next/image'
import Link from 'next/link'
import { utilitiesInfo } from '@/constants/utilities'
import { AstraHeader } from '@/components'
import { Button } from '@/components/shadcn'

export const Utilities = () => {
  return (
    <div className="relative container mx-auto w-full py-20" id="step">
      <div className="relative flex flex-col items-center gap-16">
        <AstraHeader>$ASTRADAO KEY UTILITIES</AstraHeader>
        <div className="w-full grid grid-cols-3 lg:gap-16 gap-32">
          {utilitiesInfo.map((info, idx) => (
            <div
              key={idx}
              className="lg:col-span-1 col-span-full flex items-center justify-between flex-col gap-4 text-center"
            >
              <div className="flex justify-center h-[6rem] w-[6rem]">
                <div className="relative h-[5rem] w-[5rem]">
                  <Image alt={info.logoAlt} src={info.logo} fill />
                </div>
              </div>
              <h2 className="text-2xl font-medium max-w-[20rem]">
                {info.title}
              </h2>
              <p className="max-w-[20rem] leading-5 mt-8">{info.desc}</p>
            </div>
          ))}
        </div>
        <div>
          <Link
            href={
              typeof window !== 'undefined' && window.location.origin
                ? window.location.origin
                : '' + '/how-to-buy'
            }
          >
            <Button
              className="rounded-full text-xs py-6 px-16 border border-astra-blue"
              variant="astra-blue"
            >
              BUY $ASTRADAO
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
