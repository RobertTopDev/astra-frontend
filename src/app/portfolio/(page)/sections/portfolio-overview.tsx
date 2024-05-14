'use client'

import { IndexBody } from '@/app/indices/[tokenAddress]/sections/index-body'
import { AstraCountdown, AstraHeader, AstraLoading } from '@/components'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from '@/components/shadcn'
import {
  useAssetsData,
  useDelistIndex,
  usePoolInfo,
  usePendingBalance,
} from '@/hooks'
import { differenceInHours, format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { RebalanceModal } from './rebalance-modal'
import { numberFormatter } from '@/util'
import { TIndex } from '@/types'
import Link from 'next/link'
import { formatUnits } from 'viem'

type TPortfolioOverviewProps = {
  userIndices: TIndex[] | undefined
  refetchUserIndices: () => void
  userIndicesLoading: boolean
  setWithdrawIndex: (value: number | undefined) => void
  selected: string | undefined
  setSelected: (value: string | undefined) => void
  selectedIndex: TIndex | undefined
}

const PortfolioOverview = ({
  userIndices,
  userIndicesLoading,
  setWithdrawIndex,
  selected,
  setSelected,
  selectedIndex,
}: TPortfolioOverviewProps) => {
  const { address } = useAccount()
  const [rebalanceModal, setRebalanceModal] = useState<boolean>(false)

  const {
    data: poolInfo,
    isLoading: poolInfoLoading,
    refetch: refetchPoolInfo,
  } = usePoolInfo({
    args:
      selectedIndex !== undefined
        ? [BigInt(selectedIndex.ITOKEN_INDEX)]
        : undefined,
  })

  const {
    data: assetsData,
    isLoading: assetsDataLoading,
    refetch: refetchAssetsData,
  } = useAssetsData({
    index: selectedIndex,
    enabled: selectedIndex !== undefined,
  })

  const {
    data: itokenBalance,
    isLoading: itokenBalanceLoading,
    refetch: refetchITokenBalance,
  } = useBalance({
    address: address,
    token:
      selectedIndex !== undefined
        ? (selectedIndex?.ITOKEN_ADDR as `0x${string}`)
        : undefined,
    enabled: selectedIndex !== undefined,
  })

  const { data: pendingBalance } = usePendingBalance(selectedIndex?.ITOKEN_ADDR)
  const diffHoursBetweenLastAndCurrentRebalance = useMemo(() => {
    if (
      !selectedIndex ||
      !selectedIndex.LAST_REBALANCE ||
      !selectedIndex.CURR_REBALANCE
    )
      return 0
    return differenceInHours(
      new Date(Number(selectedIndex.REBAL_TIME) * 1000),
      new Date(Number(selectedIndex.LAST_REBALANCE) * 1000)
    )
  }, [selectedIndex])

  const itokenBalanceFormatted = useMemo(() => {
    if (itokenBalance === undefined) return 0
    return numberFormatter(itokenBalance.formatted)
  }, [itokenBalance])

  const rebalancingStatus = useMemo(() => {
    const hours = diffHoursBetweenLastAndCurrentRebalance

    if (hours <= 60) {
      return 'daily'
    } else if (hours <= 168) {
      return 'weekly'
    } else return 'monthly'
  }, [diffHoursBetweenLastAndCurrentRebalance])

  const lastrebalancetime = useMemo(() => {
    if (selectedIndex === undefined) return undefined
    const date = new Date(Number(selectedIndex.LAST_REBALANCE) * 1000)
    return date
  }, [selectedIndex])

  const nextrebalancetime: Date | undefined = useMemo(() => {
    if (selectedIndex === undefined) return undefined
    const date = new Date(Number(selectedIndex.REBAL_TIME) * 1000)
    if (date === lastrebalancetime && rebalancingStatus === 'daily')
      date.setDate(date.getDate() + 1)
    return date
  }, [selectedIndex, lastrebalancetime, rebalancingStatus])

  useEffect(() => {
    if (
      selectedIndex === undefined &&
      userIndices !== undefined &&
      userIndices.length > 0
    ) {
      setSelected('0')
    }
  }, [userIndices])

  const rebalancedThresoldReached = useMemo(() => {
    return poolInfo !== undefined && poolInfo[4] > 0
  }, [poolInfo])

  const rebalanceTimestampTriggered = useMemo(() => {
    if (selectedIndex === undefined) return false
    return Number(selectedIndex.REBAL_TIME) * 1000 < new Date().getTime()
  }, [poolInfo])

  const { delistIndex } = useDelistIndex({
    onSuccess: () => {
      window.location.reload()
    },
  })

  const refetchDatas = () => {
    refetchPoolInfo()
    refetchAssetsData()
    refetchITokenBalance()
  }

  // {userIndicesLoading ? (
  // ) : userIndices === undefined || userIndices.length === 0 ? (
  return (
    <div className="relative z-10 container mx-auto w-full pb-20 flex flex-col gap-6 items-center">
      {userIndicesLoading ? (
        <div className="min-h-screen flex justify-center items-center">
          <AstraLoading isLoading={userIndicesLoading}></AstraLoading>
        </div>
      ) : userIndices === undefined || userIndices.length === 0 ? (
        <div className="min-h-screen flex flex-col gap-6 justify-center items-center transform -translate-y-[7rem]">
          <div className="flex gap-4 items-center">
            <div className="mr-[2rem] text-[6rem] transform rotate-90">
              <span>:</span>
              <span>(</span>
            </div>
            <h1 className="text-4xl font-bold">No portfolio found.</h1>
          </div>
          <Link href="/indices">
            <Button variant="astra-blue">Go to Indices</Button>
          </Link>
        </div>
      ) : (
        <>
          <AstraHeader>OVERVIEW</AstraHeader>
          <Separator></Separator>
          <div className="flex w-full justify-evenly">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <h1 className="font-bold">{selectedIndex?.ITOKENNAME}</h1>
                <Button
                  variant="astra-blue"
                  size="sm"
                  onClick={() =>
                    setWithdrawIndex(Number(selectedIndex!.ITOKEN_INDEX))
                  }
                >
                  Withdraw
                </Button>
              </div>
              <p>
                <span className="font-bold italic">
                  {selectedIndex?.ITOKENNAME}
                </span>
                &nbsp; Index was last updated on&nbsp;
                {lastrebalancetime?.toLocaleDateString() ?? 'N/A'}
              </p>
              {/* <p>
                <span className="font-bold italic">
                  {selectedIndex?.ITOKENNAME}
                </span>
                &nbsp; Index next update will be on&nbsp;
                {nextrebalancetime?.toLocaleDateString() ?? 'N/A'}
              </p> */}
              <p>
                <span className="font-bold italic">
                  Pending amount to rebalance
                </span>
                &nbsp;{' '}
                {pendingBalance
                  ? Number(
                      formatUnits(BigInt(pendingBalance?.POOLPENDINGBALANCE), 6)
                    ).toFixed(2)
                  : 0}{' '}
                USDC
              </p>
            </div>
            <Separator className="w-[1px]" orientation="vertical"></Separator>
            <div className="flex flex-col gap-4">
              <div>
                Amount Deposited: {selectedIndex?.DEPOSITED_AMOUNT.toFixed(2)}{' '}
                USD
              </div>
              <div>Live profit: $0</div>
              <div>
                {selectedIndex?.ITOKENSYMBOL} Balance:&nbsp;
                <AstraLoading isLoading={itokenBalanceLoading}>
                  {itokenBalanceFormatted}
                </AstraLoading>
                &nbsp; iToken
              </div>
            </div>
            <Separator className="w-[1px]" orientation="vertical"></Separator>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div>Rebalance Time Horizon:</div>
                <div className="uppercase">{rebalancingStatus}</div>
              </div>
              <div className="flex gap-4">
                <div>Countdown to Next Rebalancing:</div>
                <div>
                  <AstraCountdown cooldownDate={nextrebalancetime} />
                </div>
              </div>
              {!selectedIndex?.IS_DELISTED &&
                selectedIndex?.OWNER === address && (
                  <div className="flex gap-2">
                    <Button
                      variant="astra-blue"
                      size="sm"
                      disabled={
                        poolInfo === undefined ||
                        !rebalancedThresoldReached ||
                        !rebalanceTimestampTriggered
                      }
                      tooltip={
                        !rebalancedThresoldReached
                          ? 'You can not rebalance index until thresold is reached.'
                          : !rebalanceTimestampTriggered
                            ? 'You can not rebalance index until rebalance time is reached.'
                            : undefined
                      }
                      isLoading={poolInfoLoading}
                      onClick={() => {
                        setRebalanceModal(true)
                      }}
                    >
                      Rebalance
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="astra-blue"
                          disabled={selectedIndex === undefined}
                        >
                          Shutdown
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Shutdown Index</AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="flex flex-col gap-6 justify-center">
                              Are you sure want to shut down index?
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (selectedIndex !== undefined) {
                                delistIndex?.({
                                  indexAddress: selectedIndex?.ITOKEN_ADDR,
                                  indexId: selectedIndex?.ITOKEN_INDEX,
                                  date: format(new Date(), 'dd-MM-yyyy'),
                                })
                              }
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
            </div>
          </div>
          <Separator></Separator>
          {selectedIndex === undefined || assetsData === undefined ? (
            <div className="flex items-center justify-center min-h-[60vh] w-full h-full">
              <AstraLoading
                isLoading={assetsDataLoading || userIndicesLoading}
              />
            </div>
          ) : (
            <IndexBody
              className="pb-0"
              index={selectedIndex}
              assetsData={assetsData}
              assetsDataLoading={assetsDataLoading}
            />
          )}
          <div className="flex w-full justify-start">
            <Select onValueChange={setSelected} value={selected}>
              <SelectTrigger className="w-auto min-w-[10rem]">
                <SelectValue placeholder="Select an Index" />
              </SelectTrigger>
              <SelectContent>
                {userIndices?.map((indx) => (
                  <SelectItem value={indx.ITOKEN_INDEX} key={indx.ITOKEN_ADDR}>
                    {indx.ITOKENNAME}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      <RebalanceModal
        rebalanceModal={rebalanceModal}
        setRebalanceModal={setRebalanceModal}
        selectedIndex={selectedIndex}
        assetsData={assetsData}
        isLoading={assetsDataLoading}
        refetchDatas={refetchDatas}
      ></RebalanceModal>
    </div>
  )
}

export { PortfolioOverview }
