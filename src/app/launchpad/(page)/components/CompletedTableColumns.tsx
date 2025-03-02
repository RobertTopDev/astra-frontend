'use client'

import { UserAvatar } from '@/components'
import { TLaunchpadDetailInfo } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { TotalRaised } from './TotalRaised'

export const CompletedTableColumns: ColumnDef<TLaunchpadDetailInfo>[] = [
  {
    accessorKey: 'projects',
    header: 'Projects',
    cell: ({ row }) => {
      const index = row.original

      return (
        <div className="w-fit">
          <UserAvatar
            nameLink={`/launchpad/detail/${index.LAUNCHPAD_INDEX}`}
            isForTable
            isToken
            name={index.LAUNCHPAD_TOKEN_NAME}
            address={index.LAUNCHPAD_TOKEN_ADDRESS}
            image={index.PROJECT_IMAGE}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'lead',
    header: 'Lead',
    cell: ({ row }) => {
      const index = row.original

      return <div className="w-fit">{index.LEAD_VC}</div>
    },
  },
  {
    accessorKey: 'totalRaise',
    header: 'Total Raise',
    cell: ({ row }) => {
      const index = row.original

      return <TotalRaised index={index} />
    },
  },
  {
    id: 'allTimeHigh',
    header: 'All Time High',
    cell: ({ row }) => {
      const index = row.original

      return <div>N/A</div>
    },
  },
  {
    id: 'chain',
    header: 'Chain',
    cell: ({ row }) => {
      const index = row.original
      return <div className="w-fit">{index?.CHAIN}</div>
    },
  },
]
