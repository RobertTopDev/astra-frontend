'use client'
import { chefAbi } from '@/abis/chef-abi'
import { useTransactionIndicator } from '@/contexts'
import { useEffect } from 'react'
import { TransactionReceipt } from 'viem'
import {
  UsePrepareContractWriteConfig,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useChainConfig } from '..'

type TUseWithdrawAstraProps = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
  isCooldown?: boolean
} & UsePrepareContractWriteConfig<typeof chefAbi, 'withdraw'>

export const useWithdrawAstra = ({
  onSuccessTx,
  onRevert,
  isCooldown = false,
  ...props
}: TUseWithdrawAstraProps) => {
  const { chainConfig } = useChainConfig()
  const { setTransactionObj, transactionObj } = useTransactionIndicator()
  const {
    config,
    refetch: refetchConfig,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...props,
    address: chainConfig.ChefContractAddress,
    abi: chefAbi,
    functionName: 'withdraw',
  })
  const {
    data: writeData,
    write,
    writeAsync,
    error: writeError,
    isLoading: writeLoading,
    reset,
  } = useContractWrite({
    ...config,
    onMutate: (variables) => {
      let transactionAction = ''
      if (!isCooldown) {
        transactionAction = 'Activating Cooldown'
      } else {
        if (variables.request?.args[0])
          transactionAction = 'Re Staking Astra DAO'
        else transactionAction = 'Withdrawing Astra DAO'
      }
      setTransactionObj({
        status: 'loading',
        reset,
        transactionAction,
      })
    },
    onError: (error) => {
      setTransactionObj({
        ...transactionObj,
        status: 'failed',
        transactionAction: error,
      })
    },
    onSuccess: (data) => {
      setTransactionObj({
        ...transactionObj,
        status: 'pending',
        transactionHash: data.hash,
      })
    },
  })
  const {
    data: txReceipt,
    isLoading: txLoading,
    error: txError,
  } = useWaitForTransaction({
    hash: writeData?.hash,
  })
  useEffect(() => {
    if (txReceipt?.status === 'success') {
      setTransactionObj({
        ...transactionObj,
        status: 'success',
        transactionHash: txReceipt.transactionHash,
      })
      refetchConfig()
      onSuccessTx?.(txReceipt)
    } else if (txReceipt?.status === 'reverted') {
      setTransactionObj({
        ...transactionObj,
        status: 'failed',
        transactionHash: txReceipt?.transactionHash,
      })
      onRevert?.(txReceipt)
    }
  }, [txReceipt])

  return {
    withdrawAstra:
      props.enabled || props.enabled === undefined ? write : undefined,
    withdrawAstraAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}
