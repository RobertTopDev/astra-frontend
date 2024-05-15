'use client'
import { erc20ABI, usePublicClient } from 'wagmi'
import { useChainConfig } from '..'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { TLpToken } from '@/types'
import { v3StakingAbi } from '@/abis/v3-staking-abi'

type TUseGetAllLpTokensProps = UseQueryOptions<TLpToken[], unknown, TLpToken[]>

export const useGetAllLpTokens = ({ ...props }: TUseGetAllLpTokensProps) => {
  // const { chain = defaultChain } = useNetwork()
  const { chainConfig, chain } = useChainConfig()

  const publicClient = usePublicClient()

  return useQuery<TLpToken[], unknown, TLpToken[]>(
    ['lp-tokens', chain.id],
    async () => {
      const lpTokens: TLpToken[] = []
      const totalPools = await publicClient.readContract({
        address: chainConfig.ChefContractAddress,
        abi: v3StakingAbi,
        functionName: 'poolLength',
      })
      for (let index = 0; index < Number(totalPools); index++) {
        const [contractAddress] = await publicClient.readContract({
          address: chainConfig.ChefContractAddress,
          abi: v3StakingAbi,
          functionName: 'poolInfo',
          args: [BigInt(index)],
        })
        const tokenName = await publicClient.readContract({
          address: contractAddress,
          abi: erc20ABI,
          functionName: 'name',
        })
        lpTokens.push({
          poolId: index,
          name: tokenName,
          contractAddress,
          img2: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
        })
      }
      return lpTokens
    },
    { ...props }
  )
}
