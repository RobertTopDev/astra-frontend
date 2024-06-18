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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useApprove, useChainConfig, useStakeAstra } from '@/hooks'
import { parseUnits } from 'viem'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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

const stakeAstraFormSchema = z.object({
  lockup: z.string({
    required_error: 'Please select a lockup period',
  }),
})

type StakeAstraFormValues = z.infer<typeof stakeAstraFormSchema>

type TStakingAstraStakeAstraCardProps = {
  allowance?: number
  isLoading: boolean
  isRefetching: boolean
  stakingScore: number
  rewardMultiplier: number
  balanceOfAstraUnStaked: number
  accruedRewards: number
  astraDecimal?: number
  refetchAllowance: () => void
  refetchDatas: () => void
}

const StakingAstraStakeAstraCard = ({
  allowance,
  isLoading,
  isRefetching,
  stakingScore,
  rewardMultiplier,
  balanceOfAstraUnStaked,
  accruedRewards,
  astraDecimal,
  refetchAllowance,
  refetchDatas,
}: TStakingAstraStakeAstraCardProps) => {
  const { chainConfig } = useChainConfig()

  const [stakedAmount, setStakedAmount] = useState<string>('')

  // FORM
  const form = useForm<StakeAstraFormValues>({
    resolver: zodResolver(stakeAstraFormSchema),
    delayError: 300,
    reValidateMode: 'onSubmit',
    defaultValues: {
      lockup: LOCKUP_PERIODS[0].value + '',
    },
  })
  const formValues = form.watch()

  // APPROVE
  const {
    approve,
    error: approveError,
    isLoading: approveLoading,
  } = useApprove({
    address: chainConfig.AstraContractAddress as `0x${string}`,
    minAmount: astraDecimal ? parseUnits(stakedAmount || '0', astraDecimal) : 0,
    enabled:
      form.formState.isValid &&
      !!formValues &&
      !!stakedAmount &&
      allowance !== undefined &&
      astraDecimal !== undefined &&
      allowance < parseUnits(stakedAmount || '0', astraDecimal),
    spender: chainConfig.ChefContractAddress as `0x${string}`,
    onSuccessTx: () => {
      refetchAllowance()
    },
  })

  // STAKE
  const {
    stakeAstra,
    error: stakeAstraError,
    isLoading: stakeAstraLoading,
  } = useStakeAstra({
    enabled:
      form.formState.isValid &&
      !!formValues &&
      !!stakedAmount &&
      allowance !== undefined &&
      astraDecimal !== undefined &&
      allowance >= parseUnits(stakedAmount || '0', astraDecimal) &&
      Number(stakedAmount) <= Number(balanceOfAstraUnStaked),
    args:
      astraDecimal !== undefined && !!stakedAmount && form.formState.isValid
        ? [
            parseUnits(stakedAmount || '0', astraDecimal),
            BigInt(formValues.lockup),
            BigInt(0),
            false,
          ]
        : undefined,
    onSuccessTx: () => {
      refetchDatas()
      setStakedAmount('')
      // call cross chain verify multiplier function (check eth value)
      // verifyMultiplierCrosschain?.()
    },
  })

  const stakeButton = () => {
    if (
      allowance !== undefined &&
      astraDecimal !== undefined &&
      allowance < parseUnits(stakedAmount || '0', astraDecimal)
    ) {
      return (
        <Button
          variant="astra-blue"
          disabled={!approve || !!approveError || approveLoading}
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
          disabled={!form.formState.isValid || !stakeAstra || !!stakeAstraError}
          isLoading={isLoading || stakeAstraLoading}
          onClick={() => stakeAstra?.()}
        >
          {!stakedAmount ||
          Number(stakedAmount) <= Number(balanceOfAstraUnStaked)
            ? 'STAKE'
            : 'INSUFFICIENT BALANCE'}
        </Button>
      )
    }
  }

  return (
    <Form {...form}>
      <form className="relative col-span-6 flex flex-col justify-center gap-4 bg-gray-400/50 px-12 py-6 rounded-lg">
        {isRefetching && (
          <div className="absolute top-4 right-4">
            <AstraLoading isLoading={true}></AstraLoading>
          </div>
        )}
        <div className="text-center font-bold text-xl">STAKE</div>
        <div className="flex w-full text-black justify-between gap-4 [&>div>div]:absolute [&>div>div]:top-2 [&>div>div]:right-2 [&>div>h3]:text-xs [&>div]:flex-grow [&>div]:relative [&>div]:bg-white [&>div]:rounded-lg [&>div]:p-4">
          <div>
            <h3>Staking Score</h3>
            <p>
              <AstraLoading isLoading={isLoading}>
                {Number(stakingScore).toLocaleString('en-US')}
              </AstraLoading>
            </p>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
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
                  <TooltipTrigger>
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
                {(accruedRewards / rewardMultiplier).toLocaleString('en-US')}
              </AstraLoading>
            </p>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
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
        <div className="bg-white rounded-lg p-2 flex w-full gap-2">
          <div className="flex flex-col flex-grow">
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
          </div>
          <Button
            variant="outline"
            className="border !border-astra-blue text-black rounded-full"
            isLoading={isLoading}
            onClick={() => setStakedAmount(balanceOfAstraUnStaked.toFixed(2))}
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
                  <SelectContent className="overflow-auto">
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

export { StakingAstraStakeAstraCard }
