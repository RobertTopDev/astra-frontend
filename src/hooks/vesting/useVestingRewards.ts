'use client'
import { useAccount, useNetwork, usePublicClient } from 'wagmi'
import { defaultChain } from '@/config'
import { useAstraDecimal, useChainConfig } from '..'
import { vestingAbi } from '@/abis'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { TVestingReward } from '@/types'

type TUseVestingRewardsProps = UseQueryOptions<
  TVestingReward[],
  unknown,
  TVestingReward[]
>

export const useVestingRewards = ({ ...props }: TUseVestingRewardsProps) => {
  const { chain = defaultChain } = useNetwork()
  const { chainConfig } = useChainConfig()
  const { address } = useAccount()
  const publicClient = usePublicClient()

  const { data: astraDecimals } = useAstraDecimal()

  return useQuery<TVestingReward[], unknown, TVestingReward[]>(
    ['vesting-rewards', chain.id, address],
    async () => {
      try {
        if (address === undefined || astraDecimals === undefined) return []
        const vestingSchedulesCountByBeneficiary =
          await publicClient.readContract({
            address: chainConfig.VestingContractAddress,
            abi: vestingAbi,
            functionName: 'getVestingSchedulesCountByBeneficiary',
            args: [address],
          })
        const vestingRewards: TVestingReward[] = []
        for (let i = 0; i < Number(vestingSchedulesCountByBeneficiary); i++) {
          let releasableAmount = 0
          const [vestingIndexDetails, vestingScheduleID] = await Promise.all([
            publicClient.readContract({
              address: chainConfig.VestingContractAddress,
              abi: vestingAbi,
              functionName: 'getVestingScheduleByAddressAndIndex',
              args: [address, BigInt(i)],
            }),
            publicClient.readContract({
              address: chainConfig.VestingContractAddress,
              abi: vestingAbi,
              functionName: 'computeVestingScheduleIdForAddressAndIndex',
              args: [address, BigInt(i)],
            }),
          ])
          if (vestingIndexDetails.revoked) {
            vestingRewards.push({
              releaseAmount: 0,
              revoked: true,
              totalTokenAmount: 0,
            })
          }
          if (vestingScheduleID) {
            const computedReleasableAmount = await publicClient.readContract({
              address: chainConfig.VestingContractAddress,
              abi: vestingAbi,
              functionName: 'computeReleasableAmount',
              args: [vestingScheduleID],
            })
            releasableAmount = Number(
              formatUnits(computedReleasableAmount, astraDecimals)
            )
          }
          vestingRewards.push({
            vestingIndexDetails,
            vestingScheduleID,
            releaseAmount: releasableAmount,
            revoked: false,
            totalTokenAmount: Number(
              formatUnits(vestingIndexDetails.amountTotal, astraDecimals)
            ),
          })
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
