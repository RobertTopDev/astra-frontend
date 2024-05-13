'use client'
import { TIndexCompositionWithAsset, TToken } from '@/types'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

type TUseAllTokensProps = UseQueryOptions<
  { data: TIndexCompositionWithAsset[] },
  unknown,
  TIndexCompositionWithAsset[]
>

const useAllTokens = ({}: TUseAllTokensProps) => {
  return useQuery<{ data: TToken[] }, unknown, TToken[]>(
    ['all-tokens'],
    async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tokens/all`)
      if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        console.error('error', res)
        return { data: [] }
      }

      return res.json() as Promise<{ data: TToken[] }>
    },
    {
      select: (data) => data.data,
    }
  )
}

export { useAllTokens }
