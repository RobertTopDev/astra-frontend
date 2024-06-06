'use client'

import React, { useMemo, useState } from 'react'
import {
  Card,
  Input,
  Button,
  CardContent,
  Label,
  Select,
  SelectTrigger,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn'
import { AstraButtonAuthenticated, AstraLoading } from '@/components'
import {
  useLaunchpadBuy,
  useAllowance,
  useApprove,
  useChainConfig,
  useDecimals,
  useErcBalanceOf,
  useLaunchpadCountdown,
  useFollowCheck,
} from '@/hooks/'
import { useAccount } from 'wagmi'
import { formatUnits, parseEther, parseUnits } from 'viem'
import { TLaunchpadDetailInfo } from '@/types'
import Countdown from './Countdown'
import { InfoCircledIcon } from '@radix-ui/react-icons'

type Props = {
  detail: TLaunchpadDetailInfo
  factoryLoading: boolean
  launchpadAddress: `0x${string}`
  launchpadData: any
  launchpadLoading: boolean
  refetchLaunchpadData: () => void
  buyRuleStatus: any
}

export default function BuyContent({
  detail,
  factoryLoading,
  launchpadAddress,
  launchpadData,
  launchpadLoading,
  refetchLaunchpadData,
  buyRuleStatus,
}: Props) {
  const { address } = useAccount()
  const { chainConfig } = useChainConfig()

  const [buyAmount, setBuyAmount] = useState<string>('')
  const [selectedToken, setSelectedToken] = useState<string>('')

  const tokenArray = [
    {
      symbol: 'USDT',
      address: chainConfig.USDTContractAddress,
    },
    {
      symbol: 'USDC',
      address: chainConfig.USDCContractAddress,
    },
    {
      symbol: 'ETH',
      address: chainConfig.WETHContractAddress,
    },
  ]

  const followingTemp = useFollowCheck(address)
  const followingData = followingTemp.data
  const follwingDataLoading = followingTemp.isLoading
  const telegramfollowing: boolean =
    followingData?.[0]?.IS_TELEGRAM_FOLLOWING || false

  const { remainingTime: startRemainingTime, ...startCountdown } =
    useLaunchpadCountdown({
      cooldownDate: launchpadData
        ? new Date(Number(launchpadData[4].result) * 1000)
        : undefined,
    })
  const { remainingTime: endRemainingTime, ...endCountdown } =
    useLaunchpadCountdown({
      cooldownDate: launchpadData
        ? new Date(Number(launchpadData[5].result) * 1000)
        : undefined,
    })

  // get accept token allowanced
  const selectedTokenAddress = selectedToken as `0x${string}`
  const {
    data: tokenAllowance,
    isLoading: tokenAllowanceLoading,
    refetch: refetchTokenAllowance,
  } = useAllowance({
    address: selectedTokenAddress,
    args: [address ?? ('' as `0x${string}`), launchpadAddress],
    enabled: !!address && !!selectedToken && !!launchpadAddress,
  })

  // get accept token balance of wallet
  const { data: balanceOf, isLoading: balanceOfLoading } = useErcBalanceOf({
    address: selectedTokenAddress,
    args: [address ?? ('' as `0x${string}`)],
    enabled: !!address,
  })

  // base token decimals
  const { data: tokenDecimals, isLoading: tokenDecimalsLoading } = useDecimals({
    address: detail.BASE_TOKEN as `0x${string}`,
    enabled: !!detail,
  })

  const selectedTokenBalance = useMemo(
    () =>
      balanceOf && tokenDecimals ? formatUnits(balanceOf, tokenDecimals) : '',
    [balanceOf, tokenDecimals]
  )

  // APPROVE
  const {
    approve,
    error: approveError,
    isLoading: approveLoading,
  } = useApprove({
    address: selectedToken as `0x${string}`,
    minAmount: tokenDecimals ? parseUnits(buyAmount || '0', tokenDecimals) : 0,
    enabled:
      !!selectedToken &&
      !!buyAmount &&
      tokenAllowance !== undefined &&
      tokenDecimals !== undefined &&
      tokenAllowance < parseUnits(buyAmount ?? '0', tokenDecimals) &&
      !!launchpadAddress,
    spender: launchpadAddress as `0x${string}`,
    onSuccessTx: () => {
      refetchTokenAllowance()
    },
  })
  // Buy
  const {
    buyToken,
    error: buyTokenError,
    isLoading: buyTokenLoading,
  } = useLaunchpadBuy({
    enabled:
      !!selectedToken &&
      !!address &&
      (selectedToken === chainConfig.WETHContractAddress
        ? Number(buyAmount) > 0
        : tokenAllowance !== undefined &&
          tokenDecimals !== undefined &&
          tokenAllowance >= parseUnits(buyAmount || '0', tokenDecimals)) &&
      !!launchpadAddress &&
      !!detail,
    args:
      selectedToken === chainConfig.WETHContractAddress
        ? [
            address as `0x${string}`,
            `${chainConfig.WETHContractAddress}`,
            BigInt(0),
          ]
        : [
            address as `0x${string}`,
            selectedToken as `0x${string}`,
            tokenDecimals
              ? parseUnits(buyAmount || '0', tokenDecimals)
              : BigInt(0),
          ],
    value:
      selectedToken === chainConfig.WETHContractAddress
        ? parseEther(buyAmount)
        : undefined,
    address: launchpadAddress,
    databaseData: {
      launchpadIndex: detail.LAUNCHPAD_INDEX,
      launchpadAddress: launchpadAddress,
      contributorAddress: address as `0x${string}`,
      contributedAmount: Number(buyAmount),
    },
    onSuccessTx: () => {
      refetchLaunchpadData()
      setBuyAmount('')
      setSelectedToken('')
    },
  })

  const buyButton = () => {
    if (
      tokenAllowance !== undefined &&
      tokenDecimals !== undefined &&
      tokenAllowance < parseUnits(buyAmount || '0', tokenDecimals) &&
      selectedToken !== chainConfig.WETHContractAddress
    ) {
      return (
        <Button
          variant="astra-blue"
          className="rounded-lg h-[52px]"
          disabled={
            !approve ||
            !!approveError ||
            approveLoading ||
            !buyRuleStatus[0]?.result ||
            buyRuleStatus[1]?.result[0] <= 0 ||
            !telegramfollowing
          }
          isLoading={isFetchLoading || isActionLoading}
          onClick={() => approve?.()}
        >
          <span className="text-base">Approve</span>
        </Button>
      )
    } else {
      return (
        <Button
          variant="astra-blue"
          className="rounded-lg h-[52px]"
          disabled={
            !buyToken ||
            !!buyTokenError ||
            !buyRuleStatus ||
            (buyRuleStatus &&
              (!buyRuleStatus[0]?.result || !buyRuleStatus[1]?.result)) ||
            !telegramfollowing
          }
          isLoading={isFetchLoading || isActionLoading}
          onClick={() => buyToken?.()}
        >
          <span className="text-base">BUY</span>
        </Button>
      )
    }
  }
  const onSelectToken = (value: string) => setSelectedToken(value)
  const onBuyAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    // check e.target.value is number
    if (isNaN(Number(e.target.value))) return
    setBuyAmount(e.target.value)
  }

  // loading
  const isFetchLoading =
    factoryLoading ||
    launchpadLoading ||
    tokenDecimalsLoading ||
    follwingDataLoading
  const isActionLoading =
    tokenAllowanceLoading ||
    approveLoading ||
    buyTokenLoading ||
    balanceOfLoading

  // countdown time renderer
  const countdownTimeRenderer = () => (
    <div>
      {startRemainingTime > 0 ? (
        <>
          <Countdown
            remainingTime={startRemainingTime}
            timeValues={startCountdown}
          />
          <div className="pt-4">Public Sale Starts In</div>
        </>
      ) : startRemainingTime <= 0 && endRemainingTime > 0 ? (
        <>
          <Countdown
            remainingTime={endRemainingTime}
            timeValues={endCountdown}
          />
          <div className="pt-4">Public Sale Ends In</div>
        </>
      ) : (
        <>
          <Countdown
            remainingTime={endRemainingTime}
            timeValues={endCountdown}
          />
          <div className="pt-4">Public Sale Finished</div>
        </>
      )}
    </div>
  )

  return (
    <Card className="w-full relative border-0 col-span-1 rounded-3xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl p-10">
      <CardContent className="p-0 flex flex-row items-stretch gap-8">
        <div className="w-1/2 px-12 py-16 bg-[#292944] rounded-3xl flex flex-col justify-center">
          <div className="border border-solid border-[#00E7FF] p-6 rounded-xl w-fit mx-auto text-center">
            {countdownTimeRenderer()}
          </div>
          <div className="mt-12">
            <Label>Amount</Label>
            <div className="bg-[#FBF8F8] rounded-lg p-2 flex w-full gap-2">
              <div className="flex flex-col flex-grow">
                <Input
                  className="flex-grow px-4 py-0 text-black border-none focus-visible:outline-none focus-visible:ring-0  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="e.g. 1000"
                  value={buyAmount}
                  onChange={onBuyAmount}
                />
              </div>
              <Button
                variant="outline"
                className="text-[#292944] border-0"
                onClick={() => setBuyAmount(selectedTokenBalance)} // should be changed with combine of limited amount
              >
                Max
              </Button>
            </div>
          </div>
          <div className="mt-12 flex justify-between gap-4 items-end">
            <div className="flex-1">
              <Label>Buy With</Label>
              <Select disabled={isActionLoading} onValueChange={onSelectToken}>
                <SelectTrigger className="bg-[#FBF8F8] rounded-lg p-4 flex w-full gap-2 h-[52px]">
                  <SelectValue placeholder="Select Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Token</SelectLabel>
                    {tokenArray
                      .filter((token) => token.address === detail.BASE_TOKEN)
                      .map((token) => (
                        <SelectItem value={token.address}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <AstraButtonAuthenticated>{buyButton()}</AstraButtonAuthenticated>
            </div>
          </div>
          {detail?.IS_VESTING ? (
            <div className="mt-12 mb-4 border border-solid border-[#00E7FF] p-4 rounded-xl">
              This is the vesting launchpad.
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="rounded-3xl p-[1px] bg-gradient-to-b from-transparent to-gray-400 shadow-xl w-1/2">
          <div className="p-12 bg-gradient-to-r from-[#51547590] to-[#51547599] rounded-[calc(1.5rem-1px)] flex flex-col gap-4">
            <div className="bg-[#292944] px-6 py-4 flex justify-between items-center` rounded-lg">
              <span className="text-[#7E7E7E]">Status</span>
              <AstraLoading isLoading={isFetchLoading}>
                <span className="text-[#EA8A1A]">
                  {startRemainingTime > 0
                    ? 'Upcoming'
                    : startRemainingTime <= 0 && endRemainingTime > 0
                      ? 'In Progress'
                      : 'Ended'}
                </span>
              </AstraLoading>
            </div>
            <div className="bg-[#292944] px-6 py-4 flex justify-between items-center rounded-lg">
              <div className="flex gap-1 items-center">
                <span className="text-[#7E7E7E]">Tier</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Indicates your participation level based on your
                        multiplier.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <AstraLoading isLoading={isFetchLoading}>
                <span className="text-white">
                  {' '}
                  {Number(launchpadData?.[1].result ?? BigInt(0))}
                </span>
              </AstraLoading>
            </div>
            <div className="bg-[#292944] px-6 py-4 flex justify-between items-center rounded-lg">
              <div className="flex gap-1 items-center">
                <span className="text-[#7E7E7E]">Multiplier</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Represents the boost to your purchase limit, calculated
                        from your staking activities across chains.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <AstraLoading isLoading={isFetchLoading}>
                <span className="text-white">
                  {formatUnits(launchpadData?.[8].result ?? BigInt(0), 13)}
                </span>
              </AstraLoading>
            </div>
            <div className="bg-[#292944] px-6 py-4 flex justify-between items-center rounded-lg">
              <span className="text-[#7E7E7E]">Max Contribution Amount</span>
              <AstraLoading isLoading={isFetchLoading}>
                <span className="text-white">
                  {' '}
                  {formatUnits(
                    launchpadData?.[2].result ?? BigInt(0),
                    tokenDecimals ?? 0
                  )}{' '}
                  {tokenArray
                    .filter((token) => token.address === detail.BASE_TOKEN)
                    .map((token) => token.symbol)}
                </span>
              </AstraLoading>
            </div>
            <div className="bg-[#292944] px-6 py-4 flex justify-between items-center rounded-lg">
              <span className="text-[#7E7E7E]">Min Contribution Amount</span>
              <AstraLoading isLoading={isFetchLoading}>
                <span className="text-white">
                  {' '}
                  {formatUnits(
                    launchpadData?.[12].result ?? BigInt(0),
                    tokenDecimals ?? 0
                  )}{' '}
                  {tokenArray
                    .filter((token) => token.address === detail.BASE_TOKEN)
                    .map((token) => token.symbol)}
                </span>
              </AstraLoading>
            </div>
            <div className="bg-[#292944] px-6 py-4 flex justify-between items-center rounded-lg">
              <span className="text-[#7E7E7E]">Current Rate</span>
              <AstraLoading isLoading={isFetchLoading}>
                <span className="text-white">
                  {`1 ${detail.LAUNCHPAD_TOKEN_SYMBOL} = ${
                    formatUnits(launchpadData?.[3].result ?? BigInt(0), 13) +
                    ` ${tokenArray
                      .filter((token) => token.address === detail.BASE_TOKEN)
                      .map((token) => token.symbol)}`
                  }`}
                </span>
              </AstraLoading>
            </div>
            <div className="bg-[#292944] px-6 py-4 flex justify-between items-center rounded-lg">
              <span className="text-[#7E7E7E]">Total Contributors</span>
              <AstraLoading isLoading={isFetchLoading}>
                <span className="text-white">
                  {Number(launchpadData?.[6].result ?? 0)}
                </span>
              </AstraLoading>
            </div>
            <div className="bg-[#292944] px-6 py-4 flex justify-between items-center rounded-lg">
              <span className="text-[#7E7E7E]">You Invested</span>
              <AstraLoading isLoading={isFetchLoading}>
                <span className="text-white">{`${formatUnits(
                  launchpadData?.[10].result ?? BigInt(0),
                  6
                )} ${tokenArray
                  .filter((token) => token.address === detail.BASE_TOKEN)
                  .map((token) => token.symbol)}`}</span>
              </AstraLoading>
            </div>
            <div className="bg-[#292944] px-6 py-4 flex justify-between items-center rounded-lg">
              <span className="text-[#7E7E7E]">You Purchased</span>
              <AstraLoading isLoading={isFetchLoading}>
                <span className="text-white">{`${formatUnits(
                  launchpadData?.[0].result ?? BigInt(0),
                  detail.LAUNCHPAD_TOKEN_DECIMAL
                )} ${detail.LAUNCHPAD_TOKEN_SYMBOL}`}</span>
              </AstraLoading>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
