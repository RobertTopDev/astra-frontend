'use client'
import { DAAAbi } from '@/abis'
import { useContractRead, UseContractReadConfig } from 'wagmi'
import { useChainConfig } from '..'

type TUsePoolInfoProps = UseContractReadConfig<typeof DAAAbi, 'poolInfo'>

export const usePoolInfo = ({ ...props }: TUsePoolInfoProps) => {
  const { chainConfig } = useChainConfig()

  return useContractRead({
    ...props,
    address: chainConfig.DAAContractAddress,
    abi: DAAAbi,
    functionName: 'poolInfo',
  })
}
