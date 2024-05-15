'use client'
import { AstraHeader, AstraLoading } from '@/components'
import { useAllProposals } from '@/hooks'
import { useMemo, useState } from 'react'
import { proposalsColumns } from '../../components/proposals-columns'
import {
  Button,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn'
import { cn } from '@/lib'
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { ProposalTitleCell } from './sections/proposal-title-cell'

const FILTER_OPTIONS = [
  'All',
  'Pending',
  'Active',
  'Cancelled',
  'Succeeded',
  'Queued',
  'Expired',
  'Executed',
]

const AllProposalsPage = () => {
  const [filter, setFilter] = useState(FILTER_OPTIONS[0])
  const { data: proposals = [], isLoading: proposalsLoading } = useAllProposals(
    { limit: 1000 }
  )
  const router = useRouter()

  const filteredProposals = useMemo(
    () =>
      proposals?.filter((proposal) => {
        if (filter === 'All') return true
        else {
          const idx = FILTER_OPTIONS.indexOf(filter)
          if (idx === 2) {
            return proposal.status === idx || proposal.status === 3
          }
          return proposal.status === idx
        }
      }),
    [filter, proposals]
  )

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: filteredProposals,
    columns: proposalsColumns,
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
    <div className="relative w-full container py-20">
      {!!proposals && (
        <Card
          className={cn(
            'w-full relative border-0 col-span-1 rounded-3xl bg-[#15192b] p-10'
          )}
        >
          <CardContent className="lg:p-6 p-0">
            <div className="rounded-md flex flex-col gap-6">
              <div className="w-full relative">
                <AstraHeader>Proposals</AstraHeader>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <Select onValueChange={setFilter} defaultValue={filter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Filter Proposal</SelectLabel>
                        {FILTER_OPTIONS.map((filter) => (
                          <SelectItem value={filter} key={filter}>
                            {filter}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                        className="cursor-pointer"
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        onClick={() =>
                          router.push(
                            `/governance/proposals/${row.original.ID}`
                          )
                        }
                      >
                        {row.getVisibleCells().map((cell) => {
                          const proposal = cell.row.original
                          if (cell.column.id === 'title') {
                            return (
                              <TableCell key={cell.id}>
                                <ProposalTitleCell proposal={proposal} />
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
                        colSpan={proposalsColumns.length}
                        className="h-24 text-center"
                      >
                        <AstraLoading isLoading={proposalsLoading}>
                          No results.
                        </AstraLoading>
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AllProposalsPage
