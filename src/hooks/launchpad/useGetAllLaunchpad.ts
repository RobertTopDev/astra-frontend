'use client'

import { TLaunchpadDetailInfo } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useGetAllLaunchpad = (
  status: string,
  getOption: {
    sort: string
    filter: string
    chain: string
    search: string
    type: string
  } = {
    sort: 'SALE_START_TIME',
    filter: 'None',
    chain: 'None',
    search: '',
    type: 'all',
  },
  page: number = -1,
  wallet?: `0x${string}` | undefined
) => {
  const { data, isLoading, error, refetch } = useQuery<
    { data: TLaunchpadDetailInfo[] },
    unknown,
    TLaunchpadDetailInfo[]
  >(
    ['launchpads', { status, getOption }],
    async () => {
      let query = ''
      if (status === 'user')
        query = `${process.env.NEXT_PUBLIC_API_URL}/launchpads/participatedList?wallet=${wallet}`
      else {
        query = `${process.env.NEXT_PUBLIC_API_URL}/launchpads/list?page=${page}&status=${status}&sort=${getOption.sort}&wallet=${wallet}`
        if (getOption.filter !== 'None')
          query = query + `&filter=${getOption.filter}`
        if (getOption.chain !== 'None')
          query = query + `&chain=${getOption.chain}`
        if (getOption.search !== '')
          query = query + `&search=${getOption.search}`
        if (getOption.type !== 'all') query = query + `&type=${getOption.type}`
      }

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
