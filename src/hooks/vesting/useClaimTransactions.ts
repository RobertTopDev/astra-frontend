'use client'
import { TClaimTransaction } from '@/types'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

type TUseClaimTransactionsProps = UseQueryOptions<
  {
    data: {
      categories: Record<string, string>
      transactions: TClaimTransaction[]
    }
  },
  unknown,
  {
    categories: Record<string, string>
    transactions: TClaimTransaction[]
  }
>

const useClaimTransactions = ({}: TUseClaimTransactionsProps) => {
  const { address } = useAccount()

  return useQuery<
    {
      data: {
        categories: Record<string, string>
        transactions: TClaimTransaction[]
      }
    },
    unknown,
    {
      categories: Record<string, string>
      transactions: TClaimTransaction[]
    }
  >(
    ['claim-transactions', address],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/claim/${address}`
      )
      if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        console.error('error', res)
        return { data: { categories: {}, transactions: [] } }
      }

      return res.json() as Promise<{
        data: {
          categories: Record<string, string>
          transactions: TClaimTransaction[]
        }
      }>
    },
    {
      enabled: !!address,
      select: (data) => data.data,
    }
  )
}

export { useClaimTransactions }
