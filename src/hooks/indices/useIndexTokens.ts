'use client'
import { TIndexComposition } from '@/types'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

type TUseIndexTokensProps = { indexAddress: string } & UseQueryOptions<
  { data: TIndexComposition[] },
  unknown,
  TIndexComposition[]
>

export const useIndexTokens = ({
  indexAddress,
  ...props
}: TUseIndexTokensProps) => {
  return useQuery<{ data: TIndexComposition[] }, unknown, TIndexComposition[]>(
    ['index-tokens', indexAddress],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/indices/tokens/${indexAddress}`
      )

      if (!res.ok) {
        console.error('error', res)
        return { data: [] }
      }

      return (await res.json()) as { data: TIndexComposition[] }
    },
    {
      ...props,
      enabled: !!indexAddress,
      select: (data) => data.data,
    }
  )
}
