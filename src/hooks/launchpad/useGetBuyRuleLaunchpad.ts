'use client'

import { useAccount, useContractReads } from 'wagmi'
import { useChainConfig } from '..'
import { astraDaoWhitelistAbi, chefAbi } from '@/abis'

export const useGetBuyRuleLaunchpad = () => {
  const { address } = useAccount()
  const { chainConfig } = useChainConfig()

  return useContractReads({
    contracts: [
      {
        address: chainConfig.AstraDAOWhitelistAddress,
        abi: astraDaoWhitelistAbi,
        functionName: 'isWhitelisted',
        args: [address!],
      },
      {
        address: chainConfig.ChefContractAddress,
        abi: chefAbi,
        functionName: 'userInfo',
        args: [BigInt(0), address!],
      },
    ],
  })
}
