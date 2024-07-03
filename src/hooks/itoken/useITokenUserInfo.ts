'use client'
import { itokenStakingABI } from '@/abis'
import { chainConfig, defaultChain } from '@/config'
import {
  useNetwork,
  useAccount,
  useContractRead,
  UseContractReadConfig,
} from 'wagmi'

type TUseITokenUserInfoProps = UseContractReadConfig<
  typeof itokenStakingABI,
  'userInfo'
>

export const useITokenUserInfo = ({ ...props }: TUseITokenUserInfoProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()

  return useContractRead({
    address: chainConfig[chain!.id].iTokenStakingContractAddress,
    ...props,
    abi: itokenStakingABI,
    functionName: 'userInfo',
    args: [BigInt(0), address!],
    enabled: !!address && !!chain,
  })
}
