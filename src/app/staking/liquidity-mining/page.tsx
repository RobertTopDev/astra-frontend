import { AstraHeader } from '@/components'
import React from 'react'
import { LiquidityMiningStatistics } from './sections/liquidity-mining-statistics'
import { LiquidityMiningPools } from './sections/liquidity-mining-pools'
import {
  getAllPools,
  getLiquidityMiningDetails,
} from '@/app/staking/liquidity-mining/api'

const LiquidityMiningPage = async () => {
  const liquidityMiningDetails = await getLiquidityMiningDetails()
  const pools = await getAllPools()

  return (
    <main className="min-h-screen  ">
      <div className="container flex flex-col relative py-20 items-center gap-12">
        <AstraHeader>LIQUIDITY MINING</AstraHeader>
        <LiquidityMiningStatistics
          liquidityMiningDetails={liquidityMiningDetails}
        />
        <LiquidityMiningPools
          pools={pools}
          liquidityMiningDetails={liquidityMiningDetails}
        />
      </div>
    </main>
  )
}

export default LiquidityMiningPage
