'use client'
import { IndexCompositionPieChart } from '@/app/indices/[tokenAddress]/sections/index-body/index-composition-pie-chart'
import { AstraLoading, AstraTableToggleSortButton } from '@/components'
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  Form,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn'
import { TIndex, TIndexCompositionWithAsset, TToken } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { WeightInput } from './weight-input'
import { useAllTokens, useUpdateIndex } from '@/hooks'
import { SelectTokens } from './select-tokens'
import { TrashIcon } from '@radix-ui/react-icons'
import { add, differenceInHours } from 'date-fns'

const rebalanceIndexFormSchema = z.object({
  weights: z
    .array(
      z
        .string({ required_error: 'Weight is required' })
        .regex(/^(100|([1-9]?[0-9]|0))%$/, {
          message: 'Invalid Weight value',
        }),
      { required_error: 'Indices Tokens should not be empty' }
    )
    .min(1, { message: 'Indices Tokens should not be empty' })
    .refine(
      (val) =>
        Math.abs(
          val.map((v) => Number(v.slice(0, -1))).reduce((a, b) => a + b, 0) -
            100
        ) === 0,
      {
        message: 'Weights should total to 100',
      }
    ),
})

export type RebalanceIndexFormValues = z.infer<typeof rebalanceIndexFormSchema>

type TRebalanceModalProps = {
  rebalanceModal: boolean
  setRebalanceModal: (arg0: boolean) => void
  selectedIndex: TIndex | undefined
  assetsData: TIndexCompositionWithAsset[] | undefined
  isLoading: boolean
  refetchDatas: () => void
}

