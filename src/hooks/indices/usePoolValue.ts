'use client'
import { erc20ABI, useNetwork, usePublicClient } from 'wagmi'
import { defaultChain } from '@/config'
import { useChainConfig } from '..'
import { DAAAbi } from '@/abis'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { coingeckoMappings } from '@/constants'
import { TIndex } from '@/types'

type TUsePoolValueProps = { index: TIndex } & UseQueryOptions<
  { usd: number; value: number },
  unknown,
  { usd: number; value: number }
>

export const usePoolValue = ({
  index: poolIndex,
  ...props
}: TUsePoolValueProps) => {
  const { chain = defaultChain } = useNetwork()
  const { chainConfig } = useChainConfig()

  const publicClient = usePublicClient()

  return useQuery<
    { usd: number; value: number },
    unknown,
    { usd: number; value: number }
  >(
    ['pool-value', chain.id, poolIndex.ITOKEN_INDEX],
    async () => {
      const poolValue = { usd: 0, value: 0 }
      const tokenDetails = await publicClient.readContract({
        address: chainConfig.DAAContractAddress,
        abi: DAAAbi,
        functionName: 'getIndexTokenDetails',
        args: [BigInt(poolIndex.ITOKEN_INDEX)],
      })
      for (let index = 0; index < tokenDetails.length; index++) {
        const tokenDetail = tokenDetails[index]
        const [tokenBalance, tokenDecimal, tokenSymbol] = await Promise.all([
          publicClient.readContract({
            address: chainConfig.DAAContractAddress,
            abi: DAAAbi,
            functionName: 'tokenBalances',
            args: [BigInt(poolIndex.ITOKEN_INDEX), tokenDetail],
          }),
          publicClient.readContract({
            address: tokenDetail,
            abi: erc20ABI,
            functionName: 'decimals',
          }),
          publicClient.readContract({
            address: tokenDetail,
            abi: erc20ABI,
            functionName: 'symbol',
          }),
        ])
        const value = Number(formatUnits(tokenBalance, tokenDecimal))
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/index/coinGeckoPrice?ids=${
            coingeckoMappings[tokenSymbol as keyof typeof coingeckoMappings]
          }&vs_currencies=usd`
        )
        let tokenPriceUSD = 0
        if (res.ok) {
          const resJson = (await res.json()) as Record<string, { usd: number }>
          try {
            tokenPriceUSD =
              resJson[
                coingeckoMappings[tokenSymbol as keyof typeof coingeckoMappings]
              ].usd
          } catch (err) {
            console.error('error', err)
          }
        }
        if (value > 0) {
          poolValue.usd += value * tokenPriceUSD
          poolValue.value += value
        } else {
          poolValue.usd += value
        }
      }
      return poolValue
    },
    { ...props }
  )
}
