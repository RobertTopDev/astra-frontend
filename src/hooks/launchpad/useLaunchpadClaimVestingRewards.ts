'use client'

import { useTransactionIndicator } from '@/contexts'
import { useEffect } from 'react'
import { TransactionReceipt } from 'viem'
import {
  UsePrepareContractWriteConfig,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { launchpadVestingAbi } from '@/abis'

type TUseClaimVestingRewardsProps = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
  isCooldown?: boolean
} & UsePrepareContractWriteConfig<typeof launchpadVestingAbi, 'release'>

export const useLaunchpadClaimVestingRewards = ({
  onSuccessTx,
  onRevert,
  ...props
}: TUseClaimVestingRewardsProps) => {
  const { setTransactionObj, transactionObj } = useTransactionIndicator()
  const {
    config,
    refetch: refetchConfig,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...props,
    abi: launchpadVestingAbi,
    functionName: 'release',
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
      const transactionAction = 'Claiming Vesting Rewards'
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
      const transactionAction = 'Claimed Vesting Rewards'
      setTransactionObj({
        ...transactionObj,
        status: 'success',
        transactionHash: txReceipt.transactionHash,
        transactionAction,
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
    claimVestingRewards:
      props.enabled || props.enabled === undefined ? write : undefined,
    claimVestingRewardsAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
    refetch: refetchConfig,
  }
}
