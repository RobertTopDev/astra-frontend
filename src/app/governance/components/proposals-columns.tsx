'use client'

import { TProposal } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { AstraTableToggleSortButton } from '@/components'
import parse from 'html-react-parser'

export const proposalsColumns: ColumnDef<TProposal>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column}>
          Title
        </AstraTableToggleSortButton>
      )
    },

    // cell: ({ row }) => {
    //   const index = row.original

    //   // return <div className="w-fit">{index.title}</div>
    //   return (
    //     <div className="flex-grow flex flex-col gap-1">
    //       <div className="text-md font-medium">
    //         {index.title || index.DESCRIPTION}
    //       </div>
    //       <div className="flex gap-6">
    //         {/* <div className="flex items-center"> */}
    //         {/*   <div className="border border-green-500 px-4 text-xs"> */}
    //         {/*     {indexStatus} */}
    //         {/*   </div> */}
    //         {/* </div> */}
    //         {/* <div> */}
    //         {/*   &nbsp; */}
    //         {/*   {indexState === indexStatusEnum.Active && */}
    //         {/*   index?.END_DATETIME */}
    //         {/*     ? 'End time: ' + index.END_DATETIME */}
    //         {/*     : ''} */}
    //         {/* </div> */}
    //         {/* <div>{proposalActions()}</div> */}
    //       </div>
    //     </div>
    //   )
    // },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <AstraTableToggleSortButton column={column}>
          Description
        </AstraTableToggleSortButton>
      )
    },
    cell: ({ row }) => {
      const index = row.original

      return (
        <div className="w-96">
          <div className="text-center [&>*]:overflow-hidden [&>*]:overflow-ellipsis [&>*]:whitespace-nowrap ">
            {parse(index.description ? index.description : index.DESCRIPTION)}
          </div>
        </div>
      )
    },
  },
]
