'use client'

import { crosschainSaleManagerAbi } from '@/abis'
import { useChainConfig } from '..'
import { useContractRead } from 'wagmi'

type Props = {
  args: [`0x${string}`, string]
}

export const useGetCrossChainStakingDetails = ({ args }: Props) => {
  const { chainConfig } = useChainConfig()

  return useContractRead({
    address: chainConfig.CrosschainSaleManagerAddress,
    abi: crosschainSaleManagerAbi,
    functionName: 'getCrossChainStakingDetails',
    args,
  })
}
