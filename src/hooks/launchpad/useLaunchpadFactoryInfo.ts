'use client'

import { launchpadFactoryAbi } from '@/abis'
import { useChainConfig } from '..'
import { useContractRead } from 'wagmi'

type Props = {
  lIndex: string
}

export const useLaunchpadFactoryInfo = ({ lIndex }: Props) => {
  const { chainConfig } = useChainConfig()

  return useContractRead({
    address: chainConfig.LaunchpadFactoryContractAddress,
    abi: launchpadFactoryAbi,
    functionName: 'requests',
    args: [BigInt(lIndex)],
  })
}
