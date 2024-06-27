'use client'

import { AstraHeader } from '@/components'
import { useLaunchpadVestingRewards } from '@/hooks'
import { VestingRewardActions } from './vesting-reward-actions'
import { numberFormatter } from '@/util'
import { TLaunchpadDetailInfo } from '@/types'
import Loading from '@/app/loading'
import { formatUnits } from 'viem'
import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn'

interface TPage {
  launchpads: TLaunchpadDetailInfo[] | undefined
  launchpadLoading: boolean
}

const ClaimStatistics = ({ launchpads, launchpadLoading }: TPage) => {
  const { getLaunchpadVestingRewards } = useLaunchpadVestingRewards({
    launchpads,
  })

  const [open, setOpen] = useState<boolean>(false)
  const [vestingRewards, setVestingRewards] = useState<any[]>([])
  const [vestingRewardLoading, setVestingRewardLoading] =
    useState<boolean>(false)

  const fetchLaunchpadVestingRewards = async () => {
    const rewardsResult = await getLaunchpadVestingRewards()
    setVestingRewards(rewardsResult)
  }

  useEffect(() => {
    async function init() {
      if (launchpads?.length === 0) return
      setVestingRewardLoading(true)
      await fetchLaunchpadVestingRewards()
      setVestingRewardLoading(false)
    }

    init()
  }, [launchpads])

  if (vestingRewardLoading || launchpadLoading) {
    return <Loading />
  }

  if (vestingRewards === undefined || vestingRewards.length === 0) {
    return <></>
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8 mt-12">
      <AstraHeader>My Launchpad Vesting</AstraHeader>
      <div className="flex flex-col gap-8 w-full">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-400 ">
              <tr className="bg-[#000000] bg-opacity-30">
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
                  Detail
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
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="px-16" variant="astra-blue">
                          Detail
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Vesting Token Detail</DialogTitle>
                        </DialogHeader>
                        <div className="content">
                          <div className="flex justify-between gap-4">
                            <div>Vesting Start:</div>
                            <div>{vestingReward.vestingStart.toString()}</div>
                          </div>
                          <div className="flex justify-between gap-4">
                            <div>Vesting Cliff:</div>
                            <div>
                              {' '}
                              {vestingReward.vestingCliff / 86400}{' '}
                              {vestingReward.vestingCliff / 86400 === 1
                                ? 'day'
                                : 'days'}
                            </div>
                          </div>
                          <div className="flex justify-between gap-4">
                            <div>Vesting Duration:</div>
                            <div>
                              {vestingReward.vestingDuration / 86400}{' '}
                              {vestingReward.vestingDuration / 86400 === 1
                                ? 'day'
                                : 'days'}
                            </div>
                          </div>
                          <div className="flex justify-between gap-4">
                            <div>Vesting Slice Period:</div>
                            <div>
                              {vestingReward.vestingSlicePeriodSeconds / 86400}{' '}
                              {vestingReward.vestingSlicePeriodSeconds /
                                86400 ===
                              1
                                ? 'day'
                                : 'days'}
                            </div>
                          </div>
                          <div className="flex justify-between gap-4">
                            <div>Vesting Initial Unlock:</div>
                            <div>
                              {vestingReward.vestingInitialUnlock}
                              {' %'}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                  <td className="px-6 py-4">
                    <VestingRewardActions
                      vestingReward={vestingReward}
                      refetchDatas={() => fetchLaunchpadVestingRewards()}
                    />
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
