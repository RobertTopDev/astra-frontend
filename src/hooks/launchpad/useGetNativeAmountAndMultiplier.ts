'use client'

import { crosschainSaleManagerAbi } from '@/abis'
import { useChainConfig } from '..'
import { useContractRead } from 'wagmi'

type Props = {
  args: [`0x${string}`]
}

export const useGetNativeAmountAndMultiplier = ({ args }: Props) => {
  const { chainConfig } = useChainConfig()

  return useContractRead({
    address: chainConfig.CrosschainSaleManagerAddress,
    abi: crosschainSaleManagerAbi,
    functionName: 'getNativeAmountAndMultiplier',
    args,
  })
}
