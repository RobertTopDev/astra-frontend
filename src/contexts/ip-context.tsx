// contexts/IpContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Loading from '@/app/loading'

interface IpContextProps {
  ip: string | null
  loading: boolean
}

const IpContext = createContext<IpContextProps>({ ip: null, loading: true })

export const useIp = () => useContext(IpContext)

export const IpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ip, setIp] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchIP = async () => {
      try {
        setLoading(true)
        if (pathname === '/access-denied') {
          setLoading(false)
          return
        }
        const response = await fetch('https://jsonip.com')
        const data = await response.json()
        const ip = data.ip
        const serverResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/checkip?clientIp=${ip}`
        )

        if (serverResponse.status > 400) {
          router.push('/access-denied')
        } else {
          setIp(ip)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching IP: ', err)
        setLoading(false)
      }
    }

    fetchIP()
  }, [pathname])

  return (
    <IpContext.Provider value={{ ip, loading }}>
      {loading ? <Loading /> : children}
    </IpContext.Provider>
  )
}
