'use client'

import {
  AstraHeader,
  AstraLoading,
  AstraTableToggleSortButton,
  UserAvatar,
} from '@/components'
import {
  Button,
  Card,
  CardContent,
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
import ProgressBar from '@/components/progressbar'
import { TIndex } from '@/types'
import { millifyText, getRiskScoreColor } from '@/util'
import { InfoCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

type TPortfolioIndicesProps = {
  userIndices: TIndex[] | undefined
  userIndicesLoading: boolean
  setWithdrawIndex: (value: number | undefined) => void
  setSelected: (value: string | undefined) => void
}

const PortfolioIndices = ({
  userIndices,
  userIndicesLoading,
  setWithdrawIndex,
  setSelected,
}: TPortfolioIndicesProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const portfolioIndicesColumns: ColumnDef<TIndex>[] = useMemo(
    () => [
      {
        accessorKey: 'ITOKENNAME',
        // header: () => <div className="text-left">Index</div>,
        header: ({ column }) => {
          return (
            <AstraTableToggleSortButton column={column}>
              Index
            </AstraTableToggleSortButton>
          )
        },

        cell: ({ row }) => {
          const index = row.original
          // const accountAddress = row.getValue('ITOKEN_ADDR') as string
          // const name = row.getValue('ITOKENNAME') as string

          return (
            <div className="w-fit">
              <UserAvatar
                onClick={() => {
                  setSelected(index.ITOKEN_INDEX)
                }}
                isForTable
                address={index.OWNER}
                name={index.ITOKENNAME}
              />
            </div>
          )
          // shorten(accountAddress)
        },
      },
      {
        accessorKey: 'TVL',
        header: ({ column }) => (
          <div className="text-center flex items-center justify-center w-full">
            <div className="flex">
              <AstraTableToggleSortButton column={column}>
                TVL
              </AstraTableToggleSortButton>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="reset">
                    <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Threshold is the TVL required to start an index. <br />
                      &nbsp; Locked is the current TVL of the index.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ),
        cell: ({ row }) => {
          const index = row.original

          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <ProgressBar
                  value={index.TVL_REQUIRED_TO_START_INDEX_PER}
                  className="flex-grow"
                />

                {index.TVL_REQUIRED_TO_START_INDEX_PER < 100 ? (
                  <div>{index.TVL_REQUIRED_TO_START_INDEX_PER}%</div>
                ) : (
                  <div>
                    <CheckCircledIcon />
                  </div>
                )}
              </div>
              <p className="text-left text-xs font-bold">
                Threshold:&nbsp;
                {index?.thresold_display
                  ? '$' + millifyText(index?.thresold_display)
                  : '$0'}
                &nbsp; | Locked: $
                {millifyText(Math.round(index.TVL) / Math.pow(10, 6))}
              </p>
            </div>
          )
        },
      },
      {
        accessorKey: 'ROI',
        // header: 'ROI',

        header: ({ column }) => {
          return (
            <AstraTableToggleSortButton column={column}>
              ROI
            </AstraTableToggleSortButton>
          )
        },
        cell: ({ row }) => {
          const index = row.original

          return (
            <div className="text-center">
              {index?.ROI_NEW
                ? parseFloat(index?.ROI_NEW).toFixed(2) + '%'
                : 'N/A'}
            </div>
          )
        },
      },
      {
        accessorKey: 'RISK_SCORE',
        // header: 'Risk Score',
        header: ({ column }) => {
          return (
            <AstraTableToggleSortButton column={column}>
              Risk Score
            </AstraTableToggleSortButton>
          )
        },
        cell: ({ row }) => {
          const index = row.original

          return (
            <div
              className={`${getRiskScoreColor(
                !!index ? index?.RISK_SCORE_NEW : 0
              )} text-center`}
            >
              {index?.RISK_SCORE_NEW ? index?.RISK_SCORE_NEW + '/5' : 'N/A'}&nbsp;
            </div>
          )
        },
      },
      // TODO: FETCH if Index is eligible for staking
      // {
      //   accessorKey: 'amount',
      //   header: 'Staking',
      //   cell: ({ row }) => {},
      // },
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
    ],
    [setSelected]
  )

  const table = useReactTable({
    data: userIndices ?? [],
    columns: portfolioIndicesColumns,
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
  return userIndicesLoading ||
    userIndices === undefined ||
    userIndices.length === 0 ? null : (
    <div className="relative z-10 container mx-auto w-full pb-20 flex flex-col gap-6 items-center">
      <Separator></Separator>
      <AstraHeader>MY INDICES</AstraHeader>
      {userIndices !== undefined ? (
        <Card className="w-full relative border-0 col-span-1 rounded-3xl bg-[#15192b] p-10">
          <CardContent className="lg:p-6 p-0">
            <div className="rounded-md flex flex-col gap-6">
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
                        onClick={() => {
                          setSelected(row.original.ITOKEN_INDEX)
                        }}
                      >
                        {row.getVisibleCells().map((cell) => {
                          if (cell.column.id === 'actions') {
                            return (
                              <TableCell key={cell.id}>
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    variant="astra-blue"
                                    size="sm"
                                    className="px-2"
                                    onClick={() =>
                                      setWithdrawIndex(
                                        Number(cell.row.original.ITOKEN_INDEX)
                                      )
                                    }
                                  >
                                    Withdraw
                                  </Button>
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
                        colSpan={portfolioIndicesColumns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="relative flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <AstraLoading isLoading={userIndicesLoading} />
        </div>
      )}
    </div>
  )
}

export { PortfolioIndices }
