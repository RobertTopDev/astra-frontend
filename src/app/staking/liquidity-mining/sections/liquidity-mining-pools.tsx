'use client'
import { AstraInputSearch, AstraLink } from '@/components'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn'
import { useChainConfig } from '@/hooks'
import { TLiquidityMiningDetails, TPool } from '@/types'
import React from 'react'
import { liquidityPoolsColumns } from './liquidity-pools-table-columns'
import {
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table'
import { numberFormatter, shorten } from '@/util'
import Link from 'next/link'

const LiquidityMiningTableRows = ({
  row,
  averageAPY,
  networkURL,
}: {
  row: Row<TPool>
  averageAPY: string
  networkURL: string
}) => {
  const [isExpanded, toggleExpanded] = React.useReducer((p) => !p, false)
  return (
    <>
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell) => {
          if (cell.column.id === 'actions') {
            return (
              <TableCell key={cell.id}>
                <div className="flex gap-2 justify-center">
                  <div onClick={() => toggleExpanded()}>
                    {isExpanded ? 'hide' : 'show'}&nbsp;&nbsp;
                    <span className="text-astra-blue">
                      {isExpanded ? '⮙' : '⮛'}
                    </span>
                  </div>
                </div>
              </TableCell>
            )
          } else if (cell.column.id === 'APY') {
            return (
              <TableCell key={cell.id}>
                {numberFormatter(averageAPY, true)}
              </TableCell>
            )
          }
          return (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          )
        })}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={4}>
            <div className="flex items-center justify-between flex-wrap bg-[#292944] rounded-lg p-4 mb-3">
              <div className="item flex items-center">
                <h3 className="text-white text-base font-roboto font-normal mr-5">
                  Pool Contract Address:
                </h3>
                <p className="proposer">
                  <a
                    href={networkURL + 'address/' + row.original.PAIRADDRESS}
                    target="_blank"
                    className="text-[#00e7ff] underline text-sm font-roboto font-medium leading-tight tracking-wider"
                  >
                    {shorten(row.original.PAIRADDRESS)}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex gap-4 justify-between">
              <AstraLink
                link={
                  'https://app.uniswap.org/#/add/' +
                  row.original?.TOKEN0_ID +
                  '/' +
                  row.original?.TOKEN1_ID +
                  '/3000'
                }
              >
                <Button variant="astra-blue" className="w-full">
                  Add Liquidity
                </Button>
              </AstraLink>
              <Link href="/staking/lp-tokens">
                <Button variant="astra-blue" className="w-full">
                  Stake/Unstake LP Tokens
                </Button>
              </Link>
              <AstraLink link={'https://app.uniswap.org/#/pools'}>
                <Button variant="astra-blue" className="w-full">
                  Remove Liquidity
                </Button>
              </AstraLink>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

type TLiquidityMiningPoolsProps = {
  pools: TPool[]
  liquidityMiningDetails: TLiquidityMiningDetails
}

const LiquidityMiningPools = ({
  pools,
  liquidityMiningDetails,
}: TLiquidityMiningPoolsProps) => {
  const { chainConfig } = useChainConfig()
  const table = useReactTable({
    data: pools,
    columns: liquidityPoolsColumns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <div
      className="py-8 px-16 rounded-xl items-center w-full flex flex-col gap-4"
      style={{
        background:
          'linear-gradient(269.95deg, #2c2c51 0.04%, #636389 108.31%)',
      }}
    >
      <div className="flex justify-between w-full">
        <div className="text-xl font-bold">POOLS</div>
        <div className="flex gap-4">
          <AstraInputSearch />
          <AstraLink
            link={
              'https://app.uniswap.org/#/add/ETH/' +
              chainConfig.AstraContractAddress
            }
          >
            <Button variant="astra-white">CREATE UNISWAP POOL</Button>
          </AstraLink>
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
            table
              .getRowModel()
              .rows.map((row, index) => (
                <LiquidityMiningTableRows
                  key={index}
                  row={row}
                  averageAPY={liquidityMiningDetails.averageAPY}
                  networkURL={chainConfig.networkURL}
                />
              ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={liquidityPoolsColumns.length}
                className="h-24 text-center"
              >
                No proposal actions.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export { LiquidityMiningPools }
