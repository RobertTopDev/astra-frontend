'use client'

import { launchpadFactoryAbi } from '@/abis/launchpad-factory-abi'
import { useChainConfig } from '..'
import { useTransactionIndicator } from '@/contexts'
import {
  UsePrepareContractWriteConfig,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { TransactionReceipt, decodeEventLog } from 'viem'
import { useEffect } from 'react'
import { approveLaunchpadForDB } from '@/util/approveLaunchpadForDB'

type Props = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
} & UsePrepareContractWriteConfig<
  typeof launchpadFactoryAbi,
  'approveLaunchpadRequest'
>

export const useApproveLaunchpad = ({
  onSuccessTx,
  onRevert,
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
    address: chainConfig.LaunchpadFactoryContractAddress,
    abi: launchpadFactoryAbi,
    functionName: 'approveLaunchpadRequest',
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
        transactionAction: 'Approving Launchpad Request',
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
      if (txReceipt?.status === 'success' && props.args) {
        let data
        if (txReceipt.logs.length > 6) {
          data = txReceipt.logs[6].data
        } else data = txReceipt.logs[4].data
        const decodedEvent = decodeEventLog({
          abi: launchpadFactoryAbi,
          data: data,
          topics: [
            '0x517c092e9fcfa43f741c15936e5d584fc52f351b8a86131817ee1ec1558439ed',
          ],
          eventName: 'LaunchpadRequestApproved',
        })
        const launchpadAddress = decodedEvent.args?.launchpadAddress
        const approveData = {
          approveTx: txReceipt.transactionHash,
          launchpadIndex: Number(props.args[0]),
          launchpadAddress: launchpadAddress,
        }
        const responseFromDB = await approveLaunchpadForDB(approveData)
        if (responseFromDB.ok) {
          setTransactionObj({
            ...transactionObj,
            status: 'success',
            transactionHash: txReceipt.transactionHash,
            transactionAction: 'Approved Launchpad Request',
          })
          onSuccessTx?.(txReceipt)
        } else {
          setTransactionObj({
            ...transactionObj,
            status: 'failed',
            transactionHash: txReceipt?.transactionHash,
            transactionAction: 'Approving Launchpad Request failed',
          })
          onRevert?.(txReceipt)
        }
      } else if (txReceipt?.status === 'reverted') {
        setTransactionObj({
          ...transactionObj,
          status: 'failed',
          transactionHash: txReceipt?.transactionHash,
          transactionAction: 'Approving Launchpad Request failed',
        })
        onRevert?.(txReceipt)
      }
    }

    init()
  }, [txReceipt])

  return {
    approveLaunchpad:
      props.enabled || props.enabled === undefined ? write : undefined,
    approveLaunchpadAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}
