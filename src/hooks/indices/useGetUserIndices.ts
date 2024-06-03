'use client'
import { TIndex } from '@/types'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

type TUseGetUserIndicesProps = UseQueryOptions<
  { data: TIndex[] },
  unknown,
  TIndex[]
>

export const useGetUserIndices = ({ ...props }: TUseGetUserIndicesProps) => {
  const { address } = useAccount()
  return useQuery<{ data: TIndex[] }, unknown, TIndex[]>(
    ['userIndices', address],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${address}/indices`
      )

      if (!res.ok) {
        console.error('error', res)
        return { data: [] }
      }

      return (await res.json()) as { data: TIndex[] }
    },
    {
      ...props,
      enabled: !!address,
      select: (data) => data.data,
    }
  )
}
