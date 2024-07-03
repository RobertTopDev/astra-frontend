'use client'
import { useAccount, useNetwork, usePublicClient } from 'wagmi'
import { defaultChain } from '@/config'
import { useChainConfig } from '..'
import { chefAbi } from '@/abis'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { TUserLpTokenStakeInfo } from '@/types'

type TUseLpTokenUserAllStakeInfo = UseQueryOptions<
  TUserLpTokenStakeInfo[],
  unknown,
  TUserLpTokenStakeInfo[]
>

export const useLpTokenUserAllStakeInfo = ({
  ...props
}: TUseLpTokenUserAllStakeInfo) => {
  const { chain = defaultChain } = useNetwork()
  const { chainConfig } = useChainConfig()
  const { address } = useAccount()

  const publicClient = usePublicClient()

  return useQuery<TUserLpTokenStakeInfo[], unknown, TUserLpTokenStakeInfo[]>(
    ['user-stake-info', chain.id],
    async () => {
      if (address === undefined) return []
      const userStakeInfoArray: TUserLpTokenStakeInfo[] = []
      let isBreak = false
      for (let index = 0; isBreak === false; index++) {
        try {
          // const [iTokenInfo, userStakeInfo] = await Promise.all([
          const userStakeInfo = await publicClient.readContract({
            address: chainConfig.iTokenStakingContractAddress,
            abi: chefAbi,
            functionName: 'userStakeInfo',
            args: [BigInt(0), address, BigInt(index)],
          })
          if (Number(userStakeInfo[5]) === 0) {
            isBreak = true
            break
          }
          const timestamp = Number(userStakeInfo[1])
          const withdrawTime = Number(userStakeInfo[3])
          const vault = Number(userStakeInfo[2])
          const lpTokenAmount = Number(userStakeInfo[5])
          const lpTokenId = Number(userStakeInfo[4])
          userStakeInfoArray.push({
            amount: Number(userStakeInfo[0]),
            timestamp,
            withdrawTime,
            lpTokenAmount,
            lpTokenId,
            vault,
            isERC721: userStakeInfo[5],
          })
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
