'use client'
import { AstraLoading } from '@/components'
import { Separator } from '@/components/shadcn'
import { useAstraUSDPrice } from '@/hooks'
import { numberFormatter } from '@/util'
import React from 'react'

type TLiquidityMiningStatisticsProps = {
  liquidityMiningDetails: {
    totalVolume: number
    tokenPrice: string
    totalLiquidity: number
    averageAPY: string
    percentageOfAstraStacked: string
  }
}

const LiquidityMiningStatistics = ({
  liquidityMiningDetails,
}: TLiquidityMiningStatisticsProps) => {
  const { data: astraUSDPrice, isLoading: astraUSDPriceLoading } =
    useAstraUSDPrice({})
  return (
    <div
      className="py-8 px-16 rounded-xl flex flex-col gap-6 items-center w-full"
      style={{
        background:
          'linear-gradient(269.95deg, #2c2c51 0.04%, #636389 108.31%)',
      }}
    >
      <div className="flex justify-center items-center gap-4">
        <div className="text-xl font-medium">STATISTICS</div>
        <span className="animate-ping inline-flex w-[0.75rem] h-[0.75rem] rounded-full bg-green-500"></span>
      </div>
      <Separator></Separator>
      <div className="flex justify-between w-full [&>div>span]:font-bold [&>div>span]:text-xl">
        <div className="flex flex-col gap-2">
          <div>Total Liquidity</div>
          <span>${numberFormatter(liquidityMiningDetails.totalLiquidity)}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div>Price ASTRADAO</div>
          <span>
            <AstraLoading isLoading={astraUSDPriceLoading}>
              ${numberFormatter(String(astraUSDPrice), true)}
            </AstraLoading>
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div>Volume(24h)</div>
          <span>${numberFormatter(liquidityMiningDetails.totalVolume)}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div>Percentage of ASTRADAO Staked</div>
          <span>
            {numberFormatter(liquidityMiningDetails.percentageOfAstraStacked)}%
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div>Average APY</div>
          <span>
            {numberFormatter(liquidityMiningDetails.averageAPY, true)}
          </span>
        </div>
      </div>
    </div>
  )
}

export { LiquidityMiningStatistics }
