'use client'

import React, { ReactNode, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/shadcn'
import { MiniIdenticon } from '@/components/mini-identicon'
import { TLaunchpadDetailInfo, TLogoLink } from '@/types'

import Offering from './Offerings'
import Dao from './Dao'
import KeyMetrics from './KeyMetrics'
import Unlocks from './Unlocks'

type TComponent = {
  launchpadDetail: TLaunchpadDetailInfo
}

export default function Overview({ launchpadDetail }: TComponent) {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const tabContent: ReactNode[] = [
    <Offering key="offering" launchpadData={launchpadDetail} />,
    <Dao key="dao" launchpadDetail={launchpadDetail!} />,
    <KeyMetrics key="keymetrics" launchpadDetail={launchpadDetail} />,
    <Unlocks key="unlocks" launchpadDetail={launchpadDetail} />,
  ]

  const socialLinks: TLogoLink[] = [
    {
      alt: 'Twitter Logo',
      logoUrl: '/svgs/twitter_logo.svg',
      redirectUrl: launchpadDetail?.TWITTER || '#',
      background: 'bg-white',
    },
  ]
  if (launchpadDetail?.GITHUB) {
    socialLinks.push({
      alt: 'Git Logo',
      logoUrl: '/svgs/github.svg',
      redirectUrl: launchpadDetail?.GITHUB || '#',
      background: 'bg-[#d9d9d9]',
    })
  }
  if (launchpadDetail?.DISCORD) {
    socialLinks.push({
      alt: 'Discord Logo',
      logoUrl: '/svgs/discord.svg',
      redirectUrl: launchpadDetail?.DISCORD || '#',
      background: 'bg-astra-orange',
    })
  }
  if (launchpadDetail?.MEDIUM) {
    socialLinks.push({
      alt: 'Medium Logo',
      logoUrl: '/images/medium-logo.png',
      redirectUrl: launchpadDetail?.MEDIUM || '#',
      background: 'bg-[#f6832e]',
    })
  }
  socialLinks.push({
    alt: 'Telegram Logo',
    logoUrl: '/svgs/telegram.svg',
    redirectUrl: launchpadDetail?.TELEGRAM.startsWith('@')
      ? launchpadDetail?.TELEGRAM.replace('@', 'https://t.me/')
      : launchpadDetail?.TELEGRAM || '#',
    background: 'bg-[#56a8ea]',
  })

  return (
    <Card className="w-full relative border-0 col-span-1 rounded-3xlshadow-xl p-[1px] bg-gradient-to-b from-transparent to-gray-200">
      <div className="rounded-[calc(1rem-4px)] xl:p-10 p-5 bg-[#1F1F2D]">
        <CardHeader className="p-0 flex flex-row items-center gap-8">
          <div className="relative self-stretch w-3/4 flex items-stretch justify-between gap-8 mt-6">
            <div className="relative h-32 w-32">
              <MiniIdenticon
                seed="ddd"
                image={launchpadDetail?.PROJECT_IMAGE}
              />
            </div>
            <div className="self-center flex grow basis-[0%] flex-col items-stretch my-auto">
              <div className="text-white text-xl tracking-[2px]">
                {launchpadDetail?.LAUNCHPAD_TOKEN_NAME}
              </div>
              <div className="text-white text-sm mt-3.5">
                {launchpadDetail?.PROJECT_DETAIL}
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
                  Screening
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
      <Link href={link.redirectUrl} scroll={false} id={`layout-${link}`} target='_blank'>
        <Image src={link.logoUrl} alt={link.alt} width={24} height={24} />
      </Link>
    )
  }
  return (
    <li className="font-bold">
      <div
        className={`p-2 flex items-center justify-center ${
          link?.background || 'bg-astra-blue'
        }`}
        style={{ borderRadius: '50%', height: '40px', width: '40px' }}
      >
        {linkNode}
      </div>
    </li>
  )
}
