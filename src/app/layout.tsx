'use client'

import { AstraRouterBack, Footer, Navbar } from '@/components'
import '@rainbow-me/rainbowkit/styles.css'
import clsx from 'clsx'
// import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Providers } from './providers'
import Loading from './loading'
import localFont from 'next/font/local'
// import ClientIPFetcher from '@/components/ClientIPFetcher'
import { usePathname } from 'next/navigation'
// import { IpProvider } from '@/contexts/ip-context'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'ASTRA DAO',
//   description: 'ASTRA DAO Website for staking and launchpads',
// }

const novaFont = localFont({
  display: 'swap',
  variable: '--font-nova',
  src: [
    {
      path: '../../public/fonts/FontsFree-Net-FontsFree-Net-Proxima-Nova-1.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/FontsFree-Net-ProximaNovaThinItalic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/FontsFree-Net-FontsFree-Net-Proxima-Nova-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/FontsFree-Net-ProximaNovaBoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <html lang="en">
      <body
        className={clsx(inter.className, novaFont.className, 'font-primary')}
      >
        <Suspense>
          <Providers>
            {/* <IpProvider> */}
            <Navbar />
            <Suspense fallback={<Loading />}>
              <div className="bg-gradient mt-32 relative">
                <AstraRouterBack></AstraRouterBack>
                {/* <ClientIPFetcher /> */}
                {children}
              </div>
            </Suspense>
            {pathname !== '/access-denied' && <Footer />}
            {/* </IpProvider> */}
          </Providers>
        </Suspense>
      </body>
    </html>
  )
}
