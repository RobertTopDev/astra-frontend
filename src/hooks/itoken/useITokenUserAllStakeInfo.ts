'use client'
import { useAccount, useNetwork, usePublicClient } from 'wagmi'
import { defaultChain } from '@/config'
import { useChainConfig } from '..'
import { itokenStakingABI } from '@/abis'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { TUserITokenStakeInfo } from '@/types'

type TUseITokenUserAllStakeInfo = UseQueryOptions<
  TUserITokenStakeInfo[],
  unknown,
  TUserITokenStakeInfo[]
>

export const useITokenUserAllStakeInfo = ({
  ...props
}: TUseITokenUserAllStakeInfo) => {
  const { chain = defaultChain } = useNetwork()
  const { chainConfig } = useChainConfig()
  const { address } = useAccount()
  const publicClient = usePublicClient()

  return useQuery<TUserITokenStakeInfo[], unknown, TUserITokenStakeInfo[]>(
    ['user-stake-info', chain.id],
    async () => {
      if (address === undefined) return []
      const userStakeInfoArray: TUserITokenStakeInfo[] = []
      let isBreak = false
      for (let index = 0; isBreak === false; index++) {
        try {
          // const [iTokenInfo, userStakeInfo] = await Promise.all([
          const userStakeInfo = await publicClient.readContract({
            address: chainConfig.iTokenStakingContractAddress,
            abi: itokenStakingABI,
            functionName: 'userStakeInfo',
            args: [BigInt(0), address, BigInt(index)],
          })
          if (Number(userStakeInfo[5]) === 0) {
            isBreak = true
            break
          }
          const iTokenInfo = await publicClient.readContract({
            address: chainConfig.iTokenStakingContractAddress,
            abi: itokenStakingABI,
            functionName: 'itokenInfo',
            args: [BigInt(userStakeInfo[4])],
          })
          // ])
          const timestamp = Number(userStakeInfo[1])
          const withdrawTime = Number(userStakeInfo[3])
          const vault = Number(userStakeInfo[2])
          const iTokenAmount = Number(userStakeInfo[5])
          const iTokenId = Number(userStakeInfo[4])
          userStakeInfoArray.push({
            amount: Number(userStakeInfo[0]),
            iTokenDecimals: Number(iTokenInfo[1]),
            timestamp,
            withdrawTime,
            iTokenAmount,
            iTokenId,
            vault,
          })
          // if (timestamp !== 0 && withdrawTime === 0 && index === itokenId) {
          //   stakedAmount += parseFloat(itokenAmount)
          // }
        } catch (err) {
          console.error({ err })
          isBreak = true
        }
      }
      return userStakeInfoArray
    },
    {
      ...props,
      cacheTime: 0,
    }
  )
}
