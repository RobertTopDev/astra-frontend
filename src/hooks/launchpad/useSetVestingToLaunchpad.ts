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
import { TransactionReceipt } from 'viem'
import { useEffect } from 'react'
import { setVestAddressForDB } from '@/util/setVestAddressForDB'

type Props = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
} & UsePrepareContractWriteConfig<
  typeof launchpadFactoryAbi,
  'setVestingContract'
>

export const useSetVestingToLaunchpad = ({
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
    functionName: 'setVestingContract',
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
        transactionAction: 'Configurating Vesting Address',
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
      if (
        txReceipt?.status === 'success' &&
        props.args &&
        props.args.length > 0
      ) {
        const updateData = {
          launchpadAddress: props.args[0],
          vestAddress: props.args[1],
        }
        const responseFromDB = await setVestAddressForDB(updateData)
        if (responseFromDB.ok) {
          setTransactionObj({
            ...transactionObj,
            status: 'success',
            transactionHash: txReceipt.transactionHash,
            transactionAction: 'Configured Vesting Address Successfully',
          })
          onSuccessTx?.(txReceipt)
        } else {
          setTransactionObj({
            ...transactionObj,
            status: 'failed',
            transactionHash: txReceipt?.transactionHash,
            transactionAction: 'Configuring Vesting Address failed',
          })
          onRevert?.(txReceipt)
        }
      } else if (txReceipt?.status === 'reverted') {
        setTransactionObj({
          ...transactionObj,
          status: 'failed',
          transactionHash: txReceipt?.transactionHash,
          transactionAction: 'Configuring Vesting Address failed',
        })
        onRevert?.(txReceipt)
      }
    }

    init()
  }, [txReceipt])

  return {
    configureVestAddress:
      props.enabled || props.enabled === undefined ? write : undefined,
    setVestAddressAsync:
      props.enabled || props.enabled === undefined ? writeAsync : undefined,
    error: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}