const RebalanceModal = ({
  rebalanceModal,
  setRebalanceModal,
  selectedIndex,
  assetsData,
  isLoading,
  refetchDatas,
}: TRebalanceModalProps) => {
  const { data: allTokens = [], isLoading: allTokensLoading } = useAllTokens({})
  const [selectedTokens, setSelectedTokens] = useState<
    TIndexCompositionWithAsset[]
  >(assetsData ?? [])
  const [tokenDialog, setTokenDialog] = useState<boolean>(false)
  const toggleSelected = (token: TToken) => {
    if (selectedTokens.some((stok) => stok.TOKEN_CONTRACT_ADDR === token.id)) {
      setSelectedTokens((prev) =>
        prev.filter((t) => t.TOKEN_CONTRACT_ADDR !== token.id)
      )
      return
    } else {
      const newToken = {
        TOKEN_CONTRACT_ADDR: token.id as `0x${string}`,
        TOKEN_WEIGHT: '0',
        name: token.name,
      } as TIndexCompositionWithAsset
      setSelectedTokens((prev) => [...prev, newToken])
    }
  }

  useEffect(() => {
    if (assetsData !== undefined && selectedTokens.length === 0)
      setSelectedTokens(assetsData)
  }, [assetsData])

  useEffect(() => {
    if (selectedIndex !== undefined) {
      setSelectedTokens(assetsData ?? [])
    }
  }, [selectedIndex])

  const form = useForm<RebalanceIndexFormValues>({
    resolver: zodResolver(rebalanceIndexFormSchema),
    delayError: 300,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      weights: assetsData?.map((asset) => asset.TOKEN_WEIGHT + '%') ?? [],
    },
  })
  const formValues = form.watch()

  const [editingIndex, setEditingIndex] = useState<boolean | undefined>(false)

  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data: selectedTokens ?? [],
    columns: tokensIndicesColumns,
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

  const lastrebalancetime = useMemo(() => {
    if (selectedIndex === undefined) return undefined
    const date = new Date(Number(selectedIndex.LAST_REBALANCE) * 1000)
    return date
  }, [selectedIndex])

  const nextrebalancetime = useMemo(() => {
    if (selectedIndex === undefined) return undefined
    const date = new Date(Number(selectedIndex.REBAL_TIME) * 1000)
    return date
  }, [selectedIndex])

  const diffHoursBetweenLastAndCurrentRebalance = useMemo(() => {
    if (lastrebalancetime === undefined || nextrebalancetime === undefined)
      return 0
    return differenceInHours(nextrebalancetime, lastrebalancetime)
  }, [lastrebalancetime, nextrebalancetime])

  const rebalancingStatus = useMemo(() => {
    const hours = diffHoursBetweenLastAndCurrentRebalance

    if (hours <= 60) {
      return 'days'
    } else if (hours <= 168) {
      return 'weeks'
    } else if (hours <= 504) {
      return 'quarterly'
    } else if (hours <= 730.001) {
      return 'months'
    } else if (hours > 730.001) {
      return 'years'
    } else {
      return 'days'
    }
  }, [diffHoursBetweenLastAndCurrentRebalance])

  const nextRebalanceTime = useMemo(() => {
    switch (rebalancingStatus) {
      case 'days':
        return add(new Date(), { days: 1 })
      case 'weeks':
        return add(new Date(), { weeks: 1 })
      case 'months':
        return add(new Date(), { months: 1 })
      case 'quarterly':
        return add(new Date(), { months: 3 })
      case 'years':
        return add(new Date(), { years: 1 })
      default:
        return add(new Date(), { days: 1 })
    }
  }, [rebalancingStatus])

  const { updateIndex, refetch: refetchUpdateIndex } = useUpdateIndex({
    args:
      form.formState.isValid && selectedIndex !== undefined
        ? [
            selectedTokens.map((token) => token.TOKEN_CONTRACT_ADDR),
            formValues.weights.map((weight) => BigInt(weight.slice(0, -1))),
            BigInt(selectedIndex?.TVL ?? 0),
            BigInt(Math.ceil(nextRebalanceTime.getTime() / 1000)),
            BigInt(selectedIndex?.ITOKEN_INDEX),
          ]
        : undefined,
    enabled: form.formState.isValid && selectedIndex !== undefined,
    onSuccessTx: () => {
      setRebalanceModal(false)
      setEditingIndex(undefined)
      refetchDatas()
    },
  })

  useEffect(() => {
    if (form.formState.isValid) {
      refetchUpdateIndex()
    }
  }, [formValues.weights, form.formState.isValid])

  function onSubmit() {
    updateIndex?.()
  }

  return (
    <Dialog
      open={rebalanceModal}
      onOpenChange={() => {
        setRebalanceModal(false)
        setEditingIndex(undefined)
        form.reset()
      }}
    >
      {editingIndex ? (
        <DialogContent className="sm:max-w-3xl max-h-[90vh] bg-white text-black">
          <DialogHeader className="text-xl text-center w-full justify-center">
            Editing Index
          </DialogHeader>

          <div className="flex flex-col gap-6 justify-center">
            {selectedIndex === undefined || assetsData === undefined ? (
              <div className="flex items-center justify-center min-h-[60vh] w-full h-full">
                <AstraLoading isLoading={isLoading} />
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                  >
                    <Card
                      className={clsx(
                        'w-full border-0 col-span-1 bg-transaparent bg-[#15192b]'
                      )}
                    >
                      <CardContent className="lg:p-6 p-0">
                        <Table>
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
                                  key={row.id}
                                  data-state={row.getIsSelected() && 'selected'}
                                  className="cursor-pointer"
                                >
                                  {row.getVisibleCells().map((cell) => {
                                    if (cell.column.id === 'actions') {
                                      return (
                                        <TableCell key={cell.id}>
                                          <TrashIcon
                                            className="w-6 h-6 text-white"
                                            onClick={() => {
                                              form.setValue(
                                                `weights`,
                                                form
                                                  .getValues('weights')
                                                  .filter(
                                                    (_, i) =>
                                                      i !== cell.row.index
                                                  )
                                              )
                                              toggleSelected({
                                                id: cell.row.original
                                                  .TOKEN_CONTRACT_ADDR,
                                                name:
                                                  cell.row.original.name ?? '',
                                              })
                                            }}
                                          />
                                        </TableCell>
                                      )
                                    }
                                    if (cell.column.id === 'current') {
                                      return (
                                        <TableCell key={cell.id}>
                                          <div className="flex gap-2 justify-center">
                                            {cell.row.original.TOKEN_WEIGHT ??
                                              0}
                                            %
                                          </div>
                                        </TableCell>
                                      )
                                    }
                                    if (cell.column.id === 'new') {
                                      return (
                                        <TableCell key={cell.id}>
                                          <div className="flex gap-2 justify-center">
                                            <WeightInput
                                              index={cell.row.index}
                                              form={form}
                                            />
                                          </div>
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
                              <TableRow>
                                <TableCell
                                  colSpan={tokensIndicesColumns.length}
                                  className="h-24 text-center"
                                >
                                  No results.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                        <div className="flex justify-end">
                          <SelectTokens
                            selectedTokens={selectedTokens}
                            allTokens={allTokens}
                            allTokensLoading={allTokensLoading}
                            toggleSelected={toggleSelected}
                            tokenDialog={tokenDialog}
                            setTokenDialog={setTokenDialog}
                            form={form}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex justify-center items-center">
                      <Button variant="astra-blue" type="submit">
                        Rebalance
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-xl max-h-[90vh] bg-white text-black">
          <DialogHeader className="text-xl text-center w-full justify-center">
            Rebalance Index
          </DialogHeader>

          <div className="flex flex-col gap-6 justify-center">
            {selectedIndex === undefined || assetsData === undefined ? (
              <div className="flex items-center justify-center min-h-[60vh] w-full h-full">
                <AstraLoading isLoading={isLoading} />
              </div>
            ) : (
              <>
                <IndexCompositionPieChart assetsData={assetsData} />
                <div className="flex justify-center items-center">
                  <Button
                    variant="astra-blue"
                    onClick={() => setEditingIndex(true)}
                  >
                    Edit Index
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}

const tokensIndicesColumns: ColumnDef<TIndexCompositionWithAsset>[] = [
  {
    accessorKey: 'name',
    // header: () => <div className="text-left">Index</div>,
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column} className="text-left">
          Coin
        </AstraTableToggleSortButton>
      )
    },
  },
  {
    accessorKey: 'holdings',
    // header: () => <div className="text-left">Index</div>,
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column} className="text-left">
          Price
        </AstraTableToggleSortButton>
      )
    },
    cell: ({ row }) => {
      return <div>{row.original.holdings ?? 0}</div>
    },
  },
  {
    id: 'current',
    header: () => {
      return <div className="text-center">Current %</div>
    },
  },
  {
    id: 'new',
    header: () => {
      return <div className="text-center">New %</div>
    },
  },
  {
    id: 'actions',
    // cell: ({ row }) => {
    //   const index = row.original

    //   return (
    //     <Link href={`/indices/${index.ITOKEN_ADDR}`}>
    //       <Button>Invest</Button>
    //     </Link>
    //   )
    // },
  },
]

export { RebalanceModal }
