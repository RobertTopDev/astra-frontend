'use client'
import { TTransaction } from '@/types'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

type TUseTransactionsProps = UseQueryOptions<
  { data: TTransaction[] },
  unknown,
  TTransaction[]
>

export const useTransactions = ({ ...props }: TUseTransactionsProps) => {
  const { address: userAddress } = useAccount()
  return useQuery<{ data: TTransaction[] }, unknown, TTransaction[]>(
    ['transactions', userAddress],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/${userAddress}`
      )
      if (!res.ok) {
        console.error('error', res)
        return []
      }

      return res.json()
    },
    {
      enabled: !!userAddress,
      select: (data) => data?.data,
      ...props,
    }
  )
}
