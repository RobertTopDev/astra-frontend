import { useQuery } from '@tanstack/react-query'

export const useGetContributorListForDB = (address: string) => {
  const { data, isLoading, error } = useQuery<any, Error>(
    ['contributorList', address],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/launchpads/contributorList?launchpadAddress=${address}`
      )

      if (!res.ok) {
        console.error('Error fetching launchpad detail', res)
        throw new Error('Failed to fetch launchpad detail')
      }

      const response = await res.json()

      return response.data
    }
  )

  return {
    data,
    isLoading,
    isError: error ? true : false,
    error,
  }
}
