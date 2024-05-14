'use client'

import { useQuery } from '@tanstack/react-query'

export const usePendingBalance = (itokenAddr: string | undefined) => {
  const { data, isLoading, error } = useQuery<
    { POOLPENDINGBALANCE: string },
    Error
  >(['itokenPendingBalance', itokenAddr], async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/itokens/pendingBalance?itokenAddr=${itokenAddr}`
    )
    if (!res.ok) {
      console.error('Error fetching the itoken pending balance', res)
      throw new Error('Failed to fetch itoken pending balance')
    }

    const response = await res.json() // Only call res.json() once

    if (!itokenAddr) return response.data[0] as { POOLPENDINGBALANCE: string }
    else if (response.data && response.data.length > 0) {
      return response.data[0] as { POOLPENDINGBALANCE: string } // Return the first item
    } else {
      throw new Error('No pending balance data found')
    }
  })

  return {
    data,
    isLoading,
    isError: error ? true : false,
    error,
  }
}
