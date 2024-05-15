'use client'

import { TPool } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { numberFormatter } from '@/util'
import { AstraTableToggleSortButton } from '@/components'

export const liquidityPoolsColumns: ColumnDef<TPool>[] = [
  {
    accessorKey: 'TOKEN0_NAME',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column} className="text-left">
          Name
        </AstraTableToggleSortButton>
      )
    },

    cell: ({ row }) => {
      const index = row.original

      return (
        <div>
          {index.TOKEN0_SYMBOL} / {index.TOKEN1_SYMBOL}
        </div>
      )
    },
  },
  {
    accessorKey: 'STAKING',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column} className="text-left">
          Staking
        </AstraTableToggleSortButton>
      )
    },

    cell: () => {
      return <div>{'Yes'}</div>
    },
  },
  {
    accessorKey: 'EXCHANGE',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column} className="text-left">
          Exchange
        </AstraTableToggleSortButton>
      )
    },

    cell: ({ row }) => {
      const index = row.original

      return (
        <div>
          {!index.EXCHANGE || index.EXCHANGE === 'univ3'
            ? 'Uniswap'
            : index.EXCHANGE === 'sushi'
              ? 'Sushiswap'
              : index?.EXCHANGE}
        </div>
      )
    },
  },
  {
    accessorKey: 'LIQUIDITY',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column} className="text-left">
          Liquidity
        </AstraTableToggleSortButton>
      )
    },

    cell: ({ row }) => {
      const index = row.original

      return <div>{numberFormatter(index.LIQUIDITY)}</div>
    },
  },
  {
    id: 'APY',
    accessorKey: 'APY',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column} className="text-left">
          APY
        </AstraTableToggleSortButton>
      )
    },
  },
  {
    id: 'actions',
  },
]
