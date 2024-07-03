'use client'
import { chefAbi } from '@/abis/chef-abi'
import { UseContractReadConfig, useContractRead } from 'wagmi'
import { useChainConfig } from '..'

type TUseAstraViewEligibleAmountProps = UseContractReadConfig<
  typeof chefAbi,
  'viewEligibleAmount'
>

export const useAstraViewEligibleAmount = ({
  ...props
}: TUseAstraViewEligibleAmountProps) => {
  const { chainConfig } = useChainConfig()
  return useContractRead({
    ...props,
    address: chainConfig.ChefContractAddress,
    abi: chefAbi,
    functionName: 'viewEligibleAmount',
  })
}
