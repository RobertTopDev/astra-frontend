import React from 'react'
import { StakingLpTokenHeader } from './sections/staking-lp-token-header'
import { StakingLpTokenBody } from './sections/staking-lp-token-body'
import { getApyInfo } from '@/util/api'

const StakingLpTokenPage = async () => {
  const data = await getApyInfo()

  return (
    <main className="min-h-screen  ">
      <div className="w-full container pb-20 flex flex-col gap-12">
        <StakingLpTokenHeader />
        <StakingLpTokenBody apyInfo={data} />
      </div>
    </main>
  )
}

export default StakingLpTokenPage
