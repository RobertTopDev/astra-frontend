'use client'
import { chefAbi } from '@/abis/chef-abi'
import { defaultChain, chainConfig } from '@/config'
import {
  UseContractReadConfig,
  useNetwork,
  useAccount,
  useContractRead,
} from 'wagmi'

type TUseAstraMultiplierDecimalProps = UseContractReadConfig<
  typeof chefAbi,
  'MULTIPLIER_DECIMAL'
>

export const useAstraMultiplierDecimal = ({
  ...props
}: TUseAstraMultiplierDecimalProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()

  return useContractRead({
    ...props,
    address: chainConfig[chain!.id].ChefContractAddress,
    abi: chefAbi,
    functionName: 'MULTIPLIER_DECIMAL',
    enabled: !!address && !!chain,
  })
}
