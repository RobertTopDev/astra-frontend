'use client'
import { UseContractReadConfig, erc20ABI, useContractRead } from 'wagmi'
import { useChainConfig } from '..'

type TUseBalanceOfProps = UseContractReadConfig<typeof erc20ABI, 'balanceOf'>

export const useBalanceOf = ({ ...props }: TUseBalanceOfProps) => {
  const { chainConfig } = useChainConfig()
  return useContractRead({
    address: chainConfig.AstraContractAddress,
    ...props,
    abi: erc20ABI,
    functionName: 'balanceOf',
  })
}
