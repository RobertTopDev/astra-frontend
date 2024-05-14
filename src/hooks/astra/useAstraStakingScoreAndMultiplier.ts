'use client'
import { chefAbi } from '@/abis/chef-abi'
import { defaultChain, chainConfig } from '@/config'
import { UseContractReadConfig, useNetwork, useContractRead } from 'wagmi'

type TUseAstraStakingScoreAndMultiplierProps = UseContractReadConfig<
  typeof chefAbi,
  'stakingScoreAndMultiplier'
>

export const useAstraStakingScoreAndMultiplier = ({
  ...props
}: TUseAstraStakingScoreAndMultiplierProps) => {
  const { chain = defaultChain } = useNetwork()

  return useContractRead({
    ...props,
    address: chainConfig[chain!.id].ChefContractAddress,
    abi: chefAbi,
    functionName: 'stakingScoreAndMultiplier',
  })
}
