'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, Button } from '@/components/shadcn'
import { AstraLink, AstraLoading } from '@/components'
import { MiniIdenticon } from '@/components/mini-identicon'
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons'
import { useGetBuyRuleLaunchpad } from '@/hooks'

export default function FollowSection() {
  const { data: buyRuleStatus, isLoading: buyRuleStatusLoading } =
    useGetBuyRuleLaunchpad()

  return (
    <Card className="w-full relative border-0 col-span-1 rounded-3xl bg-[#363653] shadow-xl p-10">
      <CardContent className="p-0 flex flex-row items-center">
        <div className="self-stretch w-1/2 flex justify-between gap-8 pr-8 border-[#FFFFFF21] border-r-2 border-solid">
          <div className="relative h-32 w-32">
            <MiniIdenticon seed="ddd" />
          </div>
          <div className="flex grow basis-[0%] flex-col items-stretch">
            <div className="text-white text-3xl tracking-[2px]">
              participate in Polygon Ecosystem
            </div>
            <div className="h-0.5 my-4 bg-[#FFFFFF21]"></div>
            <div className="text-white text-sm">
              <div>
                <span>Number of participants:</span>&nbsp;
                <span className="text-astra-blue">4977 participants</span>
              </div>
              <div>
                <span>Total Assets Connected:</span>&nbsp;
                <span className="text-astra-blue">$83,848,772</span>
              </div>
            </div>
            <a href="#" aria-label="View">
              {/* <Button
                variant="ghost"
                className="py-2 mt-4 bg-[#292944] text-[#66667A] rounded w-[150px]"
              >
                <span className="text-base">Not Eligible</span>
              </Button> */}
              <Button
                variant="astra-blue"
                className="py-2 mt-4 rounded w-[150px]"
              >
                <span className="text-base">ELIGIBLE</span>
              </Button>
            </a>
          </div>
        </div>
        <div className="w-1/2 pl-8">
          <div className="text-sm">
            In order to Participate in this public sale you need to
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex gap-4 rounded-xl items-center p-4 bg-[#454561] justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-4">
                  <Image
                    alt="twitter"
                    className="!relative"
                    src="/svgs/twitter_blue.svg"
                    style={{ fill: '#56A8EA' }}
                    fill={true}
                  />
                </div>
                User needs to follow Astra DAO on Twitter.
              </div>
              <ResetIcon className="w-8 h-8" />
            </div>
            <div className="flex gap-4 rounded-xl items-center p-4 bg-[#454561] justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-4">
                  <Image
                    alt="telegram"
                    className="!relative"
                    src="/svgs/telegram_blue.svg"
                    fill={true}
                  />
                </div>
                User needs to follow Astra DAO on Telegram.
              </div>
              <ResetIcon className="w-8 h-8" />
            </div>
            <div className="flex gap-4 rounded-xl items-center p-4 bg-[#454561] justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-4">
                  <Image
                    alt="twitter"
                    className="!relative"
                    src="/svgs/twitter_blue.svg"
                    fill={true}
                  />
                </div>
                Follow launch pad project (ETH) on Twitter.
              </div>
              <CheckIcon className="w-8 h-8 text-astra-blue" />
            </div>
            <div className="flex gap-4 rounded-xl items-center p-4 bg-[#454561] justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-4">
                  <Image
                    alt="talegram"
                    className="!relative"
                    src="/svgs/telegram_blue.svg"
                    fill={true}
                  />
                </div>
                Follow launch pad project (ETH) on Telegram.
              </div>
              <ResetIcon className="w-8 h-8" />
            </div>
            <div className="flex gap-4 rounded-xl items-center p-4 bg-[#454561] justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-4">
                  <Image
                    alt="twitter"
                    className="!relative"
                    src="/svgs/astra_blue.svg"
                    fill={true}
                  />
                </div>
                Stake AstraDAO in a lockup vault.
              </div>
              <ResetIcon className="w-8 h-8" />
            </div>
            <div className="flex gap-4 rounded-xl items-center p-4 bg-[#454561] justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-4">
                  <Image
                    alt="twitter"
                    className="!relative"
                    src="/svgs/document.svg"
                    fill={true}
                  />
                </div>
                User needs to complete KYC.
              </div>
              <AstraLoading
                isLoading={buyRuleStatusLoading}
                className="w-6 h-6"
              >
                {buyRuleStatus && buyRuleStatus[0]?.result ? (
                  <CheckIcon className="w-8 h-8 text-astra-blue" />
                ) : (
                  <AstraLink link="/launchpad/kyc">
                    <ResetIcon className="w-8 h-8 text-white" />
                  </AstraLink>
                )}
              </AstraLoading>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
