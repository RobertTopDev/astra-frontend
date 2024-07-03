'use client'
import { AstraHeader, AstraLoading } from '@/components'
import { Button, Separator } from '@/components/shadcn'
import {
  useAstraUSDPrice,
  useClaimTransactions,
  useVestingRewards,
} from '@/hooks'
import { differenceInCalendarWeeks } from 'date-fns'
import { VestingRewardActions } from './vesting-reward-actions'
import { numberFormatter } from '@/util'
import Link from 'next/link'

const ClaimStatistics = () => {
  const {
    data: vestingRewards,
    refetch: refetchVestingRewards,
    isLoading: vestingRewardLoading,
  } = useVestingRewards({})
  const { data: astraUSDPrice, isLoading: astraUSDPriceLoading } =
    useAstraUSDPrice({})
  const { data: claimTransactions, refetch: refetchClaimTransactions } =
    useClaimTransactions({})

  const week = differenceInCalendarWeeks(new Date(), new Date('2022-08-16'))

  const refetchDatas = () => {
    refetchVestingRewards?.()
    refetchClaimTransactions?.()
  }

  return (
    <div className="container flex flex-col items-center gap-4">
      {vestingRewards === undefined || vestingRewards.length === 0 ? (
        vestingRewardLoading ? (
          <AstraLoading
            isLoading={true}
            className="flex justify-center items-center w-full h-full"
          ></AstraLoading>
        ) : (
          <div className="min-h-screen flex flex-col gap-6 justify-center items-center transform -translate-y-[7rem]">
            <div className="flex gap-4 items-center">
              <div className="mr-[2rem] text-[6rem] transform rotate-90">
                <span>:</span>
                <span>(</span>
              </div>
              <h1 className="text-4xl font-bold">No Vesting Rewards found.</h1>
            </div>
            <Link href="/">
              <Button variant="astra-blue">Go back to Home</Button>
            </Link>
          </div>
        )
      ) : (
        <>
          <AstraHeader>STATS</AstraHeader>
          <div className="flex flex-col gap-8 w-full">
            {vestingRewards?.map((vestingReward, index) => (
              <div
                className="bg-[#15192b]/80 px-32 py-10 rounded-lg"
                key={index}
              >
                <div className="flex gap-8 items-center">
                  <div className="flex flex-col gap-4 w-full">
                    <div className="grid grid-cols-12 font-bold text-lg">
                      <div className="col-span-4">Category</div>
                      <div className="col-span-4">Claimable ASTRADAO</div>
                      <div className="col-span-2">Week</div>
                      <div className="col-span-2">USD</div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-12 font-bold">
                      <div className="col-span-4">
                        {claimTransactions?.categories[
                          vestingReward.totalTokenAmount
                        ] ?? 'Early Supporter - Customer'}
                      </div>
                      <div className="col-span-4">
                        {numberFormatter(vestingReward.releaseAmount)}
                      </div>
                      <div className="col-span-2">{week}</div>
                      <div className="col-span-2">
                        $&nbsp;
                        <AstraLoading isLoading={astraUSDPriceLoading}>
                          {astraUSDPrice !== undefined
                            ? numberFormatter(
                                vestingReward.releaseAmount * astraUSDPrice
                              )
                            : '0'}
                          &nbsp;
                        </AstraLoading>
                        USD
                      </div>
                    </div>
                  </div>
                  <VestingRewardActions
                    vestingReward={vestingReward}
                    refetchDatas={refetchDatas}
                  ></VestingRewardActions>
                </div>
              </div>
            ))}
          </div>
          {/* <AstraHeader>TRANSACTIONS</AstraHeader> */}
          {/* <div className="flex flex-col gap-8 w-full"></div> */}
        </>
      )}
    </div>
  )
}

export { ClaimStatistics }
