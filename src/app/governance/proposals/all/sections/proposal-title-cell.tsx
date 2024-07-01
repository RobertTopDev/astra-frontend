'use client'
import { Button } from '@/components/shadcn'
import { ProposalStatusEnum } from '@/constants'
import {
  useExecuteProposal,
  useProposalState,
  useProposalsDetail,
  useQueueProposal,
} from '@/hooks'
import { TProposal } from '@/types'
import { useMemo } from 'react'

type TProposalTitleCellProps = {
  proposal: TProposal
}

const ProposalTitleCell = ({ proposal }: TProposalTitleCellProps) => {
  const { data: proposalState, refetch: refetchProposalState } =
    useProposalState({
      args: [BigInt(proposal.ID)],
    })
  const { data: proposalDetail } = useProposalsDetail({
    args: [BigInt(proposal.ID)],
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
  }, [proposal])

  const { executeProposal, error: executeProposalError } = useExecuteProposal({
    args: [BigInt(proposal.ID)],
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
    args: [BigInt(proposal.ID)],
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
        {proposal.title || proposal.DESCRIPTION}
      </div>
      <div className="flex gap-6">
        <div className="flex items-center">
          <div className="border border-green-500 px-4 text-xs">
            {proposalStatus}
          </div>
        </div>
        <div>
          &nbsp;
          {proposalState === ProposalStatusEnum.Active && proposal?.END_DATETIME
            ? 'End time: ' + proposal.END_DATETIME
            : ''}
        </div>
        <div>{proposalActions()}</div>
      </div>
    </div>
  )
}

export { ProposalTitleCell }
