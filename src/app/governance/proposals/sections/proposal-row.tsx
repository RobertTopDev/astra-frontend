'use client'
import { TProposal } from '@/types'
import React, { useMemo } from 'react'
import { Button } from '@/components/shadcn'
import { formatUnits } from 'viem'
import { useRouter } from 'next/navigation'
import { ProposalStatusEnum } from '@/constants'
import { useProposalState, useProposalsDetail } from '@/hooks'

type TProposalRowProps = {
  proposal: TProposal
}

const ProposalRow = ({ proposal }: TProposalRowProps) => {
  const router = useRouter()
  const againstVotes = Number(formatUnits(BigInt(proposal.AGAINSTVOTES), 18))
  const forVotes = Number(formatUnits(BigInt(proposal.FORVOTES), 18))

  const { data: proposalDetail } = useProposalsDetail({
    args: [BigInt(proposal.ID)],
  })

  const { data: proposalState } = useProposalState({
    args: [BigInt(proposal.ID)],
  })

  const forPercentage = useMemo(
    () =>
      proposal.FORVOTES ? (forVotes / (againstVotes + forVotes)) * 100 : 0,
    [proposal]
  )
  const againstPercentage = useMemo(
    () =>
      proposal.AGAINSTVOTES
        ? (againstVotes / (againstVotes + forVotes)) * 100
        : 0,
    [proposal]
  )

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

  const proposalActions = () => {
    if (
      proposalState === ProposalStatusEnum.Queued &&
      proposalDetail !== undefined &&
      Number(proposalDetail[2]) !== 0 &&
      new Date().getTime() > Number(proposalDetail[2]) * 1000
    ) {
      return <Button>Execute</Button>
    } else if (
      proposalState === ProposalStatusEnum.Succeeded &&
      proposalDetail !== undefined &&
      Number(proposalDetail[2]) === 0
    ) {
      return <Button>Queue</Button>
    }
  }

  return (
    <div
      className="flex justify-between cursor-pointer"
      onClick={() => {
        router.push(`/governance/proposals/${proposal.ID}`)
      }}
    >
      <div className="flex gap-6">
        <div className="w-[1rem] h-[1rem]"></div>
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
              {proposalState === ProposalStatusEnum.Active &&
              proposal?.END_DATETIME
                ? 'End time: ' + proposal.END_DATETIME
                : ''}
            </div>
            <div>{proposalActions()}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 min-w-[192px]">
        <div className="col-span-3 flex flex-col gap-1">
          <div>For</div>
          <div>Against</div>
        </div>
        <div className="col-span-9 flex flex-col gap-1 ">
          <div className="h-full flex items-center">
            {/* <Progress className="flex-grow" value={forPercentage}></Progress> */}
          </div>
          <div className="h-full flex items-center">
            {/* <Progress
              indicatorClassName="bg-red-500"
              className="flex-grow"
              value={againstPercentage}
            ></Progress> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProposalRow }
