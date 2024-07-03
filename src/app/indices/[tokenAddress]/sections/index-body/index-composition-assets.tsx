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
import { useTokenDetail } from '@/hooks'
import { TIndexComposition, TIndexCompositionWithAsset } from '@/types'
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
import { useState } from 'react'

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
    // cell: ({ row }) => {
    //   const index = row.original

    //   return (
    //     <div className="w-96">
    //       <div className="text-center [&>*]:overflow-hidden [&>*]:overflow-ellipsis [&>*]:whitespace-nowrap ">
    //         {parse(index.description ? index.description : index.DESCRIPTION)}
    //       </div>
    //     </div>
    //   )
    // },
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
  // {
  //   id: 'holdings',
  // },
]

const CompositionRow = ({
  cell,
}: {
  cell: Cell<TIndexComposition, unknown>
}) => {
  const { data: tokenDetail, isLoading: tokenDetailLoading } = useTokenDetail({
    contractAddress: cell.row.original.TOKEN_CONTRACT_ADDR,
  })

  if (cell.column.id === 'tokenPrice') {
    return (
      <TableCell key={cell.id}>
        <AstraLoading isLoading={tokenDetailLoading}>
          {tokenDetail?.lastPriceUSD
            ? `$${numberFormatter(tokenDetail?.lastPriceUSD)}`
            : '-'}
        </AstraLoading>
      </TableCell>
    )
  }
  if (cell.column.id === 'TVL') {
    return (
      <TableCell key={cell.id}>
        <AstraLoading isLoading={tokenDetailLoading}>
          {tokenDetail?._totalValueLockedUSD
            ? `$${numberFormatter(tokenDetail?._totalValueLockedUSD)}`
            : '-'}
        </AstraLoading>
      </TableCell>
    )
  }
  return (
    <TableCell key={cell.id}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  )
}

export { IndexCompositionAssets }
