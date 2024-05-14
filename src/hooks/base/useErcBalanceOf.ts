'use client'

import { UseContractReadConfig, erc20ABI, useContractRead } from 'wagmi'

type TUseBalanceOfProps = UseContractReadConfig<typeof erc20ABI, 'balanceOf'>

export const useErcBalanceOf = ({ ...props }: TUseBalanceOfProps) => {
  return useContractRead({
    ...props,
    abi: erc20ABI,
    functionName: 'balanceOf',
  })
}
