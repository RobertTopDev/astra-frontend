'use client'
import { itokenStakingABI } from '@/abis'
import { defaultChain, chainConfig } from '@/config'
import {
  UseContractReadConfig,
  useNetwork,
  useAccount,
  useContractRead,
} from 'wagmi'

type TUseITokenUserStakeInfoProps = UseContractReadConfig<
  typeof itokenStakingABI,
  'userStakeInfo'
>

export const useITokenUserStakeInfo = ({
  ...props
}: TUseITokenUserStakeInfoProps) => {
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
