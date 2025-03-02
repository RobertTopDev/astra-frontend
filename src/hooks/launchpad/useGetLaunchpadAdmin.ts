'use client'

import { useContractReads } from 'wagmi'
import { useChainConfig } from '..'
import { launchpadFactoryAbi } from '@/abis'

export const useGetLaunchpadAdmin = () => {
  const { chainConfig } = useChainConfig()

  return useContractReads({
    contracts: [
      {
        address: chainConfig.LaunchpadFactoryContractAddress,
        abi: launchpadFactoryAbi,
        functionName: 'owner',
      },
    ],
  })
}
