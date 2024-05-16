'use client'

import { UserAvatar } from '@/components'
import { TLaunchpadDetailInfo } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { numberFormatter } from '@/util'

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
      // shorten(accountAddress)
    },
  },
  {
    accessorKey: 'lead',
    header: 'Lead',
    cell: ({ row }) => {
      const index = row.original

      return (
        <div className="w-fit">
          {index.LEAD_VC}
          {/* <UserAvatar
            nameLink={`/launchpad/detail/${index.LAUNCHPAD_INDEX}`}
            isForTable
            isToken
            // name={index.PROJECT_NAME}
            address=""
          /> */}
        </div>
      )
    },
  },
  {
    accessorKey: 'totalRaise',
    header: 'Total Raise',
    cell: ({ row }) => {
      const index = row.original

      return <div>${numberFormatter(index?.HARD_CAP)}</div>
    },
  },
  {
    id: 'allTimeHigh',
    header: 'All Time High',
    cell: ({ row }) => {
      const index = row.original

      // return <div>{index?.allTimeHigh ? index?.allTimeHigh + 'x' : 'N/A'}</div>
      return <div>N/A</div>
    },
  },
  {
    id: 'cex',
    header: 'CEXs',
    cell: ({ row }) => {
      const index = row.original
      return (
        <div className="flex gap-2">
          {/* {index.cex &&
            index.cex.map((item, index) => (
              <div
                key={index}
                className="text-xs bg-astra-blue rounded-xl text-astra-blue bg-opacity-15 px-3 py-1"
              >
                {item}
              </div>
            ))} */}
        </div>
      )
    },
  },
]
