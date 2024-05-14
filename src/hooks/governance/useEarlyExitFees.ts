'use client'
import { UseContractReadConfig, useContractRead } from 'wagmi'
import { useChainConfig } from '..'
import { DAAConfigABI } from '@/abis'

type TUseEarlyExitFeesProps = UseContractReadConfig<
  typeof DAAConfigABI,
  'earlyexitfees'
>

export const useEarlyExitFees = ({ ...props }: TUseEarlyExitFeesProps) => {
  const { chainConfig } = useChainConfig()
  return useContractRead({
    address: chainConfig.PoolConfigurationContractAddress,
    ...props,
    abi: DAAConfigABI,
    functionName: 'earlyexitfees',
  })
}
