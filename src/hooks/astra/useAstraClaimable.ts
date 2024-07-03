'use client'
import { chainConfig, defaultChain } from '@/config'
import {
  useNetwork,
  useAccount,
  useContractRead,
  UseContractReadConfig,
} from 'wagmi'
import { chefAbi } from '@/abis/chef-abi'

type TUserClaimableAstraProps = UseContractReadConfig<
  typeof chefAbi,
  'pendingAstra'
>

export const useAstraClaimable = ({ ...props }: TUserClaimableAstraProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()

  return useContractRead({
    address: chainConfig[chain!.id].ChefContractAddress,
    abi: chefAbi,
    ...props,
    functionName: 'pendingAstra',
    args: [address!],
    enabled: !!address,
  })
}
