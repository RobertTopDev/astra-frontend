import React from 'react'
import { StakingOverview } from './sections/staking-overview'
import { StakingBody } from './sections/staking-body'

const StakingPage = () => {
  return (
    <main className="min-h-screen  ">
      <div className="w-full container pb-20 flex flex-col gap-12">
        <StakingOverview />
        <StakingBody />
      </div>
    </main>
  )
}

export default StakingPage
