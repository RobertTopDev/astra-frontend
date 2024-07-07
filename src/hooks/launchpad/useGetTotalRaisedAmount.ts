'use client'

import { UseQueryOptions, useQuery } from '@tanstack/react-query'

type TUseGetTotalRaisedAmount = {
  rpcUrl: string
  launchpadAddress: string
} & UseQueryOptions<{ data: string }, unknown, string>

export const useGetTotalRaisedAmount = ({
  rpcUrl,
  launchpadAddress,
}: TUseGetTotalRaisedAmount) => {
  return useQuery<{ data: string }, unknown, string>(
    ['totalRaisedAmount', rpcUrl, launchpadAddress],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/launchpads/getTotalAmountRaised/`,
        {
          method: 'POST',
          body: JSON.stringify({ rpcUrl, launchpadAddress }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!res.ok) {
        console.error('error', res)
        return { data: '0' }
      }

      return (await res.json()) as { data: string }
    },
    {
      enabled: launchpadAddress !== '' && rpcUrl !== '',
      select: (data) => data.data,
    }
  )
}
