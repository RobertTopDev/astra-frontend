'use client'
import { useTransactionIndicator } from '@/contexts'
import { useEffect } from 'react'
import { TransactionReceipt } from 'viem'
import {
  usePrepareContractWrite,
  erc20ABI,
  useContractWrite,
  useWaitForTransaction,
  UsePrepareContractWriteConfig,
} from 'wagmi'

type TUseApproveProps = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
  spender?: `0x${string}`
  minAmount: number | bigint
} & UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>

export const useApprove = ({
  onSuccessTx,
  onRevert,
  args,
  spender,
  minAmount,
  ...props
}: TUseApproveProps) => {
  const { setTransactionObj, transactionObj } = useTransactionIndicator()
  const spndr = args !== undefined ? args[0] : spender
  const {
    config,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...props,
    args: !!spndr ? [spndr, BigInt(minAmount)] : undefined,
    abi: erc20ABI,
    functionName: 'approve',
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
        transactionAction: 'Approving Token',
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
    approve: props.enabled || props.enabled === undefined ? write : undefined,
    approveAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}

// const test = useApprove({ address: '0x123', args: ['0x123', '0x123'] })
