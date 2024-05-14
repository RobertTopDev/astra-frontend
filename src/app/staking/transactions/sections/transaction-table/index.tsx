'use client'

import { AstraLink, AstraTableToggleSortButton } from '@/components'
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn'
import { TTransaction } from '@/types'
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
import { useChainConfig, useTransactions } from '@/hooks'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { numberFormatter } from '@/util'
import Loading from '@/app/loading'

interface DataTableProps {}

export function TransactionsTable({}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const { address } = useAccount()
  const { data: transactions = [], isLoading: transactionsLoading } =
    useTransactions({})

  const transactionsFiltered: TTransaction[] = useMemo(() => {
    return transactions.map((element) => {
      const method = element.METHOD?.split('(')[0]
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str: string) => str?.toUpperCase())
      let asset =
        element.TYPE === 'ASTRA_STAKING'
          ? 'ASTRADAO'
          : element.TYPE === 'LP_STAKING'
            ? 'iToken'
            : element.TYPE === 'INDICE'
              ? 'INDEX'
              : element.TYPE
      if (element.ASSET === 'ASTRA' && element.TOKEN_SYMBOL === 'UNI-V3-POS') {
        asset = 'LM_STAKING'
      }
      const vault =
        element.VAULT !== '' && element.VAULT !== null
          ? element.VAULT === 0
            ? 'No Lockup'
            : `${element.VAULT} Months`
          : 'N/A'
      let amount
      let event
      switch (element.EVENT) {
        case 'ADDPUBLICPOOL':
          amount = 'N/A'
          break
        case 'CLAIMASTRA':
          event = 'ASTRADAO CLAIMED'
          break
        case 'RESTAKEASTRAREWARD':
          event = 'ASTRADAO REWARDS RESTAKED'
          break
        case 'UPDATEPOOL':
          event = 'INDEX REBALANCED'
          amount = 'N/A'
          break
        case 'ADDPUBLICPOOL':
          event = 'CREATE'
          break
        case 'POOLIN':
          event = 'INVEST'
          break
        default:
          break
      }
      if (
        element.EVENT === 'WITHDRAW' &&
        element.TYPE === 'ASTRA_STAKING' &&
        !!element.AMOUNT
      ) {
        event = 'COOLDOWN ACTIVATED'
        amount = 'N/A'
      }

      const tokenSymbol =
        element.TOKEN_SYMBOL === 'ASTRA' ? 'ASTRADAO' : element.TOKEN_SYMBOL

      // MMM DD, YYYY, hh:MM:ss A
      const txDate = format(
        new Date(element.TRANSACTION_DATE_TIME),
        'MMM dd, yyyy, HH:mm:ss xx'
      )

      return {
        ...element,
        METHOD: method,
        AMOUNT: amount || element.AMOUNT,
        EVENT: event || element.EVENT,
        TYPE: asset,
        VAULT: vault || element.VAULT,
        TOKEN_SYMBOL: tokenSymbol,
        TRANSACTION_DATE_TIME: txDate,
      }
    })
  }, [transactions])
  const router = useRouter()
  const { chain } = useChainConfig()

  const transactionsColumns: ColumnDef<TTransaction, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'TRANSACTION_DATE_TIME',
        // header: () => <div className="text-left">Index</div>,
        header: ({ column }) => {
          return (
            <AstraTableToggleSortButton
              column={column}
              className="p-0 m-0 text-left"
            >
              Date and Time
            </AstraTableToggleSortButton>
          )
        },

        cell: ({ row }) => {
          const tx = row.original
          // const accountAddress = row.getValue('ITOKEN_ADDR') as string
          // const name = row.getValue('ITOKENNAME') as string

          return <div className="w-fit pl-5">{tx.TRANSACTION_DATE_TIME}</div>
        },
      },
      {
        accessorKey: 'EVENT',
        header: ({ column }) => (
          <AstraTableToggleSortButton
            column={column}
            className="p-0 m-0 text-left"
          >
            Transaction Type
          </AstraTableToggleSortButton>
        ),
        cell: ({ row }) => {
          const tx = row.original
          // const accountAddress = row.getValue('ITOKEN_ADDR') as string
          // const name = row.getValue('ITOKENNAME') as string

          return <div className="w-fit pl-5">{tx.EVENT}</div>
        },
      },
      {
        accessorKey: 'AMOUNT',
        // header: 'ROI',

        header: ({ column }) => {
          return (
            <AstraTableToggleSortButton
              column={column}
              className="p-0 m-0 text-left"
            >
              Amount
            </AstraTableToggleSortButton>
          )
        },
        cell: ({ row }) => {
          const tx = row.original

          return (
            <div className="w-fit pl-5">
              {typeof tx.AMOUNT === 'string'
                ? tx.AMOUNT
                : tx.AMOUNT === null
                  ? ''
                  : numberFormatter(tx.AMOUNT)}
            </div>
          )
        },
      },
      {
        accessorKey: 'VAULT',
        // header: 'Risk Score',
        header: ({ column }) => {
          return (
            <AstraTableToggleSortButton
              column={column}
              className="p-0 m-0 text-left"
            >
              Lockup
            </AstraTableToggleSortButton>
          )
        },
        cell: ({ row }) => {
          const tx = row.original

          return <div className="w-fit pl-5">{tx.VAULT ? tx.VAULT : 0}</div>
        },
      },
      {
        accessorKey: 'TYPE',
        // header: 'Risk Score',
        header: ({ column }) => {
          return (
            <AstraTableToggleSortButton
              column={column}
              className="p-0 m-0 text-left"
            >
              Asset
            </AstraTableToggleSortButton>
          )
        },
        cell: ({ row }) => {
          const tx = row.original
          const asset =
            tx.TYPE === 'ASTRA_STAKING'
              ? 'ASTRADAO'
              : tx.TYPE === 'ASTRA'
                ? 'ASTRADAO'
                : tx.TYPE === 'LP_STAKING'
                  ? 'iToken'
                  : tx.TYPE === 'INDICE'
                    ? 'INDEX'
                    : tx.TYPE

          return <div className="w-fit pl-5">{asset}</div>
        },
      },
      {
        accessorKey: 'TRANSACTION_HASH',
        // header: 'Risk Score',
        header: ({ column }) => {
          return (
            <AstraTableToggleSortButton
              column={column}
              className="p-0 m-0 text-left"
            >
              TxID
            </AstraTableToggleSortButton>
          )
        },
        cell: ({ row }) => {
          const tx = row.original

          return (
            <div className="w-fit pl-5">
              <AstraLink
                link={`${chain?.blockExplorers?.default.url}/tx/${tx.TRANSACTION_HASH}`}
              >
                {tx.TRANSACTION_HASH.slice(0, 6)}...
                {tx.TRANSACTION_HASH.slice(-4)}
              </AstraLink>
            </div>
          )
        },
      },
      // {
      //   accessorKey: 'Status',
      //   // header: 'Risk Score',
      //   header: ({ column }) => {
      //     return <ToggleSortButton column={column}>Status</ToggleSortButton>
      //   },
      //   cell: ({ row }) => {
      //     const tx = row.original

      //     return (
      //       <div className="w-fit">
      //         <AstraLink
      //           link={`${chain?.blockExplorers?.default.url}/tx/${tx.TRANSACTION_HASH}`}
      //         >
      //           {tx.TRANSACTION_HASH.slice(0, 6)}...{tx.TRANSACTION_HASH.slice(-4)}
      //         </AstraLink>
      //       </div>
      //     )
      //   },
      // },
    ],
    [chain]
  )

  const table = useReactTable({
    data: transactionsFiltered,
    columns: transactionsColumns,
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

  useEffect(() => {
    if (!address) router.push('/')
  }, [address])

  if (transactionsLoading) return <Loading />

  return (
    <Card
      className={clsx(
        'w-full relative border-0 col-span-1 bg-transaparent p-10'
      )}
    >
      <CardContent className="lg:p-6 p-0">
        <div className="rounded-md">
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={transactionsColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {transactionsFiltered?.length > 0 && (
          <div className="flex items-center justify-center space-x-2 py-4">
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
        )}
      </CardContent>
    </Card>
  )
}
