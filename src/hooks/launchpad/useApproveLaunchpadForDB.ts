'use client'
import { useQuery } from '@tanstack/react-query'

export const useApproveLaunchpadForDB = (launchpadIndex: string) => {
  return useQuery<{ data: boolean }, unknown, boolean>(
    [],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/launchpads/approve/${launchpadIndex}`
      )
      if (!res.ok) {
        console.error('Error on useApproveLaunchpadForDB: ', res)
        return []
      }

      return res.json()
    },
    {
      select: (data) => data?.data,
    }
  )
}
