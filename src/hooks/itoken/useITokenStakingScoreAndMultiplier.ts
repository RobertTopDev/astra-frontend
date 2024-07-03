'use client'
import { itokenStakingABI } from '@/abis'
import { defaultChain, chainConfig } from '@/config'
import { UseContractReadConfig, useNetwork, useContractRead } from 'wagmi'

type TUseITokenStakingScoreAndMultiplierProps = UseContractReadConfig<
  typeof itokenStakingABI,
  'stakingScoreAndMultiplier'
>

export const useITokenStakingScoreAndMultiplier = ({
  ...props
}: TUseITokenStakingScoreAndMultiplierProps) => {
  const { chain = defaultChain } = useNetwork()

  return useContractRead({
    ...props,
    address: chainConfig[chain!.id].iTokenStakingContractAddress,
    abi: itokenStakingABI,
    functionName: 'stakingScoreAndMultiplier',
  })
}
