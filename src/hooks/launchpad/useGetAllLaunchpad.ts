'use client'

import { TLaunchpadDetailInfo } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useGetAllLaunchpad = (
  status: string,
  getOption: { sort: string } = { sort: 'ID' }
) => {
  const { data, isLoading, error } = useQuery<
    { data: TLaunchpadDetailInfo[] },
    unknown,
    TLaunchpadDetailInfo[]
  >(
    ['launchpads', { status, getOption }],
    // ['launchpads', { status }],

    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/launchpads/list?status=${status}&sort=${getOption.sort}`
        // `${process.env.NEXT_PUBLIC_API_URL}/launchpads/list?status=${status}`
      )

      if (!res.ok) {
        console.error('error', res)
        throw new Error('Network response was not ok')
      }

      return (await res.json()) as { data: TLaunchpadDetailInfo[] }
    },
    {
      select: (data) => data?.data,
    }
  )

  return {
    data,
    isLoading,
    isError: error ? true : false,
    error,
  }
}
