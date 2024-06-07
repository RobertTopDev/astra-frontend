'use client'

import { useChainConfig } from '..'
import { useTransactionIndicator } from '@/contexts'
import {
  UsePrepareContractWriteConfig,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { TransactionReceipt, parseEther } from 'viem'
import { useEffect } from 'react'
import { crosschainSaleManagerAbi } from '@/abis'

type Props = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
  gasFee: string
} & UsePrepareContractWriteConfig<
  typeof crosschainSaleManagerAbi,
  'verifyMultiplierCrossChain'
>

export const useVerifyMultiplierCrosschain = ({
  onSuccessTx,
  onRevert,
  gasFee,
  ...props
}: Props) => {
  const { chainConfig } = useChainConfig()
  const { setTransactionObj, transactionObj } = useTransactionIndicator()

  const {
    config,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...props,
    address: chainConfig.CrosschainSaleManagerAddress,
    abi: crosschainSaleManagerAbi,
    functionName: 'verifyMultiplierCrossChain',
    // value: BigInt(Number(gasFee)),
    value: parseEther('0.001'),
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
        transactionAction: 'Verifying Multiplier CrossChain',
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
        transactionAction: 'Verified Multiplier CrossChain Successfully',
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
    verifyMultiplierCrosschain:
      props.enabled || props.enabled === undefined ? write : undefined,
    verifyMultiplierCrosschainAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}
