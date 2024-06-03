'use client'
import { UseContractReadConfig, erc20ABI, useContractRead } from 'wagmi'

type TUseAllowanceProps = UseContractReadConfig<typeof erc20ABI, 'allowance'>

export const useAllowance = ({ ...props }: TUseAllowanceProps) => {
  return useContractRead({
    ...props,
    abi: erc20ABI,
    functionName: 'allowance',
    // enabled: !!chain && !!chain.id && !!address && !!spender,
    // args: !!spender ? [address!, spender] : undefined,
  })
}
