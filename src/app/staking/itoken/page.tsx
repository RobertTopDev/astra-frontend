import React from 'react'
import { StakingITokenHeader } from './sections/staking-itoken-header'
import { StakingITokenBody } from './sections/staking-itoken-body'
import { getApyInfo } from '@/util/api'

const StakingITokenPage = async () => {
  const data = await getApyInfo()

  return (
    <main className="min-h-screen">
      <div className="w-full container pb-20 flex flex-col gap-12">
        <StakingITokenHeader />
        <StakingITokenBody apyInfo={data} />
      </div>
    </main>
  )
}

export default StakingITokenPage
