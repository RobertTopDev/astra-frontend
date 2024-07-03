'use client'
import { useContractRead, useToken } from 'wagmi'
import { useChainConfig } from '..'
import { DAAAbi } from '@/abis'

export const useStableCoin = () => {
  const { chainConfig } = useChainConfig()
  const { data: baseStableCoin } = useContractRead({
    address: chainConfig.DAAContractAddress,
    abi: DAAAbi,
    functionName: 'baseStableCoin',
  })

  return useToken({
    address: baseStableCoin,
    enabled: !!baseStableCoin,
  })
}
