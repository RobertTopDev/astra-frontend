'use client'
import { DAAAbi } from '@/abis'
import { AstraButtonAuthenticated, AstraLoading } from '@/components'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn'
import { coingeckoMappings } from '@/constants'
import {
  useAllowance,
  useApprove,
  useChainConfig,
  useCoingeckoPrice,
  usePoolIn,
  usePoolValue,
} from '@/hooks'
import { TIndex, TInvestmentToken } from '@/types'
import { truncate } from '@/util'
import { zodResolver } from '@hookform/resolvers/zod'
import { InfoCircledIcon, ThickArrowDownIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { parseUnits } from 'viem'
import {
  useAccount,
  useBalance,
  useContractRead,
  useNetwork,
  useToken,
} from 'wagmi'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const buyIndexFormSchema = z.object({
  tokenInput: z
    .string({
      required_error: 'Input is required',
    })
    .regex(/[+]?([0-9]+[.])?[0-9]+/, {
      message: 'Please input a correct number',
    })
    .refine((val) => Number(val) > 0, {
      message: 'Please input a number greater than 0',
    }),
})

type BuyIndexFormValues = z.infer<typeof buyIndexFormSchema>

type TBuyIndexProps = { index: TIndex; investmentTokens: TInvestmentToken[] }

const BuyIndex = ({ index, investmentTokens }: TBuyIndexProps) => {
  const [buyIndexDialog, setBuyIndexDialog] = useState(false)
  const { chain } = useNetwork()
  const { address: accountAddress } = useAccount()
  const { chainConfig } = useChainConfig()
  const router = useRouter()

  // FORM
  const form = useForm<BuyIndexFormValues>({
    resolver: zodResolver(buyIndexFormSchema),
    delayError: 300,
    reValidateMode: 'onChange',
  })
  const formValues = form.watch()

  useEffect(() => {
    if (chain?.unsupported) {
      setBuyIndexDialog(false)
    }
  }, [chain])

  const investmentTokensWithNativeCurrency = useMemo(
    () =>
      process.env.NEXT_ENV === 'development'
        ? [
            {
              TOKEN_ADDRESS: 'NATIVE',
              DECIMAL: chain?.nativeCurrency.decimals,
              TOKEN_SYMBOL: chain?.nativeCurrency.symbol,
            },
            ...investmentTokens,
          ]
        : ([
            {
              TOKEN_ADDRESS: 'NATIVE',
              DECIMAL: chain?.nativeCurrency.decimals,
              TOKEN_SYMBOL: chain?.nativeCurrency.symbol,
            },
            {
              TOKEN_ADDRESS: chainConfig.USDCContractAddress,
              DECIMAL: 6,
              TOKEN_SYMBOL: 'USDC',
            },
            {
              TOKEN_ADDRESS: chainConfig.USDTContractAddress,
              DECIMAL: 6,
              TOKEN_SYMBOL: 'USDT',
            },
            {
              TOKEN_ADDRESS: chainConfig.DAIContractAddress,
              DECIMAL: 18,
              TOKEN_SYMBOL: 'DAI',
            },
          ] as TInvestmentToken[]),
    [investmentTokens, chain]
  )
  const [selectedTokenPayment, setSelectedTokenPayment] = useState<string>(
    investmentTokensWithNativeCurrency[0].TOKEN_ADDRESS
  )
  const selectedTokenObject = useMemo(
    () =>
      investmentTokensWithNativeCurrency.find(
        (token) => token.TOKEN_ADDRESS === selectedTokenPayment
      ),
    [selectedTokenPayment]
  )

  // ALLOWANCE & BALANCES
  const { data: tokenAllowance, refetch: refetchTokenAllowance } = useAllowance(
    {
      address: selectedTokenPayment as `0x${string}`,
      enabled:
        !!chain &&
        !!chain.id &&
        !!accountAddress &&
        selectedTokenPayment !== 'NATIVE',
      args: [accountAddress!, chainConfig.DAAContractAddress],
    }
  )
  const {
    data: selectedTokenBalance,
    isLoading: isLoadingSelectedTokenBalance,
    refetch: refetchSelectedBalance,
  } = useBalance({
    address: accountAddress,
    token:
      selectedTokenPayment === 'NATIVE'
        ? undefined
        : // : ('0x17F40bb578C91E4A0C69968487A269f55C75A65D' as `0x${string}`),
          (selectedTokenPayment as `0x${string}`),
    enabled: !!accountAddress,
  })
  const {
    data: indexBalance,
    isLoading: isLoadingIndexBalance,
    refetch: refetchIndexBalance,
  } = useBalance({
    address: accountAddress,
    token: index.ITOKEN_ADDR as `0x${string}`,
  })
  const { data: poolInfo } = useContractRead({
    address: chainConfig.DAAContractAddress,
    abi: DAAAbi,
    functionName: 'poolInfo',
    args: [BigInt(0)],
  })
  const { data: stableCoinAddress } = useContractRead({
    address: chainConfig.DAAContractAddress,
    abi: DAAAbi,
    functionName: 'baseStableCoin',
  })
  const { data: stableCoin } = useToken({
    address: stableCoinAddress,
    enabled: stableCoinAddress !== undefined,
  })
  const { data: selectedTokenCurrency } = useCoingeckoPrice({
    ids:
      selectedTokenObject !== undefined
        ? coingeckoMappings[
            selectedTokenObject.TOKEN_SYMBOL as keyof typeof coingeckoMappings
          ]
        : '',
    enabled: selectedTokenObject !== undefined,
  })
  const { data: stableCoinCurrency } = useCoingeckoPrice({
    ids:
      stableCoin !== undefined
        ? coingeckoMappings[stableCoin.symbol as keyof typeof coingeckoMappings]
        : '',
    enabled: stableCoin !== undefined,
  })
  const selectedTokenAmountUSD = useMemo(() => {
    if (
      selectedTokenCurrency === undefined ||
      stableCoinCurrency === undefined ||
      !formValues.tokenInput
    )
      return 0
    return selectedTokenCurrency * Number(formValues.tokenInput)
  }, [selectedTokenCurrency, stableCoinCurrency, formValues])

  const { data: poolValue } = usePoolValue({
    index: index,
  })
  const indexValue = useMemo(() => {
    if (poolValue === undefined || stableCoin === undefined) return BigInt(0)
    return parseUnits(poolValue.value + '', stableCoin?.decimals)
  }, [poolValue, stableCoin])
  const depositValue = useMemo(() => {
    if (
      selectedTokenCurrency === undefined ||
      stableCoinCurrency === undefined ||
      stableCoinCurrency === 0 ||
      stableCoin === undefined
    )
      return BigInt(0)
    const receivableAmountUSD = selectedTokenAmountUSD / stableCoinCurrency
    // stableCoinUSD to stableCoinValue
    return parseUnits(receivableAmountUSD + '', stableCoin?.decimals)
  }, [selectedTokenCurrency, stableCoinCurrency, stableCoin])

  const { data: iTokenValue } = useContractRead({
    address: chainConfig.DAAContractAddress,
    abi: DAAAbi,
    functionName: 'getItokenValue',
    args:
      stableCoin !== undefined
        ? [stableCoin.totalSupply.value, indexValue, depositValue]
        : undefined,
    enabled: stableCoin !== undefined,
  })

  const iTokenReceivableAmount = useMemo(() => {
    if (
      poolInfo === undefined ||
      selectedTokenCurrency === undefined ||
      stableCoinCurrency === undefined ||
      stableCoinCurrency === 0
    )
      return 0
    //const currentRebalanceValue = poolInfo[4]
    //if (currentRebalanceValue <= 0) {
    return selectedTokenAmountUSD / stableCoinCurrency
    //}
    // return Number(
    //   formatUnits(iTokenValue ?? BigInt(0), stableCoin?.decimals ?? 1)
    // )
  }, [
    iTokenValue,
    poolInfo,
    selectedTokenCurrency,
    stableCoinCurrency,
    selectedTokenAmountUSD,
  ])
  const iTokenReceivableAmountUSD = useMemo(() => {
    if (stableCoinCurrency === undefined || stableCoinCurrency === 0) return 0
    return iTokenReceivableAmount * stableCoinCurrency
  }, [iTokenReceivableAmount, stableCoinCurrency])
  const tokenInputAmountUSD = useMemo(() => {
    if (selectedTokenCurrency === undefined || !formValues.tokenInput) return 0
    return selectedTokenCurrency * Number(formValues.tokenInput)
  }, [selectedTokenCurrency, formValues.tokenInput])

  const refetchDatas = () => {
    refetchTokenAllowance()
    refetchSelectedBalance()
    refetchIndexBalance()
  }

  function onSubmit() {
    poolIn?.()
  }

  const tokenInputParsed = useMemo(() => {
    if (!formValues.tokenInput || selectedTokenObject === undefined)
      return BigInt(0)
    return parseUnits(formValues.tokenInput, selectedTokenObject!.DECIMAL ?? 0)
  }, [formValues.tokenInput, selectedTokenObject])

  // POOL IN
  const {
    poolIn,
    error: poolInError,
    isLoading: poolInLoading,
  } = usePoolIn({
    enabled:
      form.formState.isValid &&
      !!selectedTokenObject &&
      selectedTokenBalance !== undefined &&
      Number(formValues.tokenInput) > 0 &&
      selectedTokenObject!.TOKEN_ADDRESS === 'NATIVE'
        ? Number(formValues.tokenInput) <=
          Number(selectedTokenBalance?.formatted)
        : tokenAllowance !== undefined && tokenAllowance >= tokenInputParsed,
    args: form.formState.isValid
      ? selectedTokenObject!.TOKEN_ADDRESS === 'NATIVE'
        ? [[], [], BigInt(index.ITOKEN_INDEX)]
        : [
            [selectedTokenObject!.TOKEN_ADDRESS as `0x${string}`],
            // ['0x17F40bb578C91E4A0C69968487A269f55C75A65D' as `0x${string}`],
            [tokenInputParsed],
            BigInt(index.ITOKEN_INDEX),
          ]
      : undefined,
    value:
      selectedTokenObject!.TOKEN_ADDRESS === 'NATIVE' && form.formState.isValid
        ? BigInt(
            parseUnits(
              formValues.tokenInput,
              selectedTokenObject!.DECIMAL ?? 0
            ) || 0
          )
        : BigInt(0),
    onSuccessTx: () => {
      refetchDatas()
      router.push('/portfolio')
    },
  })

  // APPROVE
  const {
    approve,
    error: approveError,
    isLoading: approveLoading,
  } = useApprove({
    minAmount: tokenInputParsed,
    address: selectedTokenPayment as `0x${string}`,
    enabled:
      !!selectedTokenObject &&
      selectedTokenPayment !== 'NATIVE' &&
      !!formValues &&
      !!formValues.tokenInput &&
      tokenAllowance !== undefined &&
      tokenAllowance < tokenInputParsed,
    spender: chainConfig.DAAContractAddress,
    onSuccessTx: () => {
      refetchTokenAllowance()
    },
  })

  const submitButton = () => {
    if (selectedTokenObject!.TOKEN_ADDRESS === 'NATIVE') {
      return (
        <>
          <Button
            variant="astra-blue"
            type="submit"
            isLoading={poolInLoading}
            disabled={
              !!poolInError ||
              poolInLoading ||
              !poolIn ||
              (!!selectedTokenBalance &&
                Number(selectedTokenBalance?.formatted) <
                  Number(formValues.tokenInput))
            }
          >
            {!!selectedTokenBalance &&
            Number(selectedTokenBalance?.formatted) <
              Number(formValues.tokenInput)
              ? 'INSUFFICIENT BALANCE'
              : 'INVEST IN THIS INDEX '}
          </Button>
          {/* {poolInError && ( */}
          {/*   <div className="text-destructive text-sm text-center"> */}
          {/*     An error occurred preparing the transaction */}
          {/*     {poolInError.message} */}
          {/*   </div> */}
          {/* )} */}
        </>
      )
    } else {
      if (tokenAllowance !== undefined && tokenAllowance < tokenInputParsed) {
        return (
          <>
            <Button
              variant="astra-blue"
              disabled={!approve || !!approveError || approveLoading}
              isLoading={approveLoading}
              onClick={() => approve?.()}
            >
              APPROVE
            </Button>
          </>
        )
      } else {
        return (
          <>
            <Button
              variant="astra-blue"
              type="submit"
              disabled={!!poolInError || poolInLoading || !poolIn}
              isLoading={poolInLoading}
            >
              INVEST IN THIS INDEX
            </Button>
          </>
        )
      }
    }
  }

  return (
    <AstraButtonAuthenticated>
      <Dialog open={buyIndexDialog} onOpenChange={setBuyIndexDialog}>
        <DialogTrigger asChild>
          {index.IS_DELISTED || (
            <Button variant="astra-blue">Buy This Index</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl max-h-[90vh] bg-white text-black rounded-xl overflow-y-auto ">
          <DialogHeader className="text-xl">Buy With Crypto</DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={clsx('w-full flex flex-col gap-6')}
            >
              <div className="rounded-lg py-2 px-12 text-center bg-astra-blue/20 text-black border-2 border-astra-blue">
                For lower gas fees, invest with USDC.&nbsp;
              </div>
              <div className="flex flex-col">
                <div className="bg-astra-dark-blue text-white rounded-lg p-4 w-full flex flex-col gap-2">
                  <div className="flex justify-between">
                    <Select
                      onValueChange={(val) => {
                        setSelectedTokenPayment(val)
                        form.setValue('tokenInput', '')
                      }}
                      defaultValue={selectedTokenPayment}
                    >
                      <SelectTrigger className="w-auto min-w-[10rem]">
                        <SelectValue placeholder="Select an Action" />
                      </SelectTrigger>
                      <SelectContent>
                        {investmentTokensWithNativeCurrency?.map((token) => (
                          <SelectItem
                            value={token.TOKEN_ADDRESS}
                            key={token.TOKEN_ADDRESS}
                          >
                            {token.TOKEN_SYMBOL}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormField
                      control={form.control}
                      name="tokenInput"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="px-0 py-0 text-white border-none focus-visible:outline-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              style={{
                                direction: 'rtl',
                              }}
                              placeholder="Enter Amount"
                              type="number"
                              min="0"
                              step="any"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <div className="text-xs">
                      Balance:&nbsp;
                      <AstraLoading isLoading={isLoadingSelectedTokenBalance}>
                        {selectedTokenBalance
                          ? parseFloat(selectedTokenBalance.formatted).toFixed(
                              3
                            )
                          : ''}
                        &nbsp;
                        {selectedTokenObject?.TOKEN_SYMBOL}
                      </AstraLoading>
                      {'  '}
                      {!!selectedTokenBalance &&
                      selectedTokenBalance.value > 0 ? (
                        <Button
                          variant="astra-white"
                          className="lg:px-2 md:px-2 px-2 h-auto lg:py-1 md:py-1 py-1 lg:text-xs md:text-xs font-normal text-xs"
                          style={{
                            fontSize: '0.6rem',
                            lineHeight: '0.5rem',
                          }}
                          onClick={() => {
                            form.setValue(
                              'tokenInput',
                              selectedTokenBalance?.formatted
                            )
                          }}
                        >
                          Max
                        </Button>
                      ) : null}
                    </div>
                    <div>~{tokenInputAmountUSD.toFixed(2)} USD</div>
                  </div>
                </div>
                <div className="relative py-2">
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10  bg-white rounded-full p-2">
                    <ThickArrowDownIcon className="w-[1.5rem] h-[1.5rem]" />
                  </div>
                </div>
                <div className="bg-astra-dark-blue text-white rounded-lg p-4 w-full flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div>{truncate(index.ITOKENNAME, 25)}</div>

                    <div className="text-white text-sm font-medium">
                      {iTokenReceivableAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div>
                      Balance:&nbsp;
                      <AstraLoading isLoading={isLoadingIndexBalance}>
                        {!!indexBalance
                          ? parseFloat(indexBalance.formatted).toFixed(3)
                          : 0}{' '}
                        iToken
                      </AstraLoading>
                    </div>
                    <div>~{iTokenReceivableAmountUSD.toFixed(2)}USD</div>
                  </div>
                </div>
              </div>
              <div className="py-2 px-4 bg-destructive/20 border-2 border-destructive flex items-center rounded-lg">
                <div className="flex-grow-0">
                  <InfoCircledIcon className="text-destructive w-[1.5rem] h-[1.5rem]" />
                </div>
                <div className="text-center text-black flex-grow text-sm">
                  This is a decentralized anonymous index, please make sure you
                  trust the index creator before investing, otherwise you may
                  lose all your funds.&nbsp;
                </div>
              </div>
              <div className="flex relative justify-between">
                <div className="">Expected Output</div>
                <div className="">
                  {iTokenReceivableAmount.toFixed(2)} iToken
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center items-center">
                <AstraButtonAuthenticated>
                  {submitButton()}
                </AstraButtonAuthenticated>
              </div>
              <div className="text-xs">
                *When you invest in an index, be sure to keep track of it as the
                index creator could shut the index down. If this happens, you
                will be allowed to withdraw your funds from the index at any
                time.&nbsp;
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AstraButtonAuthenticated>
  )
}

export { BuyIndex }
