'use client'

import { useAccount, useContractReads } from 'wagmi'
import { launchpadAbi, crosschainSaleManagerAbi } from '@/abis'
import { useChainConfig } from '..'

type Props = {
  launchpad: `0x${string}`
}

export const useLaunchpadInfo = ({ ...props }: Props) => {
  const { address } = useAccount()
  const { chainConfig } = useChainConfig()

  const launchpadContract = {
    address: props.launchpad,
    abi: launchpadAbi,
  } as const
  const crosschainSaleManagerContract = {
    address: chainConfig.CrosschainSaleManagerAddress,
    abi: crosschainSaleManagerAbi,
  }

  return useContractReads({
    contracts: [
      {
        ...launchpadContract,
        functionName: 'claimedAmount',
        args: [address as `0x${string}`],
      },
      {
        ...launchpadContract,
        functionName: 'getTier',
        args: [address as `0x${string}`],
      },
      {
        ...launchpadContract,
        functionName: 'calculatePurchaseLimit',
        args: [address as `0x${string}`],
      },
      {
        ...launchpadContract,
        functionName: 'tokenPrice',
      },
      {
        ...launchpadContract,
        functionName: 'saleStartTime',
      },
      {
        ...launchpadContract,
        functionName: 'saleEndTime',
      },
      {
        ...launchpadContract,
        functionName: 'totalContributionsCount',
      },
      {
        ...launchpadContract,
        functionName: 'totalTokensSold',
      },
      {
        ...launchpadContract,
        functionName: 'claimedAmount',
        args: [address as `0x${string}`],
      },
      {
        ...crosschainSaleManagerContract,
        functionName: 'getWeightedAverageMultiplier',
        args: [address as `0x${string}`],
      },
    ],
    enabled: !!props.launchpad,
  })
}
