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
import { requestLuanchpadForDB } from '@/util/requestLaunchpadForDB'
import { RequestLaunchpadResultValues, TeamObject } from '@/types'

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
const convertMetricsToType = (metrics: any) => {
  const orderAndNaming = [
    { key: 'marketing', name: 'Marketing' },
    { key: 'privateSale', name: 'Private Sale' },
    { key: 'ido', name: 'IDO' },
    { key: 'liquidity', name: 'Liquidity' },
    { key: 'community', name: 'Community' },
    { key: 'advisors', name: 'Advisors' },
    { key: 'ecosystem_metrics', name: 'Ecosystem' },
    { key: 'kosRound', name: 'KOS Round' },
    { key: 'team', name: 'Team' },
    { key: 'promo', name: 'Promo' },
  ]

  // Map the input metrics to the desired format
  const mappedMetrics = orderAndNaming.map(({ key, name }) => {
    const value = metrics[key] || '0' // Default to '0' if the key doesn't exist
    return `${name}:${value}`
  })

  // Join the mapped metrics into a string
  const resultString = mappedMetrics.join(',')
  return resultString
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
      if (txReceipt?.status === 'success' && databaseData) {
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
          launchpadTokenName: `Test Launchpad Token - ${launchpadIndex}`,
          launchpadTokenSymbol: `TLT-${launchpadIndex}`,
          launchpadTotalSupply: 10000, // update
          launchpadTokenDecimal: Number(databaseData.data.tokenDecimals),
          launchpadTokenPrice: Number(databaseData.data.tokenPrice),
          launchpadTokenFDV: 0, // update
          totalSaleAmount: Number(databaseData.data.tokenAmount),
          saleStartTime: databaseData.data.start,
          saleEndTime: databaseData.data.end,
          maxPurchaseBaseAmount: Number(databaseData.data.baseAmount),
          softCap: 100, // update
          hardCap: 10000, // update
          initialMarketCap: 10000000, // update
          projectValuation: 20000000, // update
          projectDetail: databaseData.data.projectDescription,
          teamInfo: convertTeamInfoToString(databaseData.team),
          metrics: convertMetricsToType(databaseData.metrics),
          websiteUrl: databaseData.data.website,
          whitepaperUrl: databaseData.data.pitchdeck,
          twitter: databaseData.data.projectTwitter,
          telegram: databaseData.data.contactTelegram,
          discord: 'https://discord.com',
          otherUrl: '',
          email: databaseData.data.email,
          investorDetail: '',
          chain: 'Arbitrum',
          requestTransaction: txReceipt.transactionHash,
          approveTransaction: '',
        }
        const responseFromDB = await requestLuanchpadForDB(requestData)
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
            transactionAction: 'Request Launchpad Failed',
          })
          onRevert?.(txReceipt)
        }
      } else if (txReceipt?.status === 'reverted') {
        setTransactionObj({
          ...transactionObj,
          status: 'failed',
          transactionHash: txReceipt?.transactionHash,
          transactionAction: 'Request Launchpad Failed',
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
