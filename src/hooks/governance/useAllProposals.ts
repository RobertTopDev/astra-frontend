'use client'
import { DAOAbi } from '@/abis'
import { TProposal } from '@/types'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { readContract } from 'wagmi/actions'
import { useChainConfig } from '..'

type TUseAllProposalsProps = {
  limit?: number
} & UseQueryOptions<TProposal[] | undefined, unknown, TProposal[]>

export const useAllProposals = ({
  limit = 0,
  ...props
}: TUseAllProposalsProps) => {
  const { chainConfig, chain } = useChainConfig()

  return useQuery<TProposal[] | undefined, unknown, TProposal[]>(
    ['proposals', chain?.id, limit],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/proposals?limit=${limit}`
      )
      if (!res.ok) {
        console.error('error', res)
        return undefined
      }

      const result = (await res.json()) as { data: TProposal[] }
      const proposals = result.data

      await Promise.all(
        proposals.map(async (proposal) => {
          try {
            const status = await readContract({
              address: chainConfig.DAOContractAddress,
              abi: DAOAbi,
              functionName: 'state',
              args: [BigInt(proposal.ID)] as const,
            })
            return { ...proposal, status }
          } catch (err) {
            console.error({ err })
            return proposal
          }
        })
      )
      return proposals
    },
    {
      ...props,
      enabled: !!chain && !!chain.id,
      cacheTime: 0,
    }
  )
}
