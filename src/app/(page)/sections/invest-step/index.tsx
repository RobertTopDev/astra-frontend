import { invest_steps } from '@/constants'
import { AstraCard, AstraHeader } from '@/components'
import Link from 'next/link'

export const InvestStep = () => {
  return (
    <div className="relative container mx-auto w-full py-20" id="step">
      <div className="relative w-full flex flex-col justify-center items-center gap-[10rem]">
        <AstraHeader>INVESTING IN CRYPTO MADE EASY</AstraHeader>
        <div className="w-full grid grid-cols-3 lg:gap-16 gap-32">
          {invest_steps.map((invest_step, index) => (
            <Link href={index === 0 ? '/#indices' : '/#launchpad'}>
              <AstraCard
                className="lg:col-span-1 col-span-full cursor-pointer"
                image={invest_step.icon}
                key={invest_step.text}
                alt={`Astra Logo ${index}`}
              >
                <div className="text-[4rem]">{index + 1}</div>
                <div className="font-normal text-lg">{invest_step.text}</div>
              </AstraCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
