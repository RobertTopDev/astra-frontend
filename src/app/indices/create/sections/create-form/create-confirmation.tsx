import { useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { CreateIndexFormValues } from '.'
import { Button, Separator, Skeleton } from '@/components/shadcn'
import { TToken } from '@/types'
import { SelectTokens } from './select-tokens'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { AstraCard, AstraLoading } from '@/components'
import { useAccount, useContractRead, useNetwork } from 'wagmi'
import { chainConfig, defaultChain } from '@/config'
import { formatUnits } from 'viem'
import {
  useApprove,
  useAstraAllowance,
  useAstraDecimal,
  useAstraUSDPrice,
  useDepositAstra,
  useIndicesAmount,
} from '@/hooks'
import { indicesPaymentAbi } from '@/abis'
import { numberFormatter } from '@/util'
import { TermsCheckbox } from './terms-checkbox'
// import * as CheckBoxReact from '@radix-ui/react-checkbox'

type CheckedState = boolean | 'indeterminate'

type TCreateConfirmationProps = {
  selectedTokens: TToken[]
  allTokens: TToken[]
  toggleSelected: (token: TToken) => void
  tokenDialog: boolean
  setTokenDialog: (value: boolean) => void
  form: UseFormReturn<CreateIndexFormValues, unknown, undefined>
  setIsSubmitting: (value: boolean) => void
  addPublicPoolError: Error | null
  isLoadingAddPublicPool: boolean
  addPublicPool: (() => void) | undefined
}

const CreateConfirmation = ({
  selectedTokens,
  allTokens,
  toggleSelected,
  tokenDialog,
  setTokenDialog,
  form,
  isLoadingAddPublicPool,
  setIsSubmitting,
  addPublicPoolError,
  addPublicPool,
}: TCreateConfirmationProps) => {
  const [termsAccepted, setTermsAccepted] = useState<CheckedState | boolean>(
    false
  )
  const formValues = form.getValues()
  const { chain = defaultChain } = useNetwork()
  const config = chainConfig[chain!.id]
  const { address } = useAccount()

  // ASTRA DETAILS
  const { data: astraAmount, isLoading: loadingAmount } = useContractRead({
    address: config.IndicesPaymentContractAddress,
    abi: indicesPaymentAbi,
    functionName: 'astraAmount',
    enabled: !!chain && !!chain.id,
  })
  const { data: astraDecimal } = useAstraDecimal()
  const { data: astraAllowance, refetch: refetchAstraAllowance } =
    useAstraAllowance({
      args: [address!, config.IndicesPaymentContractAddress],
      enabled: !!address,
    })
  const { data: astraUSDPrice, isLoading: astraUSDPriceLoading } =
    useAstraUSDPrice({})

  const astraPrice = useMemo(
    () =>
      astraAmount !== undefined &&
      astraDecimal !== undefined &&
      astraUSDPrice !== undefined
        ? Number(formatUnits(astraAmount, astraDecimal)) * astraUSDPrice
        : 0,
    [astraAmount, astraDecimal, astraUSDPrice]
  )

  const {
    utilisedAmount,
    depositedAmount,
    refetchUtilisedAmount,
    refetchDepositedAmount,
    isLoading: indicesAmountLoading,
  } = useIndicesAmount()

  const {
    depositAstra,
    isLoading: depositAstraLoading,
    error: depositError,
  } = useDepositAstra({
    address: config.IndicesPaymentContractAddress,
    enabled:
      form.formState.isValid &&
      astraAmount !== undefined &&
      astraAllowance !== undefined &&
      depositedAmount !== undefined &&
      utilisedAmount !== undefined &&
      depositedAmount - utilisedAmount <= astraAmount &&
      astraAllowance >= astraAmount,
    args:
      astraAmount !== undefined
        ? [config.AstraContractAddress, astraAmount]
        : undefined,
    value: BigInt(0),
    onSuccessTx: () => {
      refetchDepositedAmount()
      refetchUtilisedAmount()
    },
  })

  const {
    approve,
    isLoading: approveLoading,
    error: approveError,
  } = useApprove({
    minAmount: astraAmount ?? 0,
    address: config.AstraContractAddress,
    enabled:
      astraAllowance !== undefined &&
      astraAmount !== undefined &&
      astraDecimal !== undefined &&
      chain !== undefined &&
      astraAllowance < astraAmount,
    args:
      astraAmount !== undefined
        ? [config.IndicesPaymentContractAddress, astraAmount]
        : undefined,
    onSuccessTx: () => {
      refetchAstraAllowance()
      refetchDepositedAmount()
      refetchUtilisedAmount()
    },
  })

  const submitButton = () => {
    if (
      astraAllowance === undefined ||
      astraAmount === undefined ||
      depositedAmount === undefined ||
      utilisedAmount === undefined
    ) {
      return <Skeleton className="w-[200px] h-[40px] rounded-full" />
    }
    if (astraAllowance < astraAmount) {
      return (
        <>
          <Button
            variant="astra-blue"
            disabled={
              termsAccepted === 'indeterminate' ||
              !termsAccepted ||
              !approve ||
              !!approveError
            }
            isLoading={approveLoading}
            onClick={() => approve?.()}
          >
            APPROVE
          </Button>
        </>
      )
    } else if (depositedAmount - utilisedAmount < astraAmount) {
      return (
        <>
          <Button
            variant="astra-blue"
            disabled={
              termsAccepted === 'indeterminate' ||
              !termsAccepted ||
              !depositAstra ||
              !!depositError
            }
            isLoading={depositAstraLoading || indicesAmountLoading}
            onClick={() => depositAstra?.()}
          >
            {depositedAmount - utilisedAmount <= astraAmount
              ? 'PAY ASTRADAO'
              : 'INSUFFICIENT ASTRADAO'}
          </Button>
        </>
      )
    } else {
      return (
        <>
          <Button
            variant="astra-blue"
            type="submit"
            disabled={
              termsAccepted === 'indeterminate' ||
              !termsAccepted ||
              !!addPublicPoolError ||
              !addPublicPool ||
              isLoadingAddPublicPool
            }
            isLoading={isLoadingAddPublicPool}
          >
            CREATE INDEX
          </Button>
        </>
      )
    }
  }

  return (
    <>
      <div className="relative w-full text-center font-bold text-xl">
        <div
          className="absolute left-0 transform -translate-y-1/2 top-1/2 cursor-pointer"
          onClick={() => setIsSubmitting(false)}
        >
          <ArrowLeftIcon className="w-[2rem] h-[2rem]"></ArrowLeftIcon>
        </div>
        {formValues.indexName}
      </div>
      <Separator />
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-xl font-medium">{formValues.indexName}</div>
          <div className="text-sm font-bold">{formValues.indexSymbol}</div>
        </div>
        <div>{formValues.minimumTVL}</div>
      </div>
      <div className="text-left">{formValues.indexDescription}</div>
      <SelectTokens
        selectedTokens={selectedTokens}
        allTokens={allTokens}
        toggleSelected={toggleSelected}
        tokenDialog={tokenDialog}
        setTokenDialog={setTokenDialog}
        form={form}
      />
      <Separator />
      <div className="text-center text-lg">PUBLISH YOUR INDEX</div>
      <div>
        To publish your Index, you&apos;ll need to pay&nbsp;
        <AstraLoading isLoading={loadingAmount}>
          {!!astraAmount &&
            !!astraDecimal &&
            Number(
              formatUnits(astraAmount?.valueOf(), astraDecimal?.valueOf())
            ).toLocaleString('en-US')}
        </AstraLoading>
        &nbsp; ASTRADAO tokens and {chain?.name} Network Fees to cover smart
        contract creation.&nbsp;
      </div>
      <AstraCard
        className="bg-white text-black border-2 border-astra-blue py-4"
        contentClassName="py-4"
      >
        <div className="flex gap-6 items-center">
          <ExclamationTriangleIcon className="w-[3rem] h-[3rem] text-destructive"></ExclamationTriangleIcon>
          <div className="flex-grow">
            Creating an Index that can be bought and sold, requires the
            components to be valid and liquid on DEXs.
          </div>
        </div>
      </AstraCard>
      <Separator />
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div>Price to Publish Index</div>
          <div>In USD</div>
        </div>
        <div className="flex flex-col justify-end text-right">
          <div>
            <AstraLoading isLoading={loadingAmount}>
              {!!astraAmount &&
                !!astraDecimal &&
                Number(
                  formatUnits(astraAmount?.valueOf(), astraDecimal?.valueOf())
                ).toLocaleString('en-US')}
            </AstraLoading>
            &nbsp; ASTRADAO
          </div>
          <div>
            <AstraLoading isLoading={loadingAmount || astraUSDPriceLoading}>
              {'$' + numberFormatter(astraPrice, true)}
            </AstraLoading>
          </div>
        </div>
      </div>
      <Separator />
      <TermsCheckbox
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted}
      />
      <div className="flex flex-col items-center">{submitButton()}</div>
    </>
  )
}

export { CreateConfirmation }
