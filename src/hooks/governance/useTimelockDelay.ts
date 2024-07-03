'use client'
import { DAOAbi } from '@/abis'
import { useContractRead, UseContractReadConfig } from 'wagmi'
import { useChainConfig } from '..'

type TUseTimelockDelayProps = UseContractReadConfig<typeof DAOAbi, 'proposals'>

export const useProposalsDetail = ({ ...props }: TUseTimelockDelayProps) => {
  const { chainConfig } = useChainConfig()

  return useContractRead({
    ...props,
    address: chainConfig.DAOContractAddress,
    abi: DAOAbi,
    functionName: 'proposals',
  })
}
