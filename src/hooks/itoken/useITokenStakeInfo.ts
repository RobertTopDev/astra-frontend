'use client'
import { itokenStakingABI } from '@/abis'
import { defaultChain, chainConfig } from '@/config'
import {
  UseContractReadConfig,
  useNetwork,
  useAccount,
  useContractRead,
} from 'wagmi'

type TUseITokenStakeInfoProps = UseContractReadConfig<
  typeof itokenStakingABI,
  'userStakeInfo'
>

export const useITokenStakeInfo = ({ ...props }: TUseITokenStakeInfoProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()

  return useContractRead({
    ...props,
    address: chainConfig[chain!.id].iTokenStakingContractAddress,
    abi: itokenStakingABI,
    functionName: 'userStakeInfo',
    enabled: !!address && !!chain && props.enabled,
  })
}
