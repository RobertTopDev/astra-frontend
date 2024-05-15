'use client'
import { chainConfig, defaultChain } from '@/config'
import { useNetwork } from 'wagmi'

export const useChainConfig = () => {
  const { chain = defaultChain } = useNetwork()

  const { chain: networkChain } = useNetwork()

  if (networkChain?.unsupported) {
    return { chainConfig: chainConfig[defaultChain.id], chain: defaultChain }
  }

  return { chainConfig: chainConfig[chain.id], chain }
}
