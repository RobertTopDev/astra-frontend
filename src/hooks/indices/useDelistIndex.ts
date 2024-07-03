'use client'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { useTransactionIndicator } from '@/contexts'

type TUseMutationVariable = {
  indexId: string
  indexAddress: string
  date: string
}

type TUseDelistIndexProps = { onSuccessTx?: () => void } & UseMutationOptions<
  boolean,
  unknown,
  TUseMutationVariable
>

export const useDelistIndex = ({
  onSuccessTx,
  ...props
}: TUseDelistIndexProps) => {
  const { setTransactionObj, transactionObj } = useTransactionIndicator()

  const {
    mutate,
    isLoading: mutateLoading,
    error: mutateError,
  } = useMutation({
    mutationFn: async ({
      indexId,
      indexAddress,
      date,
    }: TUseMutationVariable) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/index/delistAnIndex/${indexId}/${indexAddress}/${date}`
      )
      if (!res.ok) {
        console.error('error', res)
        return false
      }
      return true
    },
    onMutate: () => {
      setTransactionObj({
        status: 'loading',
        transactionAction: 'Delisting Index',
        isApiCall: true,
      })
    },
    onSuccess: (data) => {
      if (data) {
        setTransactionObj({
          ...transactionObj,
          status: 'success',
        })
        onSuccessTx?.()
      } else
        setTransactionObj({
          ...transactionObj,
          status: 'failed',
        })
    },
    onError: (error) => {
      setTransactionObj({
        ...transactionObj,
        status: 'failed',
      })
      console.error({ error })
    },
    ...props,
  })

  return {
    delistIndex: mutate,
    isLoading: mutateLoading,
    error: mutateError,
  }
}
