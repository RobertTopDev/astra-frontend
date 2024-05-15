'use client'
import { useChainConfig, useDecimals } from '..'

export const useAstraDecimal = () => {
  const { chainConfig } = useChainConfig()
  return useDecimals({
    address: chainConfig.AstraContractAddress,
  })
}
