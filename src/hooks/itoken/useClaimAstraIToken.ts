'use client'
import { useTransactionIndicator } from '@/contexts'
import { useEffect } from 'react'
import { TransactionReceipt } from 'viem'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  UsePrepareContractWriteConfig,
  useAccount,
} from 'wagmi'
import { useChainConfig } from '..'
import { itokenStakingABI } from '@/abis'

type TUseClaimAstraITokenProps = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
} & UsePrepareContractWriteConfig<typeof itokenStakingABI, 'claimAstra'>

export const useClaimAstraItoken = ({
  onSuccessTx,
  onRevert,
  ...props
}: TUseClaimAstraITokenProps) => {
  const { setTransactionObj, transactionObj } = useTransactionIndicator()
  const { chainConfig } = useChainConfig()
  const { address } = useAccount()
  const {
    config,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...props,
    address: chainConfig.iTokenStakingContractAddress,
    abi: itokenStakingABI,
    functionName: 'claimAstra',
    enabled: !!address,
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
        transactionAction: 'Claiming Astra',
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
    claimAstraIToken:
      props.enabled || props.enabled === undefined ? write : undefined,
    claimAstraITokenAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}

// const test = useApprove({ address: '0x123', args: ['0x123', '0x123'] })
