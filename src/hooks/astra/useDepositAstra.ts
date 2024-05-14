'use client'
import { indicesPaymentAbi } from '@/abis'
import { useTransactionIndicator } from '@/contexts'
import { useEffect } from 'react'
import { TransactionReceipt } from 'viem'
import {
  UsePrepareContractWriteConfig,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'

type TUseDepositAstraProps = {
  onSuccessTx?: (data: TransactionReceipt) => Promise<void> | void
  onRevert?: (data: TransactionReceipt) => void
} & UsePrepareContractWriteConfig<typeof indicesPaymentAbi, 'deposit'>

export const useDepositAstra = ({
  onSuccessTx,
  onRevert,
  ...props
}: TUseDepositAstraProps) => {
  const { setTransactionObj, transactionObj } = useTransactionIndicator()
  const {
    config,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...props,
    abi: indicesPaymentAbi,
    functionName: 'deposit',
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
        transactionAction: 'Depositing Astra DAO',
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
    depositAstra:
      props.enabled || props.enabled === undefined ? write : undefined,
    depositAstraAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}
