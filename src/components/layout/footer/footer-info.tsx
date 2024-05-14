import { AstraLogo, AstraStar } from '@/components'
import { footerInfo } from '@/constants'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/shadcn'
import Link from 'next/link'
import { numberFormatter } from '@/util'
import { getApyInfo } from '@/util/api'

export default async function FooterInfo() {
  const data = await getApyInfo()

  return (
    <div>
      <div className="relative flex flex-col items-center gap-16">
        <AstraStar className="left-0 top-[20%]" />
        <AstraStar className="left-[10%] top-[20%]" />
        <AstraStar className="left-[30%] top-[40%]" />
        <AstraStar className="left-[55%] top-[60%]" />
        <AstraStar className="right-[30%] top-[40%]" />
        <AstraStar className="right-[55%] top-[30%]" />
        <h2 className="text-4xl font-bold text-center">
          EARN BONUS ASTRADAO THE LONGER YOU STAY INVESTED
        </h2>
        <div className="grid grid-cols-12 gap-4 w-full">
          {footerInfo.map((info) => (
            <div
              key={info.data}
              className="md:col-span-4 col-span-full flex items-center justify-between flex-col gap-4 text-center"
            >
              <div className="flex justify-center h-[4rem] w-[4rem]">
                <div className="relative h-[3rem] w-[3rem]">
                  <Image alt={info.logoAlt} src={info.logo} fill />
                </div>
              </div>
              <h2 className="text-3xl font-bold">{info.title}</h2>
              <p className="max-w-[10rem] leading-5 ">{info.desc}</p>
              <h2 className="text-3xl font-bold text-astra-blue">
                {data &&
                !!data[info.data] &&
                data[info.data] != 0 &&
                !isNaN(data[info.data]) ? (
                  <>{numberFormatter(data[info.data])}% APY</>
                ) : (
                  'COMING SOON'
                )}
              </h2>
              <Link href={info.buttonUrl}>
                <Button
                  className="rounded-full text-xs py-6 px-16 border border-astra-blue dark:text-[#002835] dark:bg-white dark:hover:bg-white/80 dark:hover:text-[#002835]"
                  variant="outline"
                >
                  {info.buttonName}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <div>
          <AstraLogo width={175} height={175} />
        </div>
      </div>
    </div>
  )
}
