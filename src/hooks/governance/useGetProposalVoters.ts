'use client'
import { defaultChain } from '@/config'
import { TProposalVoters } from '@/types'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { useNetwork } from 'wagmi'

type TUseGetProposalVotersProps = { proposalId: string } & UseQueryOptions<
  { data: TProposalVoters[] },
  unknown,
  TProposalVoters[]
>

export const useGetProposalVoters = ({
  proposalId,
  ...props
}: TUseGetProposalVotersProps) => {
  const { chain = defaultChain } = useNetwork()
  return useQuery<{ data: TProposalVoters[] }, unknown, TProposalVoters[]>(
    ['proposal-voters', proposalId, chain.id],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/proposals/getVoters/${proposalId}`
      )
      if (!res.ok) {
        console.error('error', res)
        return { data: [] }
      }

      return (await res.json()) as { data: TProposalVoters[] }
    },
    {
      ...props,
      select: (data) => {
        return data.data
      },
    }
  )
}
