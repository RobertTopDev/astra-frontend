'use client'

import React, { ReactNode, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/shadcn'
import { MiniIdenticon } from '@/components/mini-identicon'
import { socialLinks } from '@/constants'
import { TLogoLink } from '@/types'

import Offering from './Offerings'
import Dao from './Dao'
import KeyMetrics from './KeyMetrics'
import Unlocks from './Unlocks'

export default function Overview() {
  const [selectedTab, setSelectedTab] = useState<number>(0)

  const tabContent: ReactNode[] = [
    <Offering key="offering" />,
    <Dao key="dao" />,
    <KeyMetrics key="keymetrics" />,
    <Unlocks key="unlocks" />,
  ]

  return (
    <Card className="w-full relative border-0 col-span-1 rounded-3xlshadow-xl p-[1px] bg-gradient-to-b from-transparent to-gray-200">
      <div className="rounded-[calc(1rem-4px)] xl:p-10 p-5 bg-[#1F1F2D]">
        <CardHeader className="p-0 flex flex-row items-center gap-8">
          <div className="relative self-stretch w-3/4 flex items-stretch justify-between gap-8 mt-6">
            <div className="relative h-32 w-32">
              <MiniIdenticon seed="ddd" />
            </div>
            <div className="self-center flex grow basis-[0%] flex-col items-stretch my-auto">
              <div className="text-white text-xl tracking-[2px]">Polygon</div>
              <div className="text-white text-sm mt-3.5">
                Pucca Family is the industry’s first and largest blockchain
                ecosystem in Latin America that captures a region with 670M+
                people and a $5.5 trillion GDP.
              </div>
            </div>
          </div>
          <div className="w-1/4">
            <ul className="gap-2 flex flex-wrap">
              {socialLinks.map((link: TLogoLink) => (
                <LogoLink link={link} key={link.alt + link.logoUrl} />
              ))}
            </ul>
          </div>
        </CardHeader>
        <div className="bg-[#FFFFFF33] my-8 h-px"></div>
        <CardContent className="xl:p-10 p-5 rounded-3xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl relative">
          <div className="flex gap-32 items-start">
            <div className="max-w-[800px] w-full">
              <div className="flex overflow-x-auto whitespace-nowrap rounded-xl items-center p-1 bg-[#292944]">
                <div
                  className={`flex-1 text-center rounded-xl cursor-pointer p-3 ${
                    selectedTab === 0
                      ? 'bg-astra-blue bg-opacity-15 text-astra-blue'
                      : 'text-white'
                  }`}
                  onClick={() => setSelectedTab(0)}
                >
                  Offerings
                </div>
                <div
                  className={`flex-1 text-center rounded-xl cursor-pointer p-3 ${
                    selectedTab === 1
                      ? 'bg-astra-blue bg-opacity-15 text-astra-blue'
                      : 'text-white'
                  }`}
                  onClick={() => setSelectedTab(1)}
                >
                  DAO Screening
                </div>
                <div
                  className={`flex-1 text-center rounded-xl cursor-pointer p-3 ${
                    selectedTab === 2
                      ? 'bg-astra-blue bg-opacity-15 text-astra-blue'
                      : 'text-white'
                  }`}
                  onClick={() => setSelectedTab(2)}
                >
                  Key Metrics
                </div>
                <div
                  className={`flex-1 text-center rounded-xl cursor-pointer p-3 ${
                    selectedTab === 3
                      ? 'bg-astra-blue bg-opacity-15 text-astra-blue'
                      : 'text-white'
                  }`}
                  onClick={() => setSelectedTab(3)}
                >
                  Unlocks
                </div>
              </div>
              <div className="rounded-xl mt-4 p-[1px] bg-gradient-to-b from-transparent to-gray-200 shadow-xl">
                <div className="md:p-8 p-4 rounded-[calc(0.75rem-1px)] bg-gradient-to-r from-[#51547597] to-[#51547599]">
                  {tabContent[selectedTab]}
                </div>
              </div>
            </div>
            <div className="lg:block hidden w-1/4 h-full aspect-w-9 aspect-h-16 top-0 right-[-1rem]">
              <Image
                alt="Dolphin"
                width="180"
                height="200"
                src="/images/launchpad/dolphin.png"
                className="object-cover"
              />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

type LINKProps = {
  link: TLogoLink
}
export const LogoLink = ({ link }: LINKProps) => {
  let linkNode: ReactNode
  if (link.external) {
    linkNode = (
      <Link
        href={link.redirectUrl}
        scroll={false}
        id={`layout-${link}`}
        target="_blank"
      >
        <Image src={link.logoUrl} alt={link.alt} fill={true} />
      </Link>
    )
  } else {
    linkNode = (
      <Link href={link.redirectUrl} scroll={false} id={`layout-${link}`}>
        <Image src={link.logoUrl} alt={link.alt} width={24} height={24} />
      </Link>
    )
  }
  return (
    <li className="font-bold">
      <div className="rounded-full bg-astra-blue p-2">{linkNode}</div>
    </li>
  )
}
