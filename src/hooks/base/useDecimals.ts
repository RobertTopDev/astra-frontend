'use client'
import { useContractRead, erc20ABI, UseContractReadConfig } from 'wagmi'

type TUseDecimalsProps = UseContractReadConfig<typeof erc20ABI, 'decimals'>

export const useDecimals = ({ ...props }: TUseDecimalsProps) => {
  return useContractRead({
    cacheTime: 1_000 * 60 * 15,
    ...props,
    abi: erc20ABI,
    functionName: 'decimals',
  })
}
