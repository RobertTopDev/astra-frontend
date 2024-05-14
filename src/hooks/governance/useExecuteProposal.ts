'use client'
import { DAOAbi } from '@/abis'
import { useTransactionIndicator } from '@/contexts'
import { useEffect } from 'react'
import { TransactionReceipt } from 'viem'
import {
  UsePrepareContractWriteConfig,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useChainConfig } from '..'

type TUseExecuteProposalProps = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
} & UsePrepareContractWriteConfig<typeof DAOAbi, 'execute'>

export const useExecuteProposal = ({
  onSuccessTx,
  onRevert,
  ...props
}: TUseExecuteProposalProps) => {
  const { chainConfig } = useChainConfig()
  const { setTransactionObj, transactionObj } = useTransactionIndicator()
  const {
    config,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...props,
    address: chainConfig.DAOContractAddress,
    abi: DAOAbi,
    functionName: 'execute',
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
        transactionAction: 'Executing Proposal',
      })
    },
    onSuccess: (data) => {
      setTransactionObj({
        ...transactionObj,
        status: 'pending',
        transactionHash: data.hash,
      })
    },
    onError: (error) => {
      setTransactionObj({
        ...transactionObj,
        status: 'failed',
      })
      console.error({ error })
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
      onSuccessTx?.(txReceipt)
      setTransactionObj({
        ...transactionObj,
        status: 'success',
        transactionHash: txReceipt.transactionHash,
      })
    } else if (txReceipt?.status === 'reverted') {
      onRevert?.(txReceipt)
      setTransactionObj({
        ...transactionObj,
        status: 'failed',
        transactionHash: txReceipt?.transactionHash,
      })
    }
  }, [txReceipt])

  return {
    executeProposal:
      props.enabled || props.enabled === undefined ? write : undefined,
    executeProposalAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}
