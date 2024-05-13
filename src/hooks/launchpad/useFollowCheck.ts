'use client'

import { TFollowingStatus } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useFollowCheck = (
  address?: `0x${string}` | undefined
) => {
  const { data, isLoading, error, refetch } = useQuery<
    { data: TFollowingStatus[] },
    unknown,
    TFollowingStatus[]
  >(
    [],
    async () => {
      const  query = `${process.env.NEXT_PUBLIC_API_URL}/launchpads/follow/check?address=${address}`
      const res = await fetch(query)

      if (!res.ok) {
        console.error('Error on useGetAllLaunchpad: ', res)
        throw new Error('Network response was not ok')
      }

      return (await res.json()) as { data: TFollowingStatus[] }
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
