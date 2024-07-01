'use client'
import { AstraHeader, AstraLink, AstraLoading } from '@/components'
import { ProposalStatusEnum } from '@/constants'
import { TProposal, TProposalSignature } from '@/types'
import React, { useEffect, useMemo } from 'react'
import parse from 'html-react-parser'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Button,
  Separator,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn'
import ProgressBar from '@/components/progressbar'
import {
  decodeAbiParameters,
  formatUnits,
  isAddress,
  parseAbiParameters,
} from 'viem'
import { numberFormatter, shorten } from '@/util'
import { useAccount, useBlockNumber } from 'wagmi'
import {
  useAstraDecimal,
  useAstraMultiplierDecimal,
  useAstraStakingScoreAndMultiplier,
  useAstraUserInfo,
  useCancelProposal,
  useExecuteProposal,
  useGaslessProposalVote,
  useGetProposalVoters,
  useProposalState,
  useQueueProposal,
  useSubmitGaslessVotes,
  useProposalsDetail,
  useProposalVote,
  useBlockInfo,
} from '@/hooks'
import { format } from 'date-fns'

type TProposalInfoProps = {
  proposal: TProposal
  signatures: TProposalSignature[]
}

const ProposalInfo = ({ proposal, signatures }: TProposalInfoProps) => {
  const [voteChoice, setVoteChoice] = React.useState<boolean | undefined>()
  const { address } = useAccount()

  const { gaslessProposalVote } = useGaslessProposalVote({
    voteChoice,
    proposalId: BigInt(proposal.ID),
  })

  const { data: proposalState, refetch: refetchProposalState } =
    useProposalState({
      args: [BigInt(proposal.ID)],
      enabled: !!proposal.ID,
    })

  const { data: proposalVoters } = useGetProposalVoters({
    proposalId: proposal.ID,
    enabled: !!proposal.ID,
  })

  const { data: proposalDetail } = useProposalsDetail({
    args: [BigInt(proposal.ID)],
    enabled: !!proposal.ID,
  })

  const { cancelProposal, error: cancelProposalError } = useCancelProposal({
    args: [BigInt(proposal.ID)],
    enabled: !!proposal.ID && proposal.PROPOSER === address,
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

  const { proposalVote, error: proposalVoteError } = useProposalVote({
    enabled:
      voteChoice !== undefined && proposalState === ProposalStatusEnum.Active,
    args:
      voteChoice !== undefined ? [BigInt(proposal.ID), voteChoice] : undefined,
    onSuccessTx: () => {
      refetchProposalState()
    },
  })
  const { submitGaslessVotes } = useSubmitGaslessVotes({
    args: [
      signatures.map((sig) => ({
        ...sig,
        proposalId: BigInt(sig.proposalId),
        v: Number(sig.v),
      })),
    ],
    enabled: signatures.length > 0,
    onSuccessTx: () => {
      refetchProposalState()
    },
  })

  const { data: userInfo } = useAstraUserInfo({})
  const { data: astraDecimal } = useAstraDecimal()
  const { data: astraStakingScoreAndMultiplier } =
    useAstraStakingScoreAndMultiplier({
      args: !!address && !!userInfo ? [address, userInfo[0]] : undefined,
      enabled: !!address && !!userInfo,
    })
  const { data: astraMultiplierDecimal } = useAstraMultiplierDecimal({})

  const stakingScore = useMemo(() => {
    if (
      astraStakingScoreAndMultiplier === undefined ||
      astraDecimal === undefined
    )
      return 0
    return formatUnits(astraStakingScoreAndMultiplier[0], astraDecimal)
  }, [astraStakingScoreAndMultiplier, astraDecimal])

  const rewardMultiplier = useMemo(() => {
    if (
      astraStakingScoreAndMultiplier === undefined ||
      astraMultiplierDecimal === undefined
    )
      return 1
    try {
      return (
        Number(astraStakingScoreAndMultiplier[1]) /
        Number(astraMultiplierDecimal)
      )
    } catch (err) {
      console.error({ err })
      return 1
    }
  }, [astraMultiplierDecimal, astraStakingScoreAndMultiplier])

  const hasVoted = useMemo(() => {
    return !proposalVoters?.some((voter) => voter.VOTER === address)
  }, [proposalVoters])

  const { data: currentBlockNumber, refetch: refetchBlockCurrentNumber } =
    useBlockNumber({})

  useEffect(() => {
    const timer = setInterval(() => {
      refetchBlockCurrentNumber()
    }, 5000)

    return () => {
      clearInterval(timer)
    }
  }, [])
  const { data: startBlock, isLoading: startBlockLoading } = useBlockInfo({
    blockNumber: proposal.STARTBLOCK,
    enabled: !!proposal.STARTBLOCK,
  })
  const { data: endBlock } = useBlockInfo({
    blockNumber: proposal.ENDBLOCK,
    enabled:
      !!proposal.ENDBLOCK &&
      currentBlockNumber !== undefined &&
      currentBlockNumber > BigInt(proposal.ENDBLOCK),
  })

  const endTime = useMemo(() => {
    if (endBlock === undefined || currentBlockNumber === undefined) {
      try {
        return format(
          new Date(Number(proposal.END_DATETIME) * 1000),
          'yyyy MMM dd HH:mm:ss'
        )
      } catch (err) {
        return 'N/A'
      }
    } else {
      return format(
        new Date(Number(endBlock?.timestamp) * 1000),
        'yyyy MMM dd HH:mm:ss'
      )
    }
  }, [endBlock, currentBlockNumber])

  const againstVotes = Number(formatUnits(BigInt(proposal.AGAINSTVOTES), 18))
  const forVotes = Number(formatUnits(BigInt(proposal.FORVOTES), 18))
  const forPercentage = useMemo(() => {
    if (againstVotes + forVotes === 0) return 0
    return proposal.FORVOTES ? (forVotes / (againstVotes + forVotes)) * 100 : 0
  }, [proposal])
  const againstPercentage = useMemo(() => {
    if (againstVotes + forVotes === 0) return 0
    return proposal.AGAINSTVOTES
      ? (againstVotes / (againstVotes + forVotes)) * 100
      : 0
  }, [proposal])

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
  }, [proposalState])

  const signatureDetails = useMemo(() => {
    return Object.keys(proposal.TEXT)
      .map((key) => {
        const params = key
          .split('(')[1]
          .slice(0, -1)
          .split(',')
          .map((x) => x.trim())
          .map((type, idx) => {
            return `${type} ${String.fromCharCode('a'.charCodeAt(0) + idx)}`
          })
          .join(',')
        const decoded =
          proposal.TEXT[key].length > 63
            ? (decodeAbiParameters(
                parseAbiParameters(params),
                ('0x' + proposal.TEXT[key]) as `0x${string}`
              ) as Array<string | Record<string, string>>)
            : [proposal.TEXT[key]]

        const decodedArray = decoded.reduce((acc, curr) => {
          if (typeof curr === 'string') {
            return [...acc, curr]
          } else {
            return [...acc, ...Object.values(curr)]
          }
        }, [] as string[])

        return (
          <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            {decodedArray.map((value) => (
              <TableCell key={value}>
                {isAddress(value) ? (
                  <AstraLink
                    link={`https://mumbai.polygonscan.com/address/${value}`}
                  >
                    {shorten(value)}
                  </AstraLink>
                ) : (
                  value
                )}
              </TableCell>
            ))}
          </TableRow>
        )
      })
      .map((x) => <>{x}</>)
  }, [proposal])

  const proposalActions = () => {
    if (
      proposalState === ProposalStatusEnum.Queued &&
      proposalDetail &&
      Number(proposalDetail[2]) !== 0 &&
      new Date().getTime() > Number(proposalDetail[2]) * 1000
    ) {
      return (
        <Button
          variant="astra-blue"
          disabled={!executeProposal || !!executeProposalError}
          onClick={() => {
            executeProposal?.()
          }}
        >
          Execute
        </Button>
      )
    } else if (proposalState === ProposalStatusEnum.Succeeded) {
      return (
        <Button
          variant="astra-blue"
          disabled={!queueProposal || !!queueProposalError}
          onClick={() => {
            queueProposal?.()
          }}
        >
          Queue
        </Button>
      )
    }
  }

  return (
    <div className="relative w-full container pb-20">
      <AstraHeader className="text-center my-10">
        {proposal.title ? proposal.title : proposal.DESCRIPTION}
      </AstraHeader>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-6 [&>h1]:font-bold [&>h1]:text-lg">
          <div className="flex">
            <div className="border border-green-500 px-12">
              {proposalStatus}
            </div>
          </div>
          <h1>Description:</h1>
          <div className="[&>*]:break-words">
            {parse(
              proposal.description ? proposal.description : proposal.DESCRIPTION
            )}
          </div>
          <h1>Links:</h1>
          <ul className="list-disc list-inside">
            {proposal.links?.map((link) => (
              <li key={link}>
                <AstraLink link={link}>{link}</AstraLink>
              </li>
            ))}
          </ul>
          <h1>Proposer:</h1>
          <ul className="list-disc list-inside">
            <li>{proposal.PROPOSER}</li>
          </ul>
          <h1>Signature:</h1>
          <ul className="list-disc list-inside">
            <li>{proposal.SIGNATURES}</li>
          </ul>
          <h1>Signature details:</h1>
          <div className="flex">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Arguments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{signatureDetails}</TableBody>
            </Table>
          </div>
          {proposalActions !== undefined && (
            <div className="flex gap-6">{proposalActions()}</div>
          )}
          {proposalState === ProposalStatusEnum.Active &&
          address !== undefined &&
          hasVoted ? (
            <div className="flex">
              <div>CAST YOUR VOTE: </div>
              <div className="flex-grow flex justify-center">
                <div className="flex flex-col gap-4 w-2/3">
                  <Button
                    variant={
                      voteChoice == true ? 'astra-white' : 'astra-blue-outline'
                    }
                    onClick={() => setVoteChoice(true)}
                  >
                    FOR
                  </Button>
                  <Button
                    variant={
                      voteChoice === false
                        ? 'astra-white'
                        : 'astra-blue-outline'
                    }
                    onClick={() => setVoteChoice(false)}
                  >
                    Against
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="astra-blue"
                        disabled={
                          voteChoice === undefined ||
                          !proposalVote ||
                          !!proposalVoteError
                        }
                      >
                        Vote
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>CONFIRM VOTE</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="flex flex-col gap-6 justify-center">
                            <div>
                              Are you sure you want to vote &quot;
                              {voteChoice ? 'FOR' : 'AGAINST'}&quot;. This
                              Action cannot be undone.
                            </div>
                            <div className="[&>div]:flex [&>div]:rounded-lg [&>div]:justify-between bg-[#15192b] p-6 text-white flex flex-col gap-2">
                              <div>
                                <div>Option</div>
                                <div>{voteChoice ? 'FOR' : 'AGAINST'}</div>
                              </div>
                              <Separator />
                              <div>
                                <div>Voting Power</div>
                                <div>{numberFormatter(rewardMultiplier)}</div>
                              </div>
                              <Separator />
                              <div>
                                <div>Staking Score</div>
                                <div>{numberFormatter(stakingScore)}</div>
                              </div>
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            proposalVote?.()
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="astra-blue"
                        disabled={
                          voteChoice === undefined ||
                          !proposalVote ||
                          !!proposalVoteError
                        }
                      >
                        Vote Gasless
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          CONFIRM VOTE GASLESS
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="flex flex-col gap-6 justify-center">
                            <div>
                              Are you sure you want to vote &quot;
                              {voteChoice ? 'FOR' : 'AGAINST'}&quot;. This
                              Action cannot be undone.
                            </div>
                            <div className="[&>div]:flex [&>div]:rounded-lg [&>div]:justify-between bg-[#15192b] p-6 text-white flex flex-col gap-2">
                              <div>
                                <div>Option</div>
                                <div>{voteChoice ? 'FOR' : 'AGAINST'}</div>
                              </div>
                              <Separator />
                              <div>
                                <div>Voting Power</div>
                                <div>{rewardMultiplier}</div>
                              </div>
                              <Separator />
                              <div>
                                <div>Staking Score</div>
                                <div>{stakingScore}</div>
                              </div>
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            gaslessProposalVote?.()
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <div className="bg-white/20 px-6 py-12 rounded-lg flex flex-col gap-6">
                    <p className="text-sm">
                      Submit Vote means to vote on-chain and pay the gas fee.
                      Submit Gasless Vote means to vote without paying the gas
                      fee. If you use the gasless vote method your vote will not
                      count until a user submits the total votes as a batch by
                      clicking the execute button below.
                    </p>

                    <Button
                      variant="astra-blue"
                      className="w-full"
                      disabled={
                        proposal?.GASELESS_COUNTER < 1 && !submitGaslessVotes
                      }
                      onClick={() => {
                        submitGaslessVotes?.()
                      }}
                    >
                      Execute {proposal?.GASELESS_COUNTER} Vote
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="col-span-4 flex flex-col gap-6 [&>div]:bg-gray-400/50 [&>div]:px-8 [&>div]:py-4 [&>div]:rounded-lg">
          <div className="">
            <div className="text-xl text-center font-medium">INFORMATION</div>
            <div className="flex flex-col gap-2 [&>div]:flex [&>div]:justify-between">
              <div>
                <div>Proposer</div>
                <div>
                  <AstraLink
                    link={`https://mumbai.polygonscan.com/address/${proposal.PROPOSER}`}
                  >
                    {proposal.PROPOSER === address
                      ? 'YOU'
                      : shorten(proposal.PROPOSER)}
                  </AstraLink>
                </div>
              </div>
              <Separator />
              <div>
                <div>Start Date</div>
                <div>
                  <AstraLoading isLoading={startBlockLoading}>
                    {startBlock !== undefined
                      ? format(
                          new Date(Number(startBlock?.timestamp) * 1000),
                          'yyyy MMM dd HH:mm:ss'
                        )
                      : 'N/A'}
                  </AstraLoading>
                </div>
              </div>
              <Separator />
              <div>
                <div>End Date</div>
                <div>
                  <div>{endTime}</div>
                </div>
              </div>
              <Separator />
              <div>
                <div>Voting Power</div>
                <div>{rewardMultiplier}</div>
              </div>
              <Separator />
              <div>
                <div>Staking Score</div>
                <div>{stakingScore}</div>
              </div>
              <Separator />
              {proposal.PROPOSER === address &&
                ['Active', 'Succeeded', 'Queued', 'Pending'].includes(
                  proposalStatus
                ) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="astra-white"
                        className="w-full"
                        disabled={!cancelProposal || !!cancelProposalError}
                      >
                        CANCEL PROPOSAL
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will cancel your
                          Proposal.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            cancelProposal?.()
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
            </div>
          </div>
          <div className="">
            <div className="text-xl text-center font-medium">
              CURRENT RESULTS
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <div>For</div>
                  <div>{forPercentage}%</div>
                </div>
                <ProgressBar
                  className="flex-grow"
                  value={forPercentage}
                ></ProgressBar>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <div>Against</div>
                  <div>{againstPercentage}%</div>
                </div>
                <ProgressBar
                  className="flex-grow "
                  barColor="bg-red-500"
                  value={againstPercentage}
                ></ProgressBar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProposalInfo }
