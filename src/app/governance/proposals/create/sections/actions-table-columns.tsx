'use client'

import { TProposalActionSelected, TProposalContractABI } from '@/types'
import { shorten } from '@/util'
import { ColumnDef } from '@tanstack/react-table'

export const proposalActionsColumns: ColumnDef<TProposalActionSelected>[] = [
  {
    accessorKey: 'action',
    header: () => {
      return <div className="text-left">Action</div>
    },

    cell: ({ row }) => {
      const index = row.original

      return <div className="text-left">{index.label}</div>
    },
  },
  {
    accessorKey: 'address',
    header: () => {
      return <div className="text-center">Address</div>
    },

    cell: ({ row }) => {
      const index = row.original

      return <div className="text-center">{shorten(index.value)}</div>
    },
  },
  {
    accessorKey: 'function',
    header: () => {
      return <div className="text-center">Function</div>
    },
    cell: ({ row }) => {
      const action = row.original
      let abi: TProposalContractABI
      if (action?.hasDropdown) {
        abi = action.action![Number(action.subActionIndex)].contractAbi[0]
      } else {
        abi = action.contractAbi[0]
      }

      let actionText = `${abi.name}(`
      for (let idx = 0; idx < abi.inputs.length; idx++) {
        const input = abi.inputs[idx]
        actionText += `${input.type},`
      }
      actionText = actionText.slice(0, -1) + ')'

      return <div className="text-center">{actionText}</div>
    },
  },
  {
    id: 'actions',
    // cell: ({ row }) => {
    //   const index = row.original

    //   return <div className="text-center"></div>
    // },
  },
]
