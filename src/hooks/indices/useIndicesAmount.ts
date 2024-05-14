'use client'
import { indicesPaymentAbi } from '@/abis'
import { defaultChain, chainConfig } from '@/config'
import { useNetwork, useContractRead, useAccount } from 'wagmi'

export const useIndicesAmount = () => {
  const { chain = defaultChain } = useNetwork()
  const config = chainConfig[chain!.id]
  const { address } = useAccount()

  const {
    data: depositedAmount,
    isLoading: depositedAmountLoading,
    refetch: refetchDepositedAmount,
  } = useContractRead({
    address: config.IndicesPaymentContractAddress,
    abi: indicesPaymentAbi,
    functionName: 'depositedAmount',
    enabled: !!chain && !!chain.id && !!address,
    args: [address!],
  })
  const {
    data: utilisedAmount,
    isLoading: utilisedAmountLoading,
    refetch: refetchUtilisedAmount,
  } = useContractRead({
    address: config.IndicesPaymentContractAddress,
    abi: indicesPaymentAbi,
    functionName: 'amountUtilised',
    enabled: !!chain && !!chain.id && !!address,
    args: [address!],
  })

  return {
    depositedAmount,
    utilisedAmount,
    refetchDepositedAmount,
    refetchUtilisedAmount,
    isLoading: depositedAmountLoading || utilisedAmountLoading,
  }
}
