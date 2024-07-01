'use client'

import { AstraTableToggleSortButton, UserAvatar } from '@/components'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn'
import ProgressBar from '@/components/progressbar'
import { TIndex } from '@/types'
import { millifyText } from '@/util'
import { CheckCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

export const indicesColumns: ColumnDef<TIndex>[] = [
  {
    accessorKey: 'ITOKENNAME',
    // header: () => <div className="text-left">Index</div>,
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column} className="text-left">
          Index
        </AstraTableToggleSortButton>
      )
    },

    cell: ({ row }) => {
      const index = row.original
      // const accountAddress = row.getValue('ITOKEN_ADDR') as string
      // const name = row.getValue('ITOKENNAME') as string

      return (
        <div className="w-fit">
          <UserAvatar
            nameLink={`/indices/${index.ITOKEN_ADDR}`}
            isForTable
            isToken
            address={index.ITOKEN_ADDR}
            name={index.ITOKENNAME}
          />
        </div>
      )
      // shorten(accountAddress)
    },
  },
  {
    accessorKey: 'TVL',
    header: ({ column }) => (
      <div className="text-center flex items-center justify-center w-full">
        <div className="flex">
          <AstraTableToggleSortButton column={column}>
            TVL
          </AstraTableToggleSortButton>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoCircledIcon className="w-[1rem] h-[1rem]" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Threshold is the TVL required to start an index. <br /> Locked
                  is the current TVL of the index.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    ),
    cell: ({ row }) => {
      const index = row.original

      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <ProgressBar
              value={index.TVL_REQUIRED_TO_START_INDEX_PER}
              className="flex-grow"
            />

            {index.TVL_REQUIRED_TO_START_INDEX_PER < 100 ? (
              <div>{index.TVL_REQUIRED_TO_START_INDEX_PER}%</div>
            ) : (
              <div>
                <CheckCircledIcon />
              </div>
            )}
          </div>
          <p className="text-left text-xs font-bold">
            Threshold:&nbsp;
            {index?.thresold_display
              ? '$' + millifyText(index?.thresold_display)
              : '$0'}
            &nbsp; | Locked: $
            {millifyText(Math.round(index.TVL) / Math.pow(10, 6))}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: 'ROI',
    // header: 'ROI',

    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column}>
          ROI
        </AstraTableToggleSortButton>
      )
    },
    cell: ({ row }) => {
      const index = row.original

      return (
        <div className="text-center">
          {typeof index?.ROI_NEW === 'number'
            ? index?.ROI_NEW
              ? parseFloat(index?.ROI_NEW).toFixed(2) + '%'
              : 0
            : 'N/A'}
        </div>
      )
    },
  },
  {
    id: 'staking',
    // accessorKey: 'amount',
    header: 'Staking',
    // cell: ({ row }) => {},
  },
  {
    id: 'actions',
    // cell: ({ row }) => {
    //   const index = row.original

    //   return (
    //     <Link href={`/indices/${index.ITOKEN_ADDR}`}>
    //       <Button size="sm">Invest</Button>
    //     </Link>
    //   )
    // },
  },
]
