'use client'
import { DAAAbi } from '@/abis'
import { useTransactionIndicator } from '@/contexts'
import { useEffect } from 'react'
import { TransactionReceipt } from 'viem'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  UsePrepareContractWriteConfig,
} from 'wagmi'
import { useChainConfig } from '..'

type TUsePoolInProps = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
} & UsePrepareContractWriteConfig<typeof DAAAbi, 'buyPendingPoolBalance'>

export const useBuyPendingBalance = ({
  onSuccessTx,
  onRevert,
  ...props
}: TUsePoolInProps) => {
  const { setTransactionObj, transactionObj } = useTransactionIndicator()
  const { chainConfig } = useChainConfig()
  const {
    config,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...props,
    address: chainConfig.DAAContractAddress,
    abi: DAAAbi,
    functionName: 'buyPendingPoolBalance',
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
    onMutate: () => {
      setTransactionObj({
        status: 'loading',
        reset,
        transactionAction: 'Buying pending pool balance',
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
        transactionAction: 'Bought pending pool balance',
      })
      onSuccessTx?.(txReceipt)
    } else if (txReceipt?.status === 'reverted') {
      setTransactionObj({
        ...transactionObj,
        status: 'failed',
        transactionHash: txReceipt?.transactionHash,
        transactionAction: 'Failed to buy pending pool balance',
      })
      onRevert?.(txReceipt)
    }
  }, [txReceipt])

  return {
    buyPendingBal:
      props.enabled || props.enabled === undefined ? write : undefined,
    buyPendingBalAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}
