'use client'
import { UseContractReadConfig, erc20ABI } from 'wagmi'
import { useChainConfig } from '..'
import { useAllowance } from '../base/useAllowance'

type TUseITokenAllowanceProps = UseContractReadConfig<
  typeof erc20ABI,
  'allowance'
>

export const useITokenAllowance = ({ ...props }: TUseITokenAllowanceProps) => {
  const { chainConfig } = useChainConfig()
  return useAllowance({
    address: chainConfig.iTokenStakingContractAddress,
    ...props,
  })
}
