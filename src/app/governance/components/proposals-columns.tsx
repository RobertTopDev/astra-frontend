'use client'

import { TProposal } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { AstraTableToggleSortButton } from '@/components'
import parse from 'html-react-parser'
import {
  useExecuteProposal,
  useProposalState,
  useProposalsDetail,
  useQueueProposal,
} from '@/hooks'
import { useMemo } from 'react'
import { ProposalStatusEnum } from '@/constants'
import { Button } from '@/components/shadcn'

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

    cell: ({ row }) => {
      const index = row.original

      const { data: proposalState, refetch: refetchProposalState } =
        useProposalState({
          args: [BigInt(index.ID)],
        })
      const { data: proposalDetail } = useProposalsDetail({
        args: [BigInt(index.ID)],
      })
      const proposalStatus = useMemo(() => {
        switch (proposalState) {
          case ProposalStatusEnum.Active:
            return 'Active'

          case ProposalStatusEnum.Cancelled:
            return 'Cancelled'

          case ProposalStatusEnum.Defeated:
            return 'Cancelled'

          case ProposalStatusEnum.Executed:
            return 'Executed'

          case ProposalStatusEnum.Expired:
            return 'Expired'

          case ProposalStatusEnum.Pending:
            return 'Active'

          case ProposalStatusEnum.Queued:
            return 'Queued'

          case ProposalStatusEnum.Succeeded:
            return 'Succeeded'

          default:
            return 'Active'
        }
      }, [index])

      const { executeProposal, error: executeProposalError } =
        useExecuteProposal({
          args: [BigInt(index.ID)],
          value: BigInt(0),
          enabled:
            proposalState === ProposalStatusEnum.Queued &&
            proposalDetail !== undefined &&
            Number(proposalDetail[2]) !== 0 &&
            new Date().getTime() > Number(proposalDetail[2]) * 1000,
          onSuccessTx: () => {
            refetchProposalState()
          },
        })

      const { queueProposal, error: queueProposalError } = useQueueProposal({
        args: [BigInt(index.ID)],
        enabled: proposalState === ProposalStatusEnum.Succeeded,
        onSuccessTx: () => {
          refetchProposalState()
        },
      })

      const proposalActions = () => {
        if (
          proposalState === ProposalStatusEnum.Queued &&
          proposalDetail !== undefined &&
          Number(proposalDetail[2]) !== 0 &&
          new Date().getTime() > Number(proposalDetail[2]) * 1000
        ) {
          return (
            <Button
              disabled={!executeProposal || !!executeProposalError}
              onClick={() => {
                executeProposal?.()
              }}
              size="sm"
            >
              Execute
            </Button>
          )
        } else if (
          proposalState === ProposalStatusEnum.Succeeded &&
          proposalDetail !== undefined &&
          Number(proposalDetail[2]) === 0
        ) {
          return (
            <Button
              disabled={!queueProposal || !!queueProposalError}
              onClick={() => {
                queueProposal?.()
              }}
              size="sm"
            >
              Queue
            </Button>
          )
        }
      }

      return (
        <div className="flex-grow flex flex-col gap-1">
          <div className="text-md font-medium">
            {index.title || index.DESCRIPTION}
          </div>
          <div className="flex gap-6">
            <div className="flex items-center">
              <div className="border border-green-500 px-4 text-xs">
                {proposalStatus}
              </div>
            </div>
            <div>
              &nbsp;
              {proposalState === ProposalStatusEnum.Active &&
              index?.END_DATETIME
                ? 'End time: ' + index.END_DATETIME
                : ''}
            </div>
            <div>{proposalActions()}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'DESCRIPTION',
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
