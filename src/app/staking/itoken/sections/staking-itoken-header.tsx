'use client'
import { AstraButtonAuthenticated, AstraHeader, AstraLink } from '@/components'
import { Button, ScrollArea } from '@/components/shadcn'
import Link from 'next/link'
import React from 'react'

const StakingITokenHeader = () => {
  return (
    <div className="flex flex-col gap-12">
      <AstraHeader className="text-center">
        STAKE ITOKEN FOR ASTRADAO
      </AstraHeader>
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-6 flex flex-col gap-12">
          <div className="font-bold text-xl">
            Maximize yield by staking IToken
          </div>
          <ScrollArea className="h-[200px] w-full">
            When your iToken is staked, you receive rewards based on your
            percentage share of holdings. Multiplier weights are used to
            evaluate your participation in tokens distribution and how much
            rewards you earn. Your rewards are not auto-compounded and needs to
            be claimed. Claiming rewards is subject to&nbsp;
            <AstraLink link="https://docs.astradao.org/tutorials/claiming-rewards-itokens-staking-and-liquidity-mining">
              slashing
            </AstraLink>
            &nbsp; unless locked for a minimum of 90 days.&nbsp;
          </ScrollArea>
          &nbsp;
          <Link href="/staking/transactions">
            <AstraButtonAuthenticated>
              <Button variant="astra-blue">VIEW TRANSACTION HISTORY</Button>
            </AstraButtonAuthenticated>
          </Link>
        </div>
        <div className="col-span-6">
          <div className="video-container h-full">
            <iframe
              allowFullScreen
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/C05kIXvrGzk"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export { StakingITokenHeader }
