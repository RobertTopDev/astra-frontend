'use client'

import { AstraTableToggleSortButton, UserAvatar } from '@/components'
import { TStakers } from '@/types'
import { ColumnDef } from '@tanstack/react-table'

export const stakersColumns: ColumnDef<TStakers>[] = [
  {
    accessorKey: 'ADDRESS',
    header: () => {
      return <div className="text-left">Rank</div>
    },

    cell: ({ row }) => {
      const index = row.original

      return (
        <div className="w-fit flex items-center gap-4">
          <span>{row.index + 1}</span>
          <UserAvatar isForTable address={index.ADDRESS} />
        </div>
      )
    },
  },
  {
    accessorKey: 'STAKINGSCORE',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column}>
          Staking Score
        </AstraTableToggleSortButton>
      )
    },
    cell: ({ row }) => {
      const index = row.original

      return <div className="text-center">{index.STAKINGSCORE}</div>
    },
  },
  {
    accessorKey: 'REWARDMULTIPLER',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column}>
          Voting Power
        </AstraTableToggleSortButton>
      )
    },
    cell: ({ row }) => {
      const index = row.original

      return (
        <div className="text-center">
          {(Number(index.REWARDMULTIPLER) / 10).toFixed(2)}
        </div>
      )
    },
  },
]
