'use client'
import { useAccount, useSignTypedData } from 'wagmi'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { hexToSignature } from 'viem'
import { useTransactionIndicator } from '@/contexts'
import { useChainConfig } from '..'

type TUseMutationVariable = {
  signature: `0x${string}`
}

type TUseGaslessProposalVoteProps = {
  proposalId: bigint
  voteChoice: boolean | undefined
} & UseMutationOptions<boolean, unknown, TUseMutationVariable>

export const useGaslessProposalVote = ({
  proposalId,
  voteChoice,
  ...props
}: TUseGaslessProposalVoteProps) => {
  const { address } = useAccount()
  const { chain, chainConfig } = useChainConfig()
  const { setTransactionObj, transactionObj } = useTransactionIndicator()

  const {
    signTypedData,
    isLoading: signTypedDataLoading,
    error: signTypedDataError,
  } = useSignTypedData({
    domain: {
      name: 'ASTRA DAO Governor Alpha',
      chainId: chain.id,
      verifyingContract: chainConfig.DAOContractAddress,
    },
    primaryType: 'Ballot',
    types: {
      Ballot: [
        { name: 'proposalId', type: 'uint256' },
        { name: 'support', type: 'bool' },
      ],
    },
    message: {
      proposalId: proposalId,
      support: voteChoice === undefined ? true : voteChoice,
    },
    onMutate: () => {
      setTransactionObj({
        status: 'loading',
        transactionAction: 'Signing Data',
      })
    },
    onSuccess: (signature) => {
      mutate({
        signature: signature as `0x${string}`,
      })
      setTransactionObj({
        status: 'pending',
        transactionAction: 'Submitting Gasless Vote',
      })
    },
    onError: (error) => {
      setTransactionObj({
        ...transactionObj,
        status: 'failed',
      })
      console.error({ error })
    },
  })

  const {
    mutate,
    isLoading: mutateLoading,
    error: mutateError,
  } = useMutation({
    mutationFn: async ({ signature }: TUseMutationVariable) => {
      const { v, r, s } = hexToSignature(signature!)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/signatures/gaseless/vote/${proposalId}/${address}/${signature}/${v}/${r}/${s}/${voteChoice}`
      )
      if (!res.ok) {
        console.error('error', res)
        return false
      }
      return true
    },
    onMutate: () => {
      setTransactionObj({
        status: 'loading',
        transactionAction: 'Submitting Gasless Vote',
      })
    },
    onSuccess: (data) => {
      if (data)
        setTransactionObj({
          ...transactionObj,
          status: 'success',
        })
      else
        setTransactionObj({
          ...transactionObj,
          status: 'failed',
        })
    },
    onError: (error) => {
      setTransactionObj({
        ...transactionObj,
        status: 'failed',
      })
      console.error({ error })
    },
    ...props,
  })

  return {
    gaslessProposalVote: signTypedData,
    isLoading: signTypedDataLoading || mutateLoading,
    error: signTypedDataError || mutateError,
  }
}
