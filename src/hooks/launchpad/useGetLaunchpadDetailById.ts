import { TLaunchpadDetailInfo } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useGetLaunchpadDetailById = (launchpadId: string) => {
  const { data, isLoading, error, refetch } = useQuery<TLaunchpadDetailInfo, Error>(
    ['launchpadDetail', launchpadId],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/launchpads/detailById?id=${launchpadId}`
      )

      if (!res.ok) {
        console.error('Error fetching launchpad detail', res)
        throw new Error('Failed to fetch launchpad detail')
      }

      const response = await res.json()

      return response.data[0]
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
