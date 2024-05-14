'use client'
import { itokenStakingABI } from '@/abis'
import { defaultChain, chainConfig } from '@/config'
import {
  UseContractReadConfig,
  useNetwork,
  useAccount,
  useContractRead,
} from 'wagmi'

type TUseITokenMultiplierDecimalProps = UseContractReadConfig<
  typeof itokenStakingABI,
  'MULTIPLIER_DECIMAL'
>

export const useITokenMultiplierDecimal = ({
  ...props
}: TUseITokenMultiplierDecimalProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()

  return useContractRead({
    ...props,
    address: chainConfig[chain!.id].iTokenStakingContractAddress,
    abi: itokenStakingABI,
    functionName: 'MULTIPLIER_DECIMAL',
    enabled: !!address && !!chain,
  })
}
