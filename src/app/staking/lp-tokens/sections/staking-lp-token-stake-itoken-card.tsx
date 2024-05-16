import {
  AstraButtonAuthenticated,
  AstraLoading,
  AstraTableToggleSortButton,
} from '@/components'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import {
  useApproveForAll,
  useChainConfig,
  useDepositNFTs,
  useLpIsApprovedForAll,
} from '@/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TLpPosition, TLpToken } from '@/types'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { numberFormatter } from '@/util'
import { formatUnits } from 'viem'

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

const stakeLpTokenFormSchema = z.object({
  pair: z.string({
    required_error: 'Pair is required',
  }),
  lockup: z.string({
    required_error: 'Please select a lockup period',
  }),
})

type StakeLpTokenFormValues = z.infer<typeof stakeLpTokenFormSchema>

type TStakingLpTokenStakeLpTokenCardProps = {
  isLoading: boolean
  isRefetching: boolean
  stakingScore: number
  rewardMultiplier: number
  balanceOfAstraUnStaked: number
  accruedRewards: number
  astraDecimal?: number
  // refetchAllowance: () => void
  refetchDatas: () => void
  lpTokenPositions?: TLpPosition[]
  lpTokens?: TLpToken[]
  selectedPairIdx?: string
  setSelectedPairIdx: (val: string) => void
}

const StakingLpTokenStakeLpTokenCard = ({
  // form,
  isLoading,
  // onSubmit,
  stakingScore,
  rewardMultiplier,
  accruedRewards,
  astraDecimal,
  // refetchAllowance,
  refetchDatas,
  isRefetching,
  lpTokenPositions,
  lpTokens,
  selectedPairIdx,
  setSelectedPairIdx,
}: TStakingLpTokenStakeLpTokenCardProps) => {
  const { chainConfig } = useChainConfig()

  const { data: isApprovedForAll, refetch: refetchIsApprovedForAll } =
    useLpIsApprovedForAll({})

  // FORM
  const form = useForm<StakeLpTokenFormValues>({
    resolver: zodResolver(stakeLpTokenFormSchema),
    delayError: 300,
    reValidateMode: 'onSubmit',
    defaultValues: {
      lockup: LOCKUP_PERIODS[0].value + '',
    },
  })
  const formValues = form.watch()

  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data: lpTokenPositions || [],
    columns: [
      {
        accessorKey: 'name',
        header: () => {
          return <div className="text-left">Name</div>
        },
        cell: ({ cell }) => (
          <div className="text-left">
            {cell.row.original.token0Info} / {cell.row.original.token1Info}
          </div>
        ),
      },
      {
        accessorKey: 'liquidity',
        header: ({ column }) => {
          return (
            <AstraTableToggleSortButton column={column}>
              Liquidity
            </AstraTableToggleSortButton>
          )
        },
        cell: ({ cell }) => {
          return (
            <div className="text-left">
              {astraDecimal !== undefined
                ? numberFormatter(
                    formatUnits(
                      BigInt(cell.row.original.liquidity),
                      astraDecimal
                    )
                  )
                : 0}
            </div>
          )
        },
      },
      {
        id: 'actions',
      },
    ],
    getCoreRowModel: getCoreRowModel(),

    // PAGINATION
    getPaginationRowModel: getPaginationRowModel(),

    // SORTING
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  function onSubmit(values: StakeLpTokenFormValues) {
    console.log({ values })
    // poolIn?.()
  }

  // APPROVE FOR ALL
  const {
    approveForAll,
    error: approveForAllError,
    isLoading: approveForAllLoading,
  } = useApproveForAll({
    args: [chainConfig.ChefContractAddress, true],
    onSuccessTx: () => {
      refetchIsApprovedForAll()
    },
  })

  const actionsButton = (position: TLpPosition) => {
    if (isApprovedForAll) {
      return (
        <StakeLpTokensButton
          position={position}
          vault={formValues.lockup}
          tokenId={position.tokenId}
          refetchDatas={() => {
            refetchDatas()
          }}
        />
      )
    } else {
      return (
        <Button
          variant="astra-blue"
          disabled={
            !approveForAll || !!approveForAllError || approveForAllLoading
          }
          isLoading={isLoading || approveForAllLoading}
          onClick={() => approveForAll?.()}
        >
          Approve
        </Button>
      )
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative col-span-6 flex flex-col justify-center gap-4 bg-gray-400/50 px-12 py-6 rounded-lg"
      >
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
                {Number(stakingScore).toFixed(2)}
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
        <div className="bg-white text-black rounded-lg p-2 flex w-full gap-2 items-center">
          <div className="flex gap-1 items-center flex-grow">
            <div className="text-sm">Select Pair:</div>
            <FormItem className="flex-grow">
              <Select
                onValueChange={(val) => setSelectedPairIdx(val)}
                defaultValue={selectedPairIdx}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="font-bold">
                    <SelectValue placeholder="Select iToken" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lpTokens?.map((lpToken, idx) => (
                    <SelectItem value={idx + ''} key={lpToken.name}>
                      {lpToken.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </div>
          <div className="flex gap-1 items-center flex-grow">
            <div className="text-sm">Select Vault:</div>
            <FormField
              control={form.control}
              name="lockup"
              render={({ field }) => (
                <FormItem className="flex-grow">
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
                        <SelectItem
                          value={period.value + ''}
                          key={period.value}
                        >
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
        </div>
        <Separator></Separator>
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&_tr]:border-0 text-left">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer py-4"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => {
                    const position = cell.row.original
                    if (cell.column.id === 'actions') {
                      return (
                        <TableCell key={cell.id}>
                          <AstraButtonAuthenticated>
                            {actionsButton(position)}
                          </AstraButtonAuthenticated>
                        </TableCell>
                      )
                    }
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="py-4">
                <TableCell colSpan={3} className="h-24 text-center">
                  <AstraLoading isLoading={isLoading}>No results.</AstraLoading>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* <div className="flex justify-center"> */}
        {/*   <AstraButtonAuthenticated>{stakeButton()}</AstraButtonAuthenticated> */}
        {/* </div> */}
      </form>
    </Form>
  )
}

const StakeLpTokensButton = ({
  vault,
  tokenId,
  refetchDatas,
}: {
  position: TLpPosition
  vault: string
  tokenId: number
  refetchDatas: () => void
}) => {
  const {
    depositNFTs,
    error: depositNFTsError,
    isLoading: depositNFTsLoading,
  } = useDepositNFTs({
    args: [BigInt(0), BigInt(vault), BigInt(tokenId), true],
    onSuccessTx: () => {
      refetchDatas()
    },
  })

  return (
    <Button
      disabled={!!depositNFTsError || depositNFTsLoading}
      isLoading={depositNFTsLoading}
      onClick={() => depositNFTs?.()}
      variant="astra-blue"
    >
      Stake LP Tokens
    </Button>
  )
}

export { StakingLpTokenStakeLpTokenCard }
