'use client'

import { TLaunchpadDetailInfo } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useGetParticipatedLaunchpad = (
  wallet: `0x${string}` | undefined
) => {
  const { data, isLoading, error, refetch } = useQuery<
    { data: TLaunchpadDetailInfo[] },
    unknown,
    TLaunchpadDetailInfo[]
  >(
    ['launchpads', { wallet }],
    async () => {
      const query = `${process.env.NEXT_PUBLIC_API_URL}/launchpads/participatedList?wallet=${wallet}`
      const res = await fetch(query)

      if (!res.ok) {
        console.error('Error on useGetAllLaunchpad: ', res)
        throw new Error('Network response was not ok')
      }

      return (await res.json()) as { data: TLaunchpadDetailInfo[] }
    },
    {
      select: (data) => data?.data,
    }
  )
  const refetchData = async () => {
    await refetch()
  }
  return {
    data,
    isLoading,
    isError: error ? true : false,
    error,
    refetchData,
  }
}
