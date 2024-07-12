'use client'
import { proposalsColumns } from '@/app/governance/components/proposals-columns'
import { AstraLoading, AstraTableToggleSortButton } from '@/components'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Button,
} from '@/components/shadcn'
import { useAssetsTokenDetail } from '@/hooks'
import { TIndexComposition, TIndexCompositionWithAsset, TToken } from '@/types'
import { numberFormatter } from '@/util'
import {
  Cell,
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'

type TIndexCompositionAssetsProps = {
  tokensIndices: TIndexComposition[]
  assetsData?: TIndexCompositionWithAsset[]
  isLoading: boolean
}

const IndexCompositionAssets = ({
  assetsData = [],
}: TIndexCompositionAssetsProps) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: assetsData,
    columns: assetsColumns,
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

  return (
    <div className="h-full w-full">
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
                {row.getVisibleCells().map((cell, index) => {
                  return <CompositionRow cell={cell} key={index} />
                })}
              </TableRow>
            ))
          ) : (
            <TableRow className="py-4">
              <TableCell
                colSpan={proposalsColumns.length}
                className="h-24 text-center"
              >
                <AstraLoading isLoading={false}>No results.</AstraLoading>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {table.getCanPreviousPage() || table.getCanNextPage() ? (
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
      ) : null}
    </div>
  )
}

const assetsColumns: ColumnDef<TIndexComposition>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column} className="text-left">
          Coin
        </AstraTableToggleSortButton>
      )
    },
  },
  {
    id: 'tokenPrice',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column}>
          Price
        </AstraTableToggleSortButton>
      )
    },
  },
  {
    id: 'TVL',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column}>
          TVL
        </AstraTableToggleSortButton>
      )
    },
  },
]

async function getTokenDetail(tokenAddr: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tokens/detail/${tokenAddr}`,
    {
      next: { revalidate: 0 },
    }
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error('error', res)
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

const CompositionRow = ({
  cell,
}: {
  cell: Cell<TIndexComposition, unknown>
}) => {
  const { data: tokenDetail, isLoading } = useAssetsTokenDetail(
    cell.row.original.TOKEN_CONTRACT_ADDR
  )

  return (
    <TableCell key={cell.id}>
      <AstraLoading isLoading={isLoading}>
        {cell.column.id === 'tokenPrice'
          ? `$${numberFormatter(tokenDetail?.lastPriceUSD || 0)}`
          : cell.column.id === 'TVL'
            ? `$${numberFormatter(tokenDetail?._totalValueLockedUSD ?? 0)}`
            : flexRender(cell.column.columnDef.cell, cell.getContext())}
      </AstraLoading>
    </TableCell>
  )
}

export { IndexCompositionAssets }
