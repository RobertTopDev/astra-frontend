'use client'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

type TUseAstraUSDPriceProps = UseQueryOptions<{ data: number }, unknown, number>

export const useAstraUSDPrice = ({ ...props }: TUseAstraUSDPriceProps) => {
  return useQuery<{ data: number }, unknown, number>(
    ['astra-price'],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tokens/astra/price`
      )
      if (!res.ok) {
        console.error('error', res)
        return { data: 0 }
      }

      return (await res.json()) as { data: number }
    },
    {
      select: (data) => Number(data.data),
      cacheTime: 1000 * 60 * 15, // 15 minutes)
      ...props,
    }
  )
}
