'use client'
import { itokenStakingABI } from '@/abis'
import { defaultChain, chainConfig } from '@/config'
import {
  UseContractReadConfig,
  useNetwork,
  useAccount,
  useContractRead,
} from 'wagmi'

type TUseITokenInfoProps = UseContractReadConfig<
  typeof itokenStakingABI,
  'itokenInfo'
>

export const useITokenInfo = ({ ...props }: TUseITokenInfoProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()

  return useContractRead({
    ...props,
    address: chainConfig[chain!.id].iTokenStakingContractAddress,
    abi: itokenStakingABI,
    functionName: 'itokenInfo',
    enabled: !!address && !!chain && props.enabled,
  })
}
