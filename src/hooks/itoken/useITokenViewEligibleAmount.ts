'use client'
import { UseContractReadConfig, useAccount, useContractRead } from 'wagmi'
import { itokenStakingABI } from '@/abis'

type TUseITokenViewEligibleAmountProps = UseContractReadConfig<
  typeof itokenStakingABI,
  'viewEligibleAmount'
>

export const useITokenViewEligibleAmount = ({
  ...props
}: TUseITokenViewEligibleAmountProps) => {
  const { address } = useAccount()
  return useContractRead({
    ...props,
    abi: itokenStakingABI,
    functionName: 'viewEligibleAmount',
    args: address !== undefined ? [address] : undefined,
    enabled: !!address,
  })
}
