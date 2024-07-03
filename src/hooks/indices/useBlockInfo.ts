'use client'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { Chain, GetBlockReturnType } from 'viem'
import { usePublicClient } from 'wagmi'

type TUseBlockInfoProps = { blockNumber: string } & UseQueryOptions<
  GetBlockReturnType<Chain, false, 'latest'>,
  unknown
>

export const useBlockInfo = ({ blockNumber, ...props }: TUseBlockInfoProps) => {
  const publicClient = usePublicClient()
  return useQuery<GetBlockReturnType<Chain, false, 'latest'>, unknown>(
    ['block-info', blockNumber],
    async () => {
      return publicClient.getBlock({ blockNumber: BigInt(blockNumber) })
    },
    props
  )
}
