'use client'
import {
  Card,
  CardContent,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn'
import { cn } from '@/lib'
import { TIndex } from '@/types'
import {
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { ReactNode, useState } from 'react'
import { indicesColumns } from '.'
import { useRouter } from 'next/navigation'
import { useGetAllITokens } from '@/hooks'
import Link from 'next/link'

interface DataTableProps {
  data: TIndex[]
  hasPageSize?: boolean
  className?: string
  children?: ReactNode
}
export function IndicesTable({
  data,
  hasPageSize = false,
  children,
  className,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const router = useRouter()
  const { data: iTokens } = useGetAllITokens({})

  const table = useReactTable({
    data,
    columns: indicesColumns,
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
    <Card
      className={cn(
        // styles['indices-table'],
        'w-full relative border-0 col-span-1 rounded-3xl bg-[#15192b] p-10',
        className
      )}
    >
      {/* <div className="absolute top-10 right-10"> */}
      {/*   <UpdateIcon */}
      {/*     className="cursor-pointer" */}
      {/*     onClick={() => revalidateIndices()} */}
      {/*   /> */}
      {/* </div> */}
      <CardContent className="lg:p-6 p-0">
        <div className="rounded-md flex flex-col gap-6 relative">
          {children}
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
                    onClick={() => {
                      router.push(`/indices/${row.original.ITOKEN_ADDR}`)
                    }}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const index = cell.row.original
                      if (cell.column.id === 'staking') {
                        return (
                          <TableCell key={cell.id}>
                            {iTokens?.some(
                              (iToken) =>
                                iToken.contractAddress === index.ITOKEN_ADDR
                            )
                              ? 'Yes'
                              : 'No'}
                          </TableCell>
                        )
                      }
                      if (cell.column.id === 'actions') {
                        return (
                          <TableCell key={cell.id}>
                            {index.IS_DELISTED ? (
                              <div className="flex">
                                <div className="text-xs bg-red-500 text-white px-3 py-1">
                                  Index Closed
                                </div>
                              </div>
                            ) : (
                              <Link href={`/indices/${index.ITOKEN_ADDR}`}>
                                <Button size="sm">Invest</Button>
                              </Link>
                            )}
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
                    colSpan={indicesColumns.length}
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
          {hasPageSize ? (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <Select
                onValueChange={(e) => {
                  table.setPageSize(Number(e))
                }}
                defaultValue={table.getState().pagination.pageSize + ''}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Page Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Page Size</SelectLabel>
                    <SelectItem value="10">Show 10</SelectItem>
                    <SelectItem value="50">Show 50</SelectItem>
                    <SelectItem value="100">Show 100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
