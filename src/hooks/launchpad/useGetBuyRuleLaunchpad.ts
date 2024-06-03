'use client'

import { useAccount, useContractReads } from 'wagmi'
import { useChainConfig } from '..'
import { astraDaoWhitelistAbi } from '@/abis/astradao-whitelist-abi'

export const useGetBuyRuleLaunchpad = () => {
  const { address } = useAccount()
  const { chainConfig } = useChainConfig()

  return useContractReads({
    contracts: [
      {
        address: chainConfig.AstraDAOWhitelistAddress,
        abi: astraDaoWhitelistAbi,
        functionName: 'isWhitelisted',
        args: [address as `0x${string}`],
      },
    ],
    enabled: !!address,
  })
}
