'use client'
import { UseContractReadConfig, erc20ABI } from 'wagmi'
import { useChainConfig, useAllowance } from '..'

type TUseAstraAllowanceProps = UseContractReadConfig<
  typeof erc20ABI,
  'allowance'
>

export const useAstraAllowance = ({ ...props }: TUseAstraAllowanceProps) => {
  const { chainConfig } = useChainConfig()
  return useAllowance({
    address: chainConfig.AstraContractAddress,
    ...props,
  })
}
