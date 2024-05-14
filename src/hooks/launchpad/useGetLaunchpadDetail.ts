import { TLaunchpadDetailInfo } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useGetLaunchpadDetail = (launchpadIndex: string) => {
  const { data, isLoading, error } = useQuery<TLaunchpadDetailInfo, Error>(
    ['launchpadDetail', launchpadIndex],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/launchpads/detail?index=${launchpadIndex}`
      )

      if (!res.ok) {
        console.error('Error fetching launchpad detail', res)
        throw new Error('Failed to fetch launchpad detail')
      }

      const response = await res.json()

      return response.data[0]
    }
  )

  return {
    data,
    isLoading,
    isError: error ? true : false,
    error,
  }
}
