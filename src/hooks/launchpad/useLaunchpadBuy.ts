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
import { addContributorForDB } from '@/util/addContributorForDB'

type Props = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
  databaseData: any
  value: any
} & UsePrepareContractWriteConfig<typeof launchpadAbi, 'purchaseTokens'>

export const useLaunchpadBuy = ({
  onSuccessTx,
  onRevert,
  databaseData,
  value,
  ...props
}: Props) => {
  const { setTransactionObj, transactionObj } = useTransactionIndicator()

  const prepareContractWriteProps = value
    ? {
        ...props,
        abi: launchpadAbi,
        value: value,
      }
    : {
        ...props,
        abi: launchpadAbi,
      }

  const {
    config,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...prepareContractWriteProps,
    functionName: 'purchaseTokens',
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
        transactionAction: 'Buying Launchpad Token',
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
        // update contributor database
        const dbData = {
          ...databaseData,
          contributeTransaction: txReceipt.transactionHash,
        }
        const responseFromDB = await addContributorForDB(dbData)
        if (responseFromDB.ok) {
          setTransactionObj({
            ...transactionObj,
            status: 'success',
            transactionHash: txReceipt.transactionHash,
            transactionAction: 'Bought Token Successfully',
          })
          onSuccessTx?.(txReceipt)
        } else {
          setTransactionObj({
            ...transactionObj,
            status: 'failed',
            transactionHash: txReceipt?.transactionHash,
            transactionAction: 'Buying Token Failed',
          })
          onRevert?.(txReceipt)
        }
      } else if (txReceipt?.status === 'reverted') {
        setTransactionObj({
          ...transactionObj,
          status: 'failed',
          transactionHash: txReceipt?.transactionHash,
          transactionAction: 'Buying Token Failed',
        })
        onRevert?.(txReceipt)
      }
    }

    init()
  }, [txReceipt])

  return {
    buyToken: props.enabled || props.enabled === undefined ? write : undefined,
    buyTokenAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}
