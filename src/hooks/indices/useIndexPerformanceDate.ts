'use client'
import { TIndex } from '@/types'
import { useQuery } from '@tanstack/react-query'

type TUseIndexPerformanceDateProps = {
  index: TIndex
}

export const useIndexPerformanceDate = ({
  index,
}: TUseIndexPerformanceDateProps) => {
  return useQuery<
    { data: { min: string; max: string } },
    unknown,
    { min: string; max: string }
  >(
    ['index-date', index.ITOKEN_ADDR],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/indices/performance/${index.ITOKEN_ADDR}/dates`
      )
      if (!res.ok) {
        console.error('error', res)
        return { data: { min: '', max: '' } }
      }
      const data = await res.json()
      return data as { data: { min: string; max: string } }
      // return (await res.json()) as { data: { min: string; max: string } }
    },
    {
      enabled: !!index?.ITOKEN_ADDR,
      initialData: () => ({
        data: { min: '', max: '' },
      }),
      select: (data) => data.data,
      // 5mins
      cacheTime: 1000 * 60 * 14,
    }
  )
}
