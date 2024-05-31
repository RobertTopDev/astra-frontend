'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const ClientIPFetcher: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch('https://jsonip.com')
        const data = await response.json()
        const ip = data.ip
        const serverResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/checkip?clientIp=${ip}`
        )

        if (serverResponse.status > 400) router.push('/error')
      } catch (err) {
        console.error('Error fetching IP: ', err)
      }
    }

    fetchIP();
  }, [pathname])

  return null
}

export default ClientIPFetcher
