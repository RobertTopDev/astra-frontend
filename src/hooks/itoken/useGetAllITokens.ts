'use client'
import { erc20ABI, useNetwork, usePublicClient } from 'wagmi'
import { defaultChain } from '@/config'
import { useChainConfig } from '..'
import { itokenStakingABI } from '@/abis'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { TIToken } from '@/types'

type TUseGetAllITokensProps = UseQueryOptions<TIToken[], unknown, TIToken[]>

export const useGetAllITokens = ({ ...props }: TUseGetAllITokensProps) => {
  const { chain = defaultChain } = useNetwork()
  const { chainConfig } = useChainConfig()

  const publicClient = usePublicClient()

  return useQuery<TIToken[], unknown, TIToken[]>(
    ['itokens', chain.id],
    async () => {
      const itokens: TIToken[] = []
      let isBreak = false
      for (let index = 0; isBreak === false; index++) {
        await publicClient
          .readContract({
            address: chainConfig.iTokenStakingContractAddress,
            abi: itokenStakingABI,
            functionName: 'itokenInfo',
            args: [BigInt(index)],
          })
          .then(async (itoken) => {
            const [name, symbol] = await Promise.all([
              publicClient.readContract({
                address: itoken[0],
                abi: erc20ABI,
                functionName: 'name',
              }),
              publicClient.readContract({
                address: itoken[0],
                abi: erc20ABI,
                functionName: 'symbol',
              }),
            ])
            itokens.push({
              id: index,
              itoken: itoken[0],
              contractAddress: itoken[0],
              decimal: Number(itoken[1]),
              poolId: Number(itoken[2]),
              name,
              symbol,
            })
          })
          .catch(() => {
            isBreak = true
          })
      }
      return itokens
    },
    { ...props, cacheTime: 0 }
  )
}
