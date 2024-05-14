import { AstraHeader, HeroBackdrop } from '@/components'
import React from 'react'
import { IndexCard, getIndices } from '../../components'

const IndicesCardsSection = async () => {
  const { highestEarner, mostInvested, lowestRisk } = await getIndices()

  return (
    <div className="overflow-hidden flex flex-col items-center justify-between relative py-20">
      <div className="bg-hero absolute w-screen bg-no-repeat bg-cover top-24 z-0 "></div>
      <HeroBackdrop />
      <div className="relative z-10 container w-full overflow-visible p-0 m-0">
        <div className="w-full flex flex-col items-center">
          <AstraHeader className="px-4 sm:px-0">
            Find the Right Indices for You
          </AstraHeader>
          <div className="flex flex-col w-full mt-[50px]">
            <div className="flex flex-col lg:flex-row w-full px-4 sm:p-0">
              <div className="flex w-full lg:w-1/3">
                {highestEarner && (
                  <IndexCard index={highestEarner} id="chart_one" />
                )}
              </div>
              <div className="flex w-full lg:w-1/3 lg:mx-[40px] xl:mx-[7%] my-10 lg:my-0">
                {mostInvested && (
                  <IndexCard index={mostInvested} id="chart_two" />
                )}
              </div>
              <div className="flex w-full lg:w-1/3 mx-auto">
                {lowestRisk && (
                  <IndexCard index={lowestRisk} id="chart_three" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { IndicesCardsSection }
