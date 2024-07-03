'use client'
import { DAOAbi } from '@/abis'
import { useContractRead, UseContractReadConfig } from 'wagmi'
import { useChainConfig } from '..'

type TUseProposalStateProps = UseContractReadConfig<typeof DAOAbi, 'state'>

export const useProposalState = ({ ...props }: TUseProposalStateProps) => {
  const { chainConfig } = useChainConfig()

  return useContractRead({
    ...props,
    address: chainConfig.DAOContractAddress,
    abi: DAOAbi,
    functionName: 'state',
  })
}
