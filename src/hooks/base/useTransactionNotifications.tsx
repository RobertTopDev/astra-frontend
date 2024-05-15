'use client'
import { AstraLink } from '@/components'
import { useToast, useToastTransaction } from '@/components/shadcn'
import { useTransactionIndicator } from '@/contexts'
import { useEffect, useState } from 'react'
import {
  useNetwork,
  useWaitForTransaction,
  useWatchPendingTransactions,
} from 'wagmi'

// TODO: FIGURE OUT HOW TO IMPLEMENT TRANSACTION WATCHER USING WEB3Provider
export const useTransactionWatcher = () => {
  const { transactionObj } = useTransactionIndicator()
  const { chain } = useNetwork()
  const [txHashes, setTxHashes] = useState<string[]>([])
  const {
    toast: toastTransaction,
    dismiss,
    toasts: toastsTransaction,
  } = useToastTransaction()
  const { toast } = useToast()

  useWatchPendingTransactions({
    listener: (hashes) => {
      toastsTransaction.forEach((toast) => {
        if (!hashes.includes(toast.id as `0x${string}`)) {
          dismiss(toast.id)
        }
      })
      setTxHashes(hashes)
    },
    enabled: !!chain && chain?.unsupported,
  })

  const { data, isError, isLoading } = useWaitForTransaction({
    hash: txHashes[0] as `${0}xstring`,
    enabled:
      !!txHashes &&
      !!txHashes[0] &&
      transactionObj?.transactionHash !== txHashes[0],
  })

  useEffect(() => {
    if (isLoading) {
      toastTransaction({
        id: txHashes[0],
        title: 'Pending transaction',
        description: 'Your transaction is pending',
      })
    } else if (isError) {
      dismiss(txHashes[0])
      toast({
        title: 'Transaction failed',
        description: 'Your transaction failed',
      })
      setTxHashes((prev) => prev.slice(1))
    } else if (data) {
      dismiss(txHashes[0])
      toast({
        title: 'Transaction confirmed',
        description: (
          <AstraLink
            link={`${chain?.blockExplorers?.default.url}/tx/${data.transactionHash}`}
          >
            View on block explorer
          </AstraLink>
        ),
      })
      setTxHashes((prev) => prev.slice(1))
    }
  }, [isLoading, isError, data, transactionObj])
}
