'use client'
import { Button, Dialog, DialogContent } from '@/components/shadcn'
import React, { createContext, useContext, useEffect, useState } from 'react'
import styles from './astra-transaction-indicator-provider.module.scss'
import clsx from 'clsx'
import { useNetwork } from 'wagmi'
import { AstraLink } from '@/components'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

type TAstraTransactionIndicatorProps = React.PropsWithChildren

type TContext = {
  transactionObj?: TTransactionObj
  setTransactionObj: (transactionObj: TTransactionObj) => void
}

const Store = createContext<TContext>({} as TContext)

const AstraTransactionIndicatorProvider = ({
  children,
}: TAstraTransactionIndicatorProps) => {
  const { chain } = useNetwork()
  const router = useRouter()
  const pathname = usePathname()
  const [transactionObj, setTransactionObj] = useState<TTransactionObj>()

  const onOpenChange = (open: boolean) => {
    if (transactionObj?.status === 'success' && transactionObj.transactionLink)
      router.push(transactionObj.transactionLink)
    if (transactionObj?.status === 'failed' && !open) {
      transactionObj.reset?.()
      setTransactionObj(undefined)
    }
    // if (transactionObj?.status === 'pending') return
    // if (!open) {
    //   const link = transactionObj?.transactionLink
    //   const status = transactionObj?.status
    //   if (status === 'success' && !!link) {
    //     router.push(link || '/')
    //   }
    //   setTransactionObj(undefined)
    // }
  }

  useEffect(() => {
    if (transactionObj !== undefined) {
      setTransactionObj(undefined)
    }
  }, [pathname])

  const getMessage = () => {
    if (transactionObj?.transactionAction) {
      if (typeof transactionObj?.transactionAction === 'string') {
        return transactionObj?.transactionAction
      } else {
        return transactionObj?.transactionAction.message
      }
    }
    return ''
  }

  return (
    <Store.Provider
      value={{
        transactionObj,
        setTransactionObj,
      }}
    >
      <>
        {children}
        <Dialog open={!!transactionObj} onOpenChange={onOpenChange}>
          <DialogContent
            className="w-80 md:w-80 py-16 rounded full bg-white text-black text-center justify-center items-center flex"
            // noClose={transactionObj?.status === 'pending'}
            noClose
          >
            {transactionObj?.status === 'loading' && (
              <div className="flex flex-col gap-12">
                <div className={clsx(styles['ellipse-content'])}>
                  <div className={clsx(styles['loading-spinner'])}></div>
                </div>
                <div className="flex flex-col gap-2">
                  {!transactionObj?.isApiCall && (
                    <p className="text-sm">Waiting For Confirmation</p>
                  )}
                  {transactionObj?.transactionAction ? (
                    <h2 className="font-medium break-all">{getMessage()}</h2>
                  ) : null}
                  <p className="text-sm">
                    {transactionObj.isApiCall
                      ? 'Executing Transaction'
                      : 'Confirm the Transaction in Your Wallet'}
                  </p>
                </div>
              </div>
            )}
            {transactionObj?.status === 'pending' && (
              <div className="flex flex-col gap-12">
                <div className={clsx(styles['ellipse-content'])}>
                  <div className={clsx(styles['loading-spinner'])}></div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">Waiting for Transaction to be mined</p>
                  {transactionObj?.transactionAction ? (
                    <h2 className="font-medium">{getMessage()}</h2>
                  ) : null}
                  <p className="text-sm">Please Wait</p>
                </div>
              </div>
            )}
            {transactionObj?.status === 'failed' && (
              <div className="flex flex-col gap-12 max-w-full">
                <div className="flex items-center justify-center">
                  <InfoCircledIcon className="w-20 h-20 text-destructive" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold">Transaction Failed</h2>
                  {transactionObj?.transactionAction ? (
                    <h2 className="font-medium break-words text-wrap">
                      {getMessage() || 'Something went wrong'}
                    </h2>
                  ) : null}
                  {transactionObj?.transactionHash ? (
                    <AstraLink
                      link={`${chain?.blockExplorers?.default.url}/tx/${transactionObj?.transactionHash}`}
                    >
                      View on Explorer
                    </AstraLink>
                  ) : null}
                  <p className="text-sm">Please try again or contact support</p>
                </div>
              </div>
            )}
            {transactionObj?.status === 'success' && (
              <div className="flex flex-col gap-12">
                <div className={clsx(styles['ellipse-content'], 'relative')}>
                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-32 h-32 border-8 border-astra-blue rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-20 h-20 border-4 border-astra-blue rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-astra-blue rounded-full" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold">Transaction Submitted</h2>
                  {transactionObj?.transactionHash && (
                    <AstraLink
                      link={`${chain?.blockExplorers?.default.url}/tx/${transactionObj?.transactionHash}`}
                    >
                      View on Explorer
                    </AstraLink>
                  )}
                  {transactionObj?.transactionAction ? (
                    <h2 className="font-medium">{getMessage()}</h2>
                  ) : null}
                  {transactionObj.status === 'success' &&
                  !!transactionObj.transactionLink ? (
                    <Link href={transactionObj.transactionLink || '/'}>
                      <Button variant="astra-blue">Continue</Button>
                    </Link>
                  ) : (
                    // <Link href='/portfolio'>
                    <Button onClick={() => setTransactionObj(undefined)}>
                      Continue
                    </Button>
                    // </Link>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    </Store.Provider>
  )
}

type TTransactionObj =
  | {
      isApiCall?: boolean
      transactionHash?: string
      transactionAction?: string | Error
      transactionLink?: string
      reset?: () => void
      status: 'loading' | 'pending' | 'success' | 'failed'
    }
  | undefined

export const useTransactionIndicator = (): TContext => useContext(Store)

export { AstraTransactionIndicatorProvider }
