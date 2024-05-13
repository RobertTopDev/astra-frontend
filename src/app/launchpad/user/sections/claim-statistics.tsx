'use client'

import { AstraHeader } from '@/components'
import { Separator } from '@/components/shadcn'
import { useLaunchpadVestingRewards } from '@/hooks'
import { differenceInCalendarWeeks } from 'date-fns'
import { VestingRewardActions } from './vesting-reward-actions'
import { numberFormatter, shorten } from '@/util'
import { TLaunchpadDetailInfo } from '@/types'
import Loading from '@/app/loading'
import { formatUnits } from 'viem'
import { useChainConfig } from '@/hooks'
import { useEffect } from 'react'

interface TPage {
  launchpads: TLaunchpadDetailInfo[] | undefined
  launchpadLoading: boolean
}

const ClaimStatistics = ({ launchpads, launchpadLoading }: TPage) => {
  // const week = differenceInCalendarWeeks(new Date(), new Date('2022-08-16'))
  const { chainConfig } = useChainConfig()
  const {
    data: vestingRewards,
    refetch: refetchVestingRewards,
    isLoading: vestingRewardLoading,
  } = useLaunchpadVestingRewards({ launchpads })

  const refetchDatas = () => {
    refetchVestingRewards?.()
  }

  useEffect(() => {
    if (launchpads?.length === 0) return
    refetchVestingRewards()
  }, [launchpads])

  return vestingRewards === undefined || vestingRewards.length === 0 ? (
    vestingRewardLoading || launchpadLoading ? (
      <Loading />
    ) : (
      <></>
    )
  ) : (
    <div className="flex flex-col items-center gap-4 py-8 mt-12">
      <AstraHeader>My Launchpad Vesting</AstraHeader>
      <div className="flex flex-col gap-8 w-full">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-400 ">
              <tr className="bg-[#000000] bg-opacity-30">
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Launchpad Address
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Vesting Address
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Vesting Start
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Vesting Cliff
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Vesting Duration
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Vesting Slice Period
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Vesting Initial Unlock
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Token Name
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Claimable Amount
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Claimed Amount
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {vestingRewards?.map((vestingReward, index) => (
                <tr
                  className="border-b bg-[#B2C4E833] text-white border-gray-800 hover:bg-gray-800"
                  key={index}
                >
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() =>
                      window.open(
                        `${chainConfig.networkURL}address/${vestingReward.launchpadAddress}`
                      )
                    }
                  >
                    {shorten(vestingReward.launchpadAddress ?? '')}
                  </td>
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() =>
                      window.open(
                        `${chainConfig.networkURL}address/${vestingReward.vestingAddress}`
                      )
                    }
                  >
                    {shorten(vestingReward.vestingAddress ?? '')}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {vestingReward.vestingStart.toString()}
                  </td>
                  <td className="px-6 py-4">
                    {vestingReward.vestingCliff / 86400}{' '}
                    {vestingReward.vestingCliff / 86400 === 1 ? 'day' : 'days'}
                  </td>
                  <td className="px-6 py-4">
                    {vestingReward.vestingDuration / 86400}{' '}
                    {vestingReward.vestingDuration / 86400 === 1
                      ? 'day'
                      : 'days'}
                  </td>
                  <td className="px-6 py-4">
                    {vestingReward.vestingSlicePeriodSeconds / 86400}{' '}
                    {vestingReward.vestingSlicePeriodSeconds / 86400 === 1
                      ? 'day'
                      : 'days'}
                  </td>
                  <td className="px-6 py-4">
                    {vestingReward.vestingInitialUnlock}
                    {' %'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {vestingReward.launchpadTokenName}
                  </td>
                  <td className="px-6 py-4">
                    {numberFormatter(vestingReward.totalTokenAmount)}
                  </td>
                  <td className="px-6 py-4">
                    {numberFormatter(vestingReward.releaseAmount)}
                  </td>
                  <td className="px-6 py-4">
                    {numberFormatter(
                      Number(
                        formatUnits(
                          vestingReward?.vestingIndexDetails?.released ??
                            BigInt(0),
                          vestingReward?.launchpadTokenDecimals ?? 18
                        )
                      )
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <VestingRewardActions
                      vestingReward={vestingReward}
                      refetchDatas={refetchDatas}
                    ></VestingRewardActions>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export { ClaimStatistics }
