import { useQuery } from '@tanstack/react-query'
import { TToken } from '@/types'

export const useAssetsTokenDetail = (tokenAddr: string) => {
  return useQuery<TToken, Error>(
    ['token-detail', tokenAddr],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tokens/detail/${tokenAddr}`,
        {
          method: 'GET', // Assuming GET is the method to fetch token details
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!res.ok) {
        console.error('error', res)
        throw new Error('Failed to fetch data')
      }

      const jsonResponse = await res.json()
      // Assuming the response structure is { data: TokenDetail }
      return jsonResponse.data as TToken
    },
    {
      // Optional: Add any configurations here, such as cacheTime, staleTime, etc.
      enabled: !!tokenAddr, // Only run the query if the tokenAddr is truthy
    }
  )
}
