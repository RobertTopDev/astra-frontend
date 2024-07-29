'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { useState, useEffect } from 'react'
import { ThemeProvider } from '@/components'
import { wagmiConfig, chains } from '@/lib/wagmi'
import { AstraProvider, AstraTransactionIndicatorProvider } from '@/contexts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster, ToasterTransaction } from '@/components/shadcn'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false)

  const queryClient = new QueryClient()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        modalSize="compact"
        theme={darkTheme({
          borderRadius: 'large',
        })}
        chains={chains}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryClientProvider client={queryClient}>
            <AstraTransactionIndicatorProvider>
              <AstraProvider>{mounted && children}</AstraProvider>
            </AstraTransactionIndicatorProvider>
            <Toaster />
            <ToasterTransaction />
          </QueryClientProvider>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
