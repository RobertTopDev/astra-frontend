import { invest_steps } from '@/constants'
import { AstraCard, AstraHeader } from '@/components'
import { Card, CardContent } from '@/components/shadcn'
import Link from 'next/link'
import Image from 'next/image'

export const InvestStep = () => {
  return (
    <div className="relative container mx-auto w-full py-20">
      <div className="relative w-full flex flex-col justify-center items-center gap-20">
        <AstraHeader>INVESTING IN CRYPTO MADE EASY</AstraHeader>
        <div className="w-full grid lg:grid-cols-2 grid-cols-1 lg:gap-32">
          {invest_steps.map((invest_step, index) => (
            <Link href={index === 0 ? '/#indices' : '/#launchpad'}>
              <div
                key={index}
                className={`lg:col-span-1 col-span-full flex items-center flex-col gap-4 text-center ${index === 0 ? '' : 'pt-16 lg:pt-0'}`}
              >
                <div className="flex justify-center h-[6rem] w-[6rem]">
                  <div className="relative h-[5rem] w-[5rem]">
                    <Image alt={invest_step.icon} src={invest_step.icon} fill />
                  </div>
                </div>
                <h2 className="text-2xl font-medium max-w-[20rem]">
                  {invest_step.text}
                </h2>
              </div>
              {/* <AstraCard
                className="lg:col-span-1 col-span-full cursor-pointer"
                image={invest_step.icon}
                key={invest_step.text}
                alt={`Astra Logo ${index}`}
              >
                <div className="text-[4rem]">{index + 1}</div>
                <div className="font-normal text-lg">{invest_step.text}</div>
              </AstraCard> */}
              <Card className="relative rounded-3xl bg-[#15192b] mt-10 min-h-96">
                <CardContent className="relative p-12 flex items-center gap-4">
                  <p dangerouslySetInnerHTML={{ __html: invest_step.desc }} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
