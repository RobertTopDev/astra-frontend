import { AstraButtonAuthenticated, AstraLoading } from '@/components'
import {
  Button,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { useApprove, useChainConfig } from '@/hooks'
import { parseUnits } from 'viem'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TIToken } from '@/types'
import { numberFormatter } from '@/util'
import { useStakeIToken } from '@/hooks/itoken/useStakeIToken'
import { useMemo, useState } from 'react'

const LOCKUP_PERIODS = [
  {
    label: 'No Lockup',
    value: 0,
  },
  {
    label: '6 Months',
    value: 6,
  },
  {
    label: '9 Months',
    value: 9,
  },
  {
    label: '12 Months',
    value: 12,
  },
]

const stakeITokenFormSchema = z.object({
  lockup: z.string({
    required_error: 'Please select a lockup period',
  }),
})

type StakeAstraFormValues = z.infer<typeof stakeITokenFormSchema>

type TStakingITokenStakeITokenCardProps = {
  allowance?: number
  isLoading: boolean
  // onSubmit: (values: StakeAstraFormValues) => void
  stakingScore: number | string
  rewardMultiplier: number
  unstakedITokenBalance: number
  accruedRewards: number
  itokenDecimals?: number
  refetchAllowance: () => void
  iTokens: TIToken[] | undefined
  refetchDatas: () => void
  selectedITokenIdx: string | undefined
  setSelectedITokenIdx: (idx: string) => void
  selectedIToken: TIToken | undefined
}

