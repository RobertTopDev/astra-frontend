'use client'

import { TLaunchpadListInfo } from '@/types'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

type TUseLaunchpadsProps = UseQueryOptions<
  { data: TLaunchpadListInfo[] },
  unknown,
  TLaunchpadListInfo[]
>

export const useGetUpcomingLaunchpad = ({ ...props }: TUseLaunchpadsProps) => {
  return useQuery<
    { data: TLaunchpadListInfo[] },
    unknown,
    TLaunchpadListInfo[]
  >(
    [],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/launchpads/upcomingList`
      )
      if (!res.ok) {
        console.error('error', res)
        return { data: [] }
      }

      return (await res.json()) as { data: TLaunchpadListInfo[] }
    },
    {
      select: (data) => data?.data,
      ...props,
    }
  )
}
