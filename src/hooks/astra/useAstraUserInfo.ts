'use client'
import { chefAbi } from '@/abis/chef-abi'
import { chainConfig, defaultChain } from '@/config'
import {
  useNetwork,
  useAccount,
  useContractRead,
  UseContractReadConfig,
} from 'wagmi'

type TUseAstraUserInfoProps = UseContractReadConfig<typeof chefAbi, 'userInfo'>

export const useAstraUserInfo = ({ ...props }: TUseAstraUserInfoProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()

  return useContractRead({
    address: chainConfig[chain!.id].ChefContractAddress,
    ...props,
    abi: chefAbi,
    functionName: 'userInfo',
    args: [BigInt(0), address!],
    enabled: !!address && !!chain,
  })
}
