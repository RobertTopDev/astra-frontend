'use client'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import React, { PropsWithChildren } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { Button } from '../shadcn'

type TAstraButtonAuthenticatedProps = PropsWithChildren

const AstraButtonAuthenticated = ({
  children,
}: TAstraButtonAuthenticatedProps) => {
  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()

  const { isConnected, isConnecting } = useAccount()
  const { chain } = useNetwork()

  if (isConnecting) {
    return (
      <Button variant="astra-destructive" onClick={openConnectModal}>
        Connecting...
      </Button>
    )
  }
  if (!!chain && chain.unsupported) {
    return (
      <Button variant="astra-destructive" onClick={openChainModal}>
        Wrong Network
      </Button>
    )
  } else if (isConnected) {
    return <>{children}</>
  } else {
    return (
      <Button variant="astra-destructive" onClick={openConnectModal}>
        Connect Wallet
      </Button>
    )
  }
}

export { AstraButtonAuthenticated }
