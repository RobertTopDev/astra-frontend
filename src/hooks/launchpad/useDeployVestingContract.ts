'use client'

import { useTransactionIndicator } from '@/contexts'
import {
  useAccount,
  useNetwork,
  useWaitForTransaction,
  useWalletClient,
} from 'wagmi'
import { TransactionReceipt } from 'viem'
import { useEffect, useState } from 'react'
import { launchpadVestingAbi, launchpadVestingBytecode } from '@/abis'

type Props = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
  enabled: boolean
  args: [
    `0x${string}`,
    `0x${string}`,
    bigint,
    `0x${string}`,
    [bigint, bigint, bigint, bigint, bigint],
  ]
}

export const useDeployVestingContract = ({
  onSuccessTx,
  onRevert,
  enabled,
  args,
}: Props) => {
  const { address } = useAccount()
  const { chain: networkChain } = useNetwork()
  const { data: walletClient } = useWalletClient({ chainId: networkChain?.id })
  const { setTransactionObj, transactionObj } = useTransactionIndicator()
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const deployVestingContract = async () => {
    try {
      setIsLoading(true)
      setTransactionObj({
        status: 'loading',
        transactionAction: 'Deploying Vesting Contract',
      })
      const deployHash = await walletClient?.deployContract({
        abi: launchpadVestingAbi,
        account: address,
        bytecode: launchpadVestingBytecode,
        args: args,
      })
      setHash(deployHash)
      setIsLoading(false)
    } catch (err) {
      console.error('Error while deploying vesting smart contract: ', err)
      setTransactionObj({
        status: 'failed',
        transactionAction: 'Deploying Vesting Contract Failed',
      })
      setIsLoading(false)
    }
  }

  const {
    data: txReceipt,
    isLoading: txLoading,
    error: txError,
  } = useWaitForTransaction({
    hash: hash,
  })

  useEffect(() => {
    async function init() {
      if (txReceipt?.status === 'success') {
        setTransactionObj({
          ...transactionObj,
          status: 'success',
          transactionHash: txReceipt.transactionHash,
          transactionAction: 'Deployed Vesting Contract',
        })
        onSuccessTx?.(txReceipt)
      } else if (txReceipt?.status === 'reverted') {
        setTransactionObj({
          ...transactionObj,
          status: 'failed',
          transactionHash: txReceipt?.transactionHash,
          transactionAction: 'Deploying Vesting Contract Failed',
        })
        onRevert?.(txReceipt)
      }
    }

    init()
  }, [txReceipt])

  return {
    deployVestingContract:
      enabled || enabled === undefined ? deployVestingContract : undefined,
    isLoading: isLoading || txLoading,
  }
}
