'use client'

import { launchpadAbi } from '@/abis/launchpad-abi'
import { useTransactionIndicator } from '@/contexts'
import {
  UsePrepareContractWriteConfig,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { TransactionReceipt } from 'viem'
import { useEffect } from 'react'
import { finishLaunchpadForDB } from '@/util/finishLaunchpadForDB'

type Props = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
  launchpadId: string
} & UsePrepareContractWriteConfig<typeof launchpadAbi, 'withdrawBaseTokens'>

export const useFinishLaunchpad = ({
  onSuccessTx,
  onRevert,
  launchpadId,
  ...props
}: Props) => {
  const { setTransactionObj, transactionObj } = useTransactionIndicator()

  const {
    config,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...props,
    abi: launchpadAbi,
    functionName: 'withdrawBaseTokens',
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
        transactionAction: 'Withdraw Base Token',
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
    async function init() {
      if (txReceipt?.status === 'success') {
        const responseFromDB = await finishLaunchpadForDB(launchpadId)
        if (responseFromDB.ok) {
          setTransactionObj({
            ...transactionObj,
            status: 'success',
            transactionHash: txReceipt.transactionHash,
            transactionAction: 'Withdrew Base Token Successfully',
          })
          onSuccessTx?.(txReceipt)
        } else {
          setTransactionObj({
            ...transactionObj,
            status: 'failed',
            transactionHash: txReceipt?.transactionHash,
            transactionAction: 'Withdraw Base Token Failed',
          })
          onRevert?.(txReceipt)
        }
      } else if (txReceipt?.status === 'reverted') {
        setTransactionObj({
          ...transactionObj,
          status: 'failed',
          transactionHash: txReceipt?.transactionHash,
          transactionAction: 'Withdraw Base Token Failed',
        })
        onRevert?.(txReceipt)
      }
    }

    init()
  }, [txReceipt])

  return {
    withdrawBaseToken:
      props.enabled || props.enabled === undefined ? write : undefined,
    withdrawBaseTokenAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}
