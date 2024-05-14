'use client'
import { chefAbi } from '@/abis/chef-abi'
import { defaultChain, chainConfig } from '@/config'
import {
  useNetwork,
  useAccount,
  useContractRead,
  UseContractReadConfig,
} from 'wagmi'

type TUseAstraAverageStakeTimeProps = UseContractReadConfig<
  typeof chefAbi,
  'averageStakedTime'
>

export const useAstraAverageStakeTime = ({
  ...props
}: TUseAstraAverageStakeTimeProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()

  return useContractRead({
    ...props,
    address: chainConfig[chain!.id].ChefContractAddress,
    abi: chefAbi,
    functionName: 'averageStakedTime',
    args: [BigInt(0), address!],
    enabled: !!address && !!chain,
  })
}
