'use client'
import { itokenStakingABI } from '@/abis'
import { defaultChain, chainConfig } from '@/config'
import {
  useNetwork,
  useAccount,
  useContractRead,
  UseContractReadConfig,
} from 'wagmi'

type TUseITokenAverageStakeTimeProps = UseContractReadConfig<
  typeof itokenStakingABI,
  'averageStakedTime'
>

export const useITokenAverageStakeTime = ({
  ...props
}: TUseITokenAverageStakeTimeProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()

  return useContractRead({
    ...props,
    address: chainConfig[chain!.id].iTokenStakingContractAddress,
    abi: itokenStakingABI,
    functionName: 'averageStakedTime',
    args: [BigInt(0), address!],
    enabled: !!address && !!chain,
  })
}
