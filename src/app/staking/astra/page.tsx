import React from 'react'
import { StakingAstraHeader } from './sections/staking-astra-header'
import { StakingAstraBody } from './sections/staking-astra-body'
import { getApyInfo } from '@/util/api'

const StakingAstraPage = async () => {
  const data = await getApyInfo()

  return (
    <main className="min-h-screen">
      <div className="w-full container pb-20 flex flex-col gap-12">
        <StakingAstraHeader />
        <StakingAstraBody apyInfo={data} />
      </div>
    </main>
  )
}

export default StakingAstraPage
