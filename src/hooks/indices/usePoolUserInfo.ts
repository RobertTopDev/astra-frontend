'use client'
import { DAAAbi } from '@/abis'
import { useContractRead, UseContractReadConfig } from 'wagmi'
import { useChainConfig } from '..'

type TUsePoolUserInfoProps = UseContractReadConfig<
  typeof DAAAbi,
  'poolUserInfo'
>

export const usePoolUserInfo = ({ ...props }: TUsePoolUserInfoProps) => {
  const { chainConfig } = useChainConfig()

  return useContractRead({
    ...props,
    address: chainConfig.DAAContractAddress,
    abi: DAAAbi,
    functionName: 'poolUserInfo',
  })
}
