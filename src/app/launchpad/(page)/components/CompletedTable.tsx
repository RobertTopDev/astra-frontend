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
} from '@/components/shadcn'
import { TLaunchpadDetailInfo } from '@/types'
import { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CompletedTableColumns } from './CompletedTableColumns'
import {
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'

interface DataTableProps {
  data: TLaunchpadDetailInfo[]
  hasPageSize?: boolean
  className?: string
  children?: ReactNode
}

export default function CompletedTable({ data, children }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const router = useRouter()

  const table = useReactTable({
    data,
    columns: CompletedTableColumns,
    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <Card className="w-full relative border-0 col-span-1 rounded-3xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl p-10">
      <CardContent className="p-0">
        <div className="rounded-md flex flex-col gap-6 relative">
          {children}
          <Table>
            <TableHeader className=" [&_tr]:border-white">
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
                      router.push(
                        `/launchpad/buy/${row.original.ID}`
                      )
                    }}
                    className="cursor-pointer [&_td]:p-4"
                  >
                    {row.getVisibleCells().map((cell) => {
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
                    colSpan={CompletedTableColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
