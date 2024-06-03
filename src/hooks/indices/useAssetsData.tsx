'use client'
import { erc20ABI, usePublicClient, useAccount } from 'wagmi'
import {
  useChainConfig,
  useIndexTokens,
  usePoolTotalBalance,
  usePoolUserInfo,
  useStableCoin,
} from '..'
import { TIndex, TIndexCompositionWithAsset } from '@/types'
import { DAAAbi } from '@/abis'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'

type TUseAssetsDataProps = { index?: TIndex } & UseQueryOptions<
  TIndexCompositionWithAsset[],
  unknown,
  TIndexCompositionWithAsset[]
>

const useAssetsData = ({ index }: TUseAssetsDataProps) => {
  const { chainConfig } = useChainConfig()
  const { address } = useAccount()

  const { data: tokensIndices, isLoading: indexTokensLoading } = useIndexTokens(
    {
      indexAddress: index !== undefined ? index?.ITOKEN_ADDR : '',
      enabled: index !== undefined,
    }
  )

  const publicClient = usePublicClient()

  const { data: stableCoin } = useStableCoin()

  const { data: poolTotalBalance } = usePoolTotalBalance({
    args: index !== undefined ? [BigInt(index.ITOKEN_INDEX)] : undefined,
  })

  const { data: poolUserInfo } = usePoolUserInfo({
    args:
      address !== undefined && index !== undefined
        ? [BigInt(index.ITOKEN_INDEX), address]
        : undefined,
    enabled: !!address && !!index,
  })

  return useQuery<
    TIndexCompositionWithAsset[],
    unknown,
    TIndexCompositionWithAsset[]
  >(
    ['tokens-assets-data', index?.ITOKEN_INDEX],
    async () => {
      const assetsData: TIndexCompositionWithAsset[] = []
      if (tokensIndices === undefined || index === undefined) return []
      for (let i = 0; i < tokensIndices.length; i++) {
        try {
          const token = tokensIndices[i]

          const [name, decimals, balance] = await Promise.all([
            publicClient.readContract({
              address: token.TOKEN_CONTRACT_ADDR,
              abi: erc20ABI,
              functionName: 'name',
            }),
            publicClient.readContract({
              address: token.TOKEN_CONTRACT_ADDR,
              abi: erc20ABI,
              functionName: 'decimals',
            }),
            publicClient.readContract({
              address: chainConfig.DAAContractAddress,
              abi: DAAAbi,
              functionName: 'tokenBalances',
              args: [BigInt(index.ITOKEN_INDEX), token.TOKEN_CONTRACT_ADDR],
            }),
          ])

          const userPoolBalance =
            poolUserInfo !== undefined &&
            stableCoin !== undefined &&
            poolTotalBalance !== undefined &&
            poolTotalBalance > 0
              ? Number(
                  formatUnits(
                    poolUserInfo[0] / poolTotalBalance,
                    stableCoin.decimals
                  )
                ) / 100
              : 0
          assetsData.push({
            ...tokensIndices[i],
            name,
            decimals,
            tokenBalance: formatUnits(balance, decimals),
            holdings: Number(formatUnits(balance, decimals)) * userPoolBalance,
            tokenPrice: 0,
          })
        } catch (err) {
          console.error(err)
          assetsData.push({
            ...tokensIndices[i],
          })
        }
      }
      return assetsData
    },
    {
      enabled:
        stableCoin !== undefined &&
        // poolUserInfo !== undefined &&
        poolTotalBalance !== undefined &&
        tokensIndices !== undefined &&
        index !== undefined &&
        !indexTokensLoading,
    }
  )
}

export { useAssetsData }
