'use client'

import { useAccount, useNetwork, usePublicClient } from 'wagmi'
import { defaultChain } from '@/config'
import { launchpadVestingAbi } from '@/abis'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { TLaunchpadDetailInfo, TLaunchpadVestingReward } from '@/types'

// should receive launchpad token decimal, vesting contract address as parameter
type TUseVestingRewardsProps = UseQueryOptions<
  TLaunchpadVestingReward[],
  unknown,
  TLaunchpadVestingReward[]
> & {
  launchpads: TLaunchpadDetailInfo[] | undefined
}

export const useLaunchpadVestingRewards = ({
  launchpads,
  ...props
}: TUseVestingRewardsProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()
  const publicClient = usePublicClient()

  return useQuery<
    TLaunchpadVestingReward[],
    unknown,
    TLaunchpadVestingReward[]
  >(
    ['vesting-rewards', chain.id, address],
    async () => {
      try {
        const vestingRewards: TLaunchpadVestingReward[] = []
        if (address === undefined || launchpads === undefined) return []
        for (let j = 0; j < launchpads.length; j++) {
          const launchpad = launchpads[j]
          if (
            !launchpad.LAUNCHPAD_ADDRESS ||
            launchpad.LAUNCHPAD_ADDRESS === undefined ||
            !launchpad.VEST_ADDRESS
          )
            continue
          const vestingAddress = launchpad.VEST_ADDRESS
          const vestingSchedulesCountByBeneficiary =
            await publicClient.readContract({
              address: vestingAddress as `0x${string}`,
              abi: launchpadVestingAbi,
              functionName: 'getVestingSchedulesCountByBeneficiary',
              args: [address],
            })
          for (let i = 0; i < Number(vestingSchedulesCountByBeneficiary); i++) {
            let releasableAmount = 0
            const [vestingIndexDetails, vestingScheduleID] = await Promise.all([
              publicClient.readContract({
                address: vestingAddress as `0x${string}`,
                abi: launchpadVestingAbi,
                functionName: 'getVestingScheduleByAddressAndIndex',
                args: [address, BigInt(i)],
              }),
              publicClient.readContract({
                address: vestingAddress as `0x${string}`,
                abi: launchpadVestingAbi,
                functionName: 'computeVestingScheduleIdForAddressAndIndex',
                args: [address, BigInt(i)],
              }),
            ])
            if (vestingIndexDetails.revoked) {
              vestingRewards.push({
                releaseAmount: 0,
                revoked: true,
                totalTokenAmount: 0,
                vestingStart: launchpad.VEST_START!,
                vestingCliff: launchpad.VEST_CLIFF!,
                vestingDuration: launchpad.VEST_DURATION!,
                vestingSlicePeriodSeconds: launchpad.VEST_SLICE_PERIOD_SECONDS!,
                vestingInitialUnlock: launchpad.VEST_INITIAL_UNLOCK!,
              })
            }
            if (vestingScheduleID) {
              const computedReleasableAmount = await publicClient.readContract({
                address: vestingAddress as `0x${string}`,
                abi: launchpadVestingAbi,
                functionName: 'computeReleasableAmount',
                args: [vestingScheduleID],
              })
              releasableAmount = Number(
                formatUnits(
                  computedReleasableAmount,
                  launchpad.LAUNCHPAD_TOKEN_DECIMAL
                )
              )
            }
            vestingRewards.push({
              launchpadAddress: launchpad.LAUNCHPAD_ADDRESS as `0x${string}`,
              launchpadTokenName: launchpad.LAUNCHPAD_TOKEN_NAME,
              launchpadTokenDecimals: launchpad.LAUNCHPAD_TOKEN_DECIMAL,
              vestingAddress: vestingAddress as `0x${string}`,
              vestingIndexDetails,
              vestingScheduleID,
              releaseAmount: releasableAmount,
              revoked: false,
              totalTokenAmount: Number(
                formatUnits(
                  vestingIndexDetails.amountTotal,
                  launchpad.LAUNCHPAD_TOKEN_DECIMAL
                )
              ),
              vestingStart: launchpad.VEST_START!,
              vestingCliff: launchpad.VEST_CLIFF!,
              vestingDuration: launchpad.VEST_DURATION!,
              vestingSlicePeriodSeconds: launchpad.VEST_SLICE_PERIOD_SECONDS!,
              vestingInitialUnlock: launchpad.VEST_INITIAL_UNLOCK!,
            })
          }
        }
        return vestingRewards
      } catch (err) {
        console.error({ err })
        return []
      }
    },
    { ...props, enabled: address !== undefined }
  )
}
