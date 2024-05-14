'use client'
import { AstraButtonAuthenticated, AstraHeader } from '@/components'
import { Button, ScrollArea } from '@/components/shadcn'
import { useChainConfig } from '@/hooks'
import Link from 'next/link'
import React from 'react'

const StakingAstraHeader = () => {
  const { chainConfig } = useChainConfig()

  return (
    <div className="flex flex-col gap-12">
      <AstraHeader className="text-center">STAKE ASTRADAO</AstraHeader>
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-6 flex flex-col gap-12">
          <div className="font-bold text-xl">
            Maximize yield by staking ASTRADAO
          </div>
          <ScrollArea className="h-[200px] w-full">
            When your ASTRADAO is staked and moved to the lockup vaults, you
            receive higher rewards. You can increase your staking APY using
            staking score and lockup periods simultaneously (multiplier will be
            accumulated).
            <br />
            <br />
            There are four lockup vaults to choose from, and each has its
            different benefits. If you select the “No lock up vault,” you earn
            the base rewards of 1.0x. If you choose the “6, 9, or 12 Months
            lock-up vault”, your reward multiplier increases from 1 to 1.1x,
            1.3x, and 1.8x, respectively, thereby increasing your reward. <br />
            <br />
            Your staking score is calculated as an average of ASTRADAO token
            holdings over the last 60 days. Increasing the number of tokens
            staked will increase your staking score. A staking score of 100,000
            tokens will increase reward multiplier by 1.2x, 300,000 by 1.3x and
            800,000 or more by 1.7x. <br />
            <br />
            Also, staking into the 12-month vault will increase your staking
            score faster than other lock-up vaults. If you choose to stake
            800,000 tokens or more into the 12 Month lockup vault your
            multiplier synergy would be 1.8x for lock up vault and 1.7x for
            staking score bringing your DAY 1 “Reward Multiplier” to 2.5x and
            earning you the most rewards out of all the vaults available. <br />
            <br />
            Your ASTRADAO is continuously compounding until you unstake. To
            withdraw from the staking pool, you must go through
            {chainConfig.cooldownDetails.ASTRAStakingCooldownDays}&nbsp;
            {chainConfig.cooldownDetails.ASTRAStakingCooldownDaysUnit} of the
            cooldown period. Claiming rewards is subject to slashing unless
            re-staked into the 6 Month lockup vault and locked for a minimum of
            90 days. To learn more about staking, watch our tutorial video or
            read the whitepaper.
          </ScrollArea>
          &nbsp;
          <div className="flex">
            <AstraButtonAuthenticated>
              <Link href="/staking/transactions">
                <Button variant="astra-blue">VIEW TRANSACTION HISTORY</Button>
              </Link>
            </AstraButtonAuthenticated>
          </div>
        </div>
        <div className="col-span-6">
          &nbsp;
          <div className="video-container h-full">
            <iframe
              allowFullScreen
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/j89b5kSgu8M"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export { StakingAstraHeader }
