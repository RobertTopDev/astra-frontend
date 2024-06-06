'use client'

import { useEffect } from 'react'
import { launchpadFactoryAbi } from '@/abis/launchpad-factory-abi'
import { useChainConfig } from '..'
import { useTransactionIndicator } from '@/contexts'
import {
  UsePrepareContractWriteConfig,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { TransactionReceipt, decodeEventLog } from 'viem'
import { updateLaunchpadForDB } from '@/util/updateLaunchpadForDB'
import {
  MetricsObject,
  RequestLaunchpadResultValues,
  TeamObject,
} from '@/types'

type Props = {
  onSuccessTx?: (data: TransactionReceipt) => void
  onRevert?: (data: TransactionReceipt) => void
  databaseData: RequestLaunchpadResultValues | undefined
} & UsePrepareContractWriteConfig<
  typeof launchpadFactoryAbi,
  'requestLaunchpad'
>

const convertTeamInfoToString = (team: TeamObject[]) => {
  return team
    .map((member: TeamObject) => {
      return Object.entries(member)
        .map(([key, value]) => `${key}=${value}`)
        .join('?')
    })
    .join(',')
}

const convertMetricsToType = (metrics: MetricsObject[]) => {
  return metrics
    .map((member: MetricsObject) => {
      return `${member.label}:${member.value}`
    })
    .join(',')
}

export const useRequestLaunchpad = ({
  onSuccessTx,
  onRevert,
  databaseData,
  ...props
}: Props) => {
  const { chainConfig } = useChainConfig()
  const { setTransactionObj, transactionObj } = useTransactionIndicator()
  const { address } = useAccount()

  const {
    config,
    error: prepareError,
    isLoading: prepareLoading,
  } = usePrepareContractWrite({
    ...props,
    address: chainConfig.LaunchpadFactoryContractAddress,
    abi: launchpadFactoryAbi,
    functionName: 'requestLaunchpad',
  })

  const {
    data: writeData,
    write,
    writeAsync,
    error: writeError,
    isLoading: writeLoading,
    reset,
  } = useContractWrite({
    ...config,
    onMutate: () => {
      setTransactionObj({
        status: 'loading',
        reset,
        transactionAction: 'Requesting Launchpad',
      })
    },
    onError: (error) => {
      setTransactionObj({
        ...transactionObj,
        status: 'failed',
        transactionAction: error,
      })
    },
    onSuccess: (data) => {
      setTransactionObj({
        ...transactionObj,
        status: 'pending',
        transactionHash: data.hash,
      })
    },
  })

  const {
    data: txReceipt,
    isLoading: txLoading,
    error: txError,
  } = useWaitForTransaction({
    hash: writeData?.hash,
  })

  useEffect(() => {
    async function init() {
      if (
        txReceipt?.status === 'success' &&
        databaseData &&
        databaseData.launchpadId
      ) {
        const decodedEvent = decodeEventLog({
          abi: launchpadFactoryAbi,
          data: txReceipt.logs[0].data,
          topics: txReceipt.logs[0].topics,
          eventName: 'LaunchpadRequestCreated',
        })
        const launchpadIndex = Number(decodedEvent.args.requestId)
        // call backend api to save data
        const requestData = {
          owner: address as `0x${string}`,
          launchpadIndex: Number(launchpadIndex),
          launchpadAddress: '',
          launchpadTokenAddress: databaseData.data.tokenAddress,
          launchpadTokenName: databaseData.data.tokenName,
          launchpadTokenSymbol: databaseData.data.tokenSymbol,
          launchpadTotalSupply: Number(databaseData.data.totalSupply), // update
          launchpadTokenDecimal: Number(databaseData.data.tokenDecimals),
          launchpadTokenPrice: Number(databaseData.data.tokenPrice),
          launchpadTokenFDV: Number(databaseData.data.totalToken), // update
          totalSaleAmount: Number(databaseData.data.tokenAmount),
          saleStartTime: new Date(databaseData.data.saleStartDate).getTime(),
          saleEndTime: new Date(databaseData.data.saleEndDate).getTime(),
          minPurchaseBaseAmount: Number(databaseData.data.minPurchaseAmount),
          maxPurchaseBaseAmount: Number(databaseData.data.baseAmount),
          softCap: Number(databaseData.data.softCap), // update
          hardCap: Number(databaseData.data.hardCap), // update
          initialMarketCap: Number(databaseData.data.initialMarketCap), // update
          projectValuation: Number(databaseData.data.projectValuation), // update
          projectDetail: databaseData.data.projectDescription,
          projectDescriptionDetail: databaseData.data.projectDescriptionDetail,
          projectImage: databaseData.data.projectImage,
          saleRoundDetail: databaseData.data.saleRoundDetail,
          teamInfo: JSON.stringify(databaseData.team),
          teamDescription: databaseData.data.teamDescription,
          metrics: JSON.stringify(databaseData.metrics),
          websiteUrl: databaseData.data.website,
          whitepaperUrl: databaseData.data.pitchdeck,
          projectDeck: databaseData.data.projectDeck,
          github: databaseData.data.github,
          twitter: databaseData.data.projectTwitter,
          telegram: databaseData.data.contactTelegram,
          discord: databaseData.data.contactDiscord,
          medium: databaseData.data.contactMedium,
          leadVCImage: databaseData.data.leadVCImage,
          marketMakerImage: databaseData.data.marketMakerImage,
          otherUrl: '',
          email: databaseData.data.email,
          investorDetail: databaseData.data.investorDetail,
          chain: databaseData.data.chain,
          requestTransaction: txReceipt.transactionHash,
          approveTransaction: '',
          leadVC: databaseData.data.leadVC,
          marketMaker: databaseData.data.marketMaker,
          controlledCap: databaseData.data.controlledCap,
          daoApprovedMetrics: databaseData.data.daoApprovedMetrics,
          tokenType: databaseData.data.tokenType,
          isVesting: databaseData.data.isVesting,
          baseToken: databaseData.data.baseToken,
          vest_start: databaseData.data.vest_start
            ? new Date(databaseData.data.vest_start).getTime()
            : 0,
          vest_cliff: databaseData.data.vest_cliff
            ? Number(databaseData.data.vest_cliff)
            : 0,
          vest_duration: databaseData.data.vest_duration
            ? Number(databaseData.data.vest_duration)
            : 0,
          vest_slice_period_seconds: databaseData.data.vest_slice_period_seconds
            ? Number(databaseData.data.vest_slice_period_seconds)
            : 0,
          vest_initial_unlock: databaseData.data.vest_initial_unlock
            ? Number(databaseData.data.vest_initial_unlock)
            : 0,
        }
        const responseFromDB = await updateLaunchpadForDB(
          requestData,
          databaseData.launchpadId
        )
        if (responseFromDB.ok) {
          setTransactionObj({
            ...transactionObj,
            status: 'success',
            transactionHash: txReceipt.transactionHash,
            transactionAction: 'Requested Launchpad Successfully',
          })
          onSuccessTx?.(txReceipt)
        } else {
          setTransactionObj({
            ...transactionObj,
            status: 'failed',
            transactionHash: txReceipt?.transactionHash,
            transactionAction: 'Requesting Launchpad Failed',
          })
          onRevert?.(txReceipt)
        }
      } else if (txReceipt?.status === 'reverted') {
        setTransactionObj({
          ...transactionObj,
          status: 'failed',
          transactionHash: txReceipt?.transactionHash,
          transactionAction: 'Requesting Launchpad Failed',
        })
        onRevert?.(txReceipt)
      }
    }

    init()
  }, [txReceipt])

  return {
    requestLaunchpad:
      props.enabled || props.enabled === undefined || databaseData !== undefined
        ? write
        : undefined,
    requestLaunchpadAsync:
      props.enabled || props.enabled === undefined || databaseData !== undefined
        ? writeAsync
        : undefined,
    isError: prepareError || writeError || txError,
    isLoading: prepareLoading || writeLoading || txLoading,
  }
}
