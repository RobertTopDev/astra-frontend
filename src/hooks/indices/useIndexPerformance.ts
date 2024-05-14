'use client'
import { TIndex, TIndexPerformance } from '@/types'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

type TUseIndexPerformance = {
  index: TIndex
  chartOptions: {
    max?: number
    min?: number
    type: string
  }
}

export const useIndexPerformance = ({
  index,
  chartOptions: { max, min, type },
  ...props
}: TUseIndexPerformance &
  UseQueryOptions<
    { data: Record<string, TIndexPerformance> },
    unknown,
    TIndexPerformance[]
  >) => {
  return useQuery<
    { data: Record<string, TIndexPerformance> },
    unknown,
    TIndexPerformance[]
  >(
    ['index', index?.ITOKEN_ADDR, max, min, type],
    async () => {
      const query = new URLSearchParams({
        type,
      })
      if (max) query.set('max', String(new Date(max).getTime()))
      if (min) query.set('max', String(new Date(min).getTime()))
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/indices/performance/${index.ITOKEN_ADDR}?` +
          query
      )
      if (!res.ok) {
        console.error('error', res)
        return { data: {} }
      }

      return (await res.json()) as { data: Record<string, TIndexPerformance> }
    },
    {
      enabled: !!index?.ITOKEN_ADDR,
      keepPreviousData: true,
      select: (data) => (data.data ? Object.values(data.data) : []),
      ...props,
    }
  )
}
