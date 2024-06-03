'use client'
import { AstraButtonAuthenticated, AstraLoading } from '@/components'
import {
  DialogHeader,
  Dialog,
  DialogContent,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  RadioGroupItem,
  RadioGroup,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn'

import {
  useEarlyExitFees,
  usePoolInfo,
  usePoolUserInfo,
  useStableCoin,
  useWithdrawIndex,
} from '@/hooks'
import { TIndex } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InfoCircledIcon,
  ThickArrowDownIcon,
  ArrowLeftIcon,
} from '@radix-ui/react-icons'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { formatUnits, parseUnits } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import { z } from 'zod'

const withdrawIndexFormSchema = z.object({
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

type WithdrawIndexFormValues = z.infer<typeof withdrawIndexFormSchema>

type TWithdrawIndexModalProps = {
  userIndices: TIndex[] | undefined
  withdrawIndex: number | undefined
  setWithdrawIndex: (value: number | undefined) => void
}

const WithdrawIndexModal = ({
  withdrawIndex,
  setWithdrawIndex,
  userIndices,
}: TWithdrawIndexModalProps) => {
  const { address } = useAccount()
  const { data: earlyExitFees, isLoading: earlyExitFeesLoading } =
    useEarlyExitFees({})
  const selectedIndex = useMemo(
    () =>
      userIndices !== undefined && withdrawIndex !== undefined
        ? userIndices?.find(
            (i) => Number(i.ITOKEN_INDEX) === Number(withdrawIndex)
          )
        : undefined,
    [userIndices, withdrawIndex]
  )
  const [avoidEarlyExitFees, setAvoidEarlyExitFees] = useState<boolean>()

  const form = useForm<WithdrawIndexFormValues>({
    resolver: zodResolver(withdrawIndexFormSchema),
    delayError: 300,
    reValidateMode: 'onChange',
  })
  const formValues = form.watch()

  const { data: itokenBalance } = useBalance({
    address: address,
    token: selectedIndex?.ITOKEN_ADDR as `0x${string}`,
    enabled: address !== undefined && selectedIndex !== undefined,
  })
  const { data: stableCoin } = useStableCoin()

  const { data: stableCoinBalance } = useBalance({
    address: address,
    token: stableCoin?.address as `0x${string}`,
    enabled: address !== undefined && selectedIndex !== undefined,
  })

  const { data: poolInfo } = usePoolInfo({
    args:
      selectedIndex !== undefined
        ? [BigInt(selectedIndex?.ITOKEN_INDEX)]
        : undefined,
    enabled: selectedIndex !== undefined,
  })
  const { data: poolUserInfo } = usePoolUserInfo({
    args:
      selectedIndex !== undefined && address !== undefined
        ? [BigInt(selectedIndex?.ITOKEN_INDEX), address]
        : undefined,
    enabled: selectedIndex !== undefined && address !== undefined,
  })

  const [payoutChoice, setPayoutChoice] = useState('standard')

  const premiumPayout = useMemo(() => {
    if (
      poolInfo !== undefined &&
      poolUserInfo !== undefined &&
      selectedIndex !== undefined &&
      stableCoin !== undefined
    ) {
      const currentBalance = Number(
        formatUnits(poolUserInfo[0], stableCoin.decimals)
      )
      const pendingBalance = Number(
        formatUnits(poolUserInfo[2], stableCoin.decimals)
      )
      const currentRebalance = poolInfo[4]
      const currentPool = poolUserInfo[1]
      if (currentRebalance > currentPool && currentBalance + pendingBalance > 0)
        return true
    }
    return false
  }, [poolInfo, poolUserInfo, stableCoin])

  const {
    withdrawIndex: withdrawIndexTx,
    isLoading: withdrawIndexLoading,
    error: withdrawIndexError,
  } = useWithdrawIndex({
    args:
      avoidEarlyExitFees !== undefined &&
      itokenBalance !== undefined &&
      selectedIndex !== undefined &&
      address !== undefined &&
      formValues !== null &&
      form.formState.isValid
        ? [
            BigInt(selectedIndex?.ITOKEN_INDEX),
            avoidEarlyExitFees,
            payoutChoice === 'premium',
            parseUnits(formValues.tokenInput, itokenBalance?.decimals),
          ]
        : undefined,
    enabled:
      selectedIndex !== undefined &&
      address !== undefined &&
      itokenBalance !== undefined &&
      formValues !== null &&
      form.formState.isValid &&
      formValues.tokenInput !== null &&
      avoidEarlyExitFees !== undefined &&
      formValues.tokenInput <= itokenBalance?.formatted,
  })

  const submitButton = () => {
    return (
      <Button
        variant="astra-blue"
        type="submit"
        className="mt-4"
        isLoading={withdrawIndexLoading}
        disabled={
          !!withdrawIndexError ||
          withdrawIndexLoading ||
          !withdrawIndexTx ||
          (!!itokenBalance &&
            Number(itokenBalance?.formatted) < Number(formValues.tokenInput))
        }
      >
        {!!itokenBalance &&
        Number(itokenBalance?.formatted) < Number(formValues.tokenInput)
          ? 'INSUFFICIENT BALANCE'
          : 'WITHDRAW'}
      </Button>
    )
  }

  function onSubmit() {
    withdrawIndexTx?.()
    // poolIn?.()
  }

  return (
    <Dialog
      open={withdrawIndex !== undefined}
      onOpenChange={(open) => {
        if (open) null
        else {
          setWithdrawIndex(undefined)
          setAvoidEarlyExitFees(undefined)
        }
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[90vh] bg-white text-black rounded-xl overflow-y-auto overflow-x-auto">
        {avoidEarlyExitFees === undefined ? (
          <>
            <DialogHeader className="text-xl text-center">
              Withdraw
            </DialogHeader>
            <div className="text-justify">
              An early exit fee is only charged if you have not held your index
              participation units for up to six months. You can convert your
              holdings to ASTRADAO and stake for six months to avoid being
              charged an early exit fee. Your Early Exit Fees on
              withdrawal:&nbsp;
              <AstraLoading isLoading={earlyExitFeesLoading}>
                {earlyExitFees?.toString() ?? 0}
              </AstraLoading>
              %
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="astra-white"
                onClick={() => setAvoidEarlyExitFees(true)}
              >
                Avoid Early Exit Fees
              </Button>
              <Button
                variant="astra-blue"
                onClick={() => setAvoidEarlyExitFees(false)}
              >
                Continue
              </Button>
            </div>
          </>
        ) : selectedIndex !== undefined ? (
          <>
            <DialogHeader className="text-xl text-center">
              {selectedIndex?.ITOKENNAME}
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-1"
              >
                <button
                  type="button"
                  className="cursor-pointer max-w-[125px] text-white pb-3"
                  onClick={() => {
                    setAvoidEarlyExitFees(undefined)
                  }}
                >
                  <div className="flex gap-2 py-1 px-4 items-center bg-gray-700 rounded-full">
                    <ArrowLeftIcon className="h-[1rem] w-[1rem]"></ArrowLeftIcon>
                    <div className="text-sm">Go Back</div>
                  </div>
                </button>
                <div className="text-xl font-bold">SWAP</div>
                <div className="bg-[#15192b] rounded-lg p-3 flex flex-col gap-2 text-white ">
                  <div className="flex justify-between items-center">
                    <Select defaultValue={selectedIndex.ITOKEN_INDEX}>
                      <SelectTrigger className="font-bold flex-shrink w-auto">
                        <SelectValue placeholder="Select iToken" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value={selectedIndex.ITOKEN_INDEX}
                          key={selectedIndex.ITOKEN_ADDR}
                        >
                          {selectedIndex.ITOKENNAME}
                        </SelectItem>
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
                  <div className="flex justify-between">
                    <div>Balance: {itokenBalance?.formatted ?? 0} iToken</div>
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
                          itokenBalance?.formatted ?? '0'
                        )
                      }}
                    >
                      Max
                    </Button>
                  </div>
                  {/* <div className="flex flex-col gap-1"> */}
                  {/*   <div>{itokenBalance?.formatted ?? 0} iToken</div> */}
                  {/* </div> */}
                </div>
                <div className="relative py-2">
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10  bg-white rounded-full p-2">
                    <ThickArrowDownIcon className="w-[1.5rem] h-[1.5rem]" />
                  </div>
                </div>
                <div className="bg-[#15192b] rounded-lg p-3 flex flex-col gap-2 text-white ">
                  <div className="flex justify-between items-center">
                    <Select defaultValue="usdc">
                      <SelectTrigger className="font-bold flex-shrink w-auto">
                        <SelectValue placeholder="Select iToken" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdc">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                    <div>{stableCoinBalance?.formatted} USDC</div>
                  </div>
                </div>
                {premiumPayout && (
                  <RadioGroup
                    defaultValue={payoutChoice}
                    className="my-2 text-black"
                    onValueChange={setPayoutChoice}
                  >
                    <div className="flex items-center space-x-2 relative">
                      <RadioGroupItem
                        value="premium"
                        id="r1"
                        className="text-black"
                      />
                      <Label htmlFor="r1">Premium Payout</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoCircledIcon className="w-1rem h-[1rem]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Increase profit and earn up to 100% APY & an&nbsp;
                              <br />
                              additional reward by converting your iTokens to
                              <br />
                              Astra tokens and staking for 6 months
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="standard"
                        id="r2"
                        className="text-black"
                      />
                      <Label htmlFor="r2">Standard Payout</Label>
                    </div>
                  </RadioGroup>
                )}
                <div className="flex flex-col gap-2 justify-center items-center">
                  <AstraButtonAuthenticated>
                    {submitButton()}
                  </AstraButtonAuthenticated>
                </div>
              </form>
            </Form>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export { WithdrawIndexModal }