const StakingITokenStakeITokenCard = ({
  allowance,
  // form,
  isLoading,
  // onSubmit,
  stakingScore,
  rewardMultiplier,
  unstakedITokenBalance,
  accruedRewards,
  itokenDecimals,
  selectedIToken,
  refetchAllowance,
  refetchDatas,
  iTokens,
  setSelectedITokenIdx,
  selectedITokenIdx,
}: TStakingITokenStakeITokenCardProps) => {
  const { chainConfig } = useChainConfig()
  const [stakedAmount, setStakedAmount] = useState('')
  // FORM
  const form = useForm<StakeAstraFormValues>({
    resolver: zodResolver(stakeITokenFormSchema),
    delayError: 300,
    reValidateMode: 'onSubmit',
    defaultValues: {
      lockup: LOCKUP_PERIODS[0].value + '',
    },
  })
  const formValues = form.watch()

  const stakeAmountParsed = useMemo(() => {
    if (itokenDecimals !== undefined && stakedAmount) {
      return Number(parseUnits(stakedAmount, itokenDecimals))
    }
    return 0
  }, [stakedAmount])

  // APPROVE
  const {
    approve,
    error: approveError,
    isLoading: approveLoading,
  } = useApprove({
    address: selectedIToken?.contractAddress,
    minAmount: itokenDecimals
      ? Number(parseUnits(stakedAmount, itokenDecimals))
      : 0,
    enabled:
      form.formState.isValid &&
      !!formValues &&
      !!stakedAmount &&
      itokenDecimals !== undefined &&
      allowance !== undefined &&
      allowance < Number(parseUnits(stakedAmount, itokenDecimals)),
    spender: chainConfig.iTokenStakingContractAddress,
    onSuccessTx: () => {
      refetchAllowance()
    },
  })

  // STAKE
  const {
    stakeIToken,
    error: stakeITokenError,
    isLoading: stakeITokenLoading,
  } = useStakeIToken({
    enabled:
      form.formState.isValid &&
      !!formValues &&
      !!stakedAmount &&
      allowance !== undefined &&
      !!itokenDecimals &&
      allowance >= Number(stakedAmount) &&
      Number(stakedAmount) <= Number(unstakedITokenBalance),
    args:
      itokenDecimals !== undefined &&
      !!stakedAmount &&
      form.formState.isValid &&
      selectedIToken !== undefined
        ? [
            BigInt(selectedIToken?.id),
            BigInt(stakeAmountParsed),
            BigInt(formValues.lockup),
          ]
        : undefined,
    onSuccessTx: () => {
      refetchDatas()
      setStakedAmount('')
    },
  })

  const stakeButton = () => {
    if (allowance !== undefined && allowance < Number(stakedAmount)) {
      return (
        <Button
          variant="astra-blue"
          disabled={!form.formState.isValid || !approve || !!approveError}
          isLoading={isLoading || approveLoading}
          onClick={() => approve?.()}
        >
          Approve
        </Button>
      )
    } else {
      return (
        <Button
          variant="astra-blue"
          disabled={
            !form.formState.isValid || !stakeIToken || !!stakeITokenError
          }
          isLoading={isLoading || stakeITokenLoading}
          onClick={() => stakeIToken?.()}
        >
          STAKE
        </Button>
      )
    }
  }

  return (
    <Form {...form}>
      <form className="col-span-6 flex flex-col justify-center gap-4 bg-gray-400/50 px-12 py-6 rounded-lg">
        <div className="text-center font-bold text-xl">STAKE</div>
        <div className="flex w-full text-black justify-between gap-4 [&>div>div]:absolute [&>div>div]:top-2 [&>div>div]:right-2 [&>div>h3]:text-xs [&>div]:flex-grow [&>div]:relative [&>div]:bg-white [&>div]:rounded-lg [&>div]:p-4">
          <div>
            <h3>Staking Score</h3>
            <p>
              <AstraLoading isLoading={isLoading}>
                {Number(stakingScore).toFixed(2)}
              </AstraLoading>
            </p>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="reset">
                    <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      The staking score is calculated as an average of your
                      ASTRADAO token holdings over the last 60 days. Staking for
                      longer periods of time will lead to an increase in staking
                      score and APY.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <h3>Reward Multiplier</h3>
            <p>
              <AstraLoading isLoading={isLoading}>
                {rewardMultiplier.toFixed(2)}
              </AstraLoading>
            </p>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="reset">
                    <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      Multiplier weights are used to evaluate your participation
                      in tokens distribution and how much rewards you earn.
                      Locking your tokens for a longer period of time will
                      increase rewards up to 2.5x.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <h3>Accrued Rewards</h3>
            <p>
              <AstraLoading isLoading={isLoading}>
                {numberFormatter(accruedRewards / rewardMultiplier)}
              </AstraLoading>
            </p>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="reset">
                    <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>The total number of ASTRADAO rewards earned.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2 flex w-full justify-between text-black">
          <div className="flex gap-2 items-center">
            <div>Select iToken:</div>
            <FormItem className="flex-grow">
              <Select
                onValueChange={(val) => setSelectedITokenIdx(val)}
                defaultValue={selectedITokenIdx}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="font-bold">
                    <SelectValue placeholder="Select iToken" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {iTokens?.map((iToken, idx) => (
                    <SelectItem value={idx + ''} key={iToken.name}>
                      {iToken.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </div>
          <div className="flex flex-col justify-end text-right">
            <div>Balance:</div>
            <div>
              <AstraLoading isLoading={isLoading}>
                {numberFormatter(unstakedITokenBalance, true)}
              </AstraLoading>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2 flex w-full gap-2">
          <Input
            readOnly={isLoading}
            className="flex-grow px-4 py-0 text-black border-none focus-visible:outline-none focus-visible:ring-0  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Enter Amount"
            type="number"
            min="0"
            step="any"
            value={stakedAmount}
            onChange={(e) => setStakedAmount(e.target.value)}
          />
          <Button
            variant="outline"
            className="border !border-astra-blue text-black rounded-full"
            isLoading={isLoading}
            onClick={() =>
              setStakedAmount(
                unstakedITokenBalance > 0
                  ? unstakedITokenBalance.toFixed(2)
                  : '0'
              )
            }
          >
            Max
          </Button>
          <FormField
            control={form.control}
            name="lockup"
            render={({ field }) => (
              <FormItem className="flex-grow whitespace-nowrap">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="font-bold">
                      <SelectValue placeholder="Select a Lockup Period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LOCKUP_PERIODS.map((period) => (
                      <SelectItem value={period.value + ''} key={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center">
          <AstraButtonAuthenticated>{stakeButton()}</AstraButtonAuthenticated>
        </div>
      </form>
    </Form>
  )
}

export { StakingITokenStakeITokenCard }
