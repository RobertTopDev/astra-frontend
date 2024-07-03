import { AstraCard, AstraHeader } from '@/components'
import { Separator } from '@/components/shadcn'
import { utility } from '@/constants/about'
import React from 'react'

const AboutUtility = () => {
  return (
    <div className="relative z-20 container w-full pb-20">
      <div className="relative sm:mt-0 mt-10 w-full flex flex-col justify-center items-center gap-6">
        <AstraHeader className="text-left w-full">
          ASTRA DAO UTILITY
        </AstraHeader>
        <div className="text-lg text-justify">
          Astra DAO is an ERC-20 governance token that provides convenient and
          practical access to crypto-oriented investment strategies. The core
          idea of the platform is based on three groups of interest co-creating
          value – investors (users), product creators (indices/pools creators),
          and a Decentralized Autonomous Organization (DAO) governing the entire
          Astra DAO ecosystem. The following elements can describe the
          high-level use case behind the Astra DAO platform and its related
          products:
        </div>
        <AstraCard className="w-full">
          <div className="grid grid-cols-12 gap-x-6 gap-y-3 w-full">
            {utility.map((util, i) => (
              <>
                <div className="col-span-3">{util.product}</div>
                <div className="col-span-9">{util.description}</div>

                {i !== utility.length - 1 && (
                  <Separator className="col-span-full" />
                )}
              </>
            ))}
          </div>
        </AstraCard>
      </div>
    </div>
  )
}

export { AboutUtility }
