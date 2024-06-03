'use client'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

type TUseCoingeckoPrice = { ids: string; addresses?: string } & UseQueryOptions<
  Record<string, { usd: number }>,
  unknown,
  number
>

export const useCoingeckoPrice = ({
  ids,
  addresses,
  ...props
}: TUseCoingeckoPrice) => {
  return useQuery<Record<string, { usd: number }>, unknown, number>(
    ['coingecko-price', ids, addresses ?? ''],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/index/coinGeckoPrice?ids=${ids}${
          addresses !== undefined ? '&addresses=' + addresses : ''
        }&vs_currencies=usd`
      )
      if (!res.ok) {
        console.error('error', res)
        return { [ids]: { usd: 0 } }
      }

      const resJson = await res.json()
      return resJson as Record<string, { usd: number }>
    },
    {
      select: (data) => {
        try {
          return Number(data[ids].usd)
        } catch (err) {
          return 0
        }
      },
      cacheTime: 1000 * 60 * 15, // 15 minutes)
      ...props,
    }
  )
}
