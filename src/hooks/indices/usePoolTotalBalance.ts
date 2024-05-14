'use client'
import { DAAAbi } from '@/abis'
import { useContractRead, UseContractReadConfig } from 'wagmi'
import { useChainConfig } from '..'

type TUseTotalPoolBalanceProps = UseContractReadConfig<
  typeof DAAAbi,
  'totalPoolbalance'
>

export const usePoolTotalBalance = ({
  ...props
}: TUseTotalPoolBalanceProps) => {
  const { chainConfig } = useChainConfig()

  return useContractRead({
    ...props,
    address: chainConfig.DAAContractAddress,
    abi: DAAAbi,
    functionName: 'totalPoolbalance',
  })
}
