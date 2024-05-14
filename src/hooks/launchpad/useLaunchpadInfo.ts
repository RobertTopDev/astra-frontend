'use client'

import { useAccount, useContractReads } from 'wagmi'
import {
  launchpadAbi,
  crosschainSaleManagerAbi,
  launchpadConfigurationAbi,
} from '@/abis'
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
  const launchpadConfigurationContract = {
    address: chainConfig.LaunchpadConfigurationAddress,
    abi: launchpadConfigurationAbi,
  }

  return useContractReads({
    contracts: [
      {
        ...launchpadContract,
        functionName: 'claimedTokens',
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
        functionName: 'totalAmountRaised',
      },
      {
        ...crosschainSaleManagerContract,
        functionName: 'getWeightedAverageMultiplier',
        args: [address as `0x${string}`],
      },
      {
        ...launchpadContract,
        functionName: 'vesting',
      },
      {
        ...launchpadContract,
        functionName: 'investedAmounts',
        args: [address as `0x${string}`],
      },
      {
        ...launchpadConfigurationContract,
        functionName: 'COMPLETION_FEE',
      },
    ],
  })
}
