'use client'

import React, { useMemo, useEffect, useState } from 'react'
import Image from 'next/image'
// import Link from 'next/link'
import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import {
  useAstraStakingScoreAndMultiplier,
  useAstraUserInfo,
  useAstraDecimal,
  useVerifyMultiplierCrosschain,
  useGetCrossChainStakingDetails,
  useGetNativeAmountAndMultiplier,
} from '@/hooks'
import {
  Card,
  CardContent,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Select,
  SelectTrigger,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/shadcn'
import { AstraHeader, AstraLoading } from '@/components'
import { numberFormatter } from '@/util'
import { AxelarQueryAPI, Environment } from '@axelar-network/axelarjs-sdk'
import { getCrossChainMultiplier } from '@/util/getCrossChainMultiplier'
import { chainConfig, chainToId } from '@/config'

const axelarSDK = new AxelarQueryAPI({ environment: Environment.TESTNET })

export default function Stake() {
  const { address } = useAccount()

  const [gasFee, setGasFee] = useState<string>('')
  const [selectedChain, setSelectedChain] = useState<string>('')
  const [selectedChainMultiplier, setSelectedChainMultiplier] =
    useState<Number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { data: astraDecimal } = useAstraDecimal()
  const { data: userInfo } = useAstraUserInfo({})

  const {
    data: stakingScoreAndMultiplier,
    isLoading: stakingScoreAndMultiplierLoading,
  } = useAstraStakingScoreAndMultiplier({
    args: !!address && !!userInfo ? [address, userInfo[0]] : undefined,
    enabled: !!address && !!userInfo,
  })
  const stakingScore = useMemo(() => {
    if (stakingScoreAndMultiplier === undefined || astraDecimal === undefined)
      return 0
    return Number(
      formatUnits(stakingScoreAndMultiplier[0], astraDecimal?.valueOf())
    )
  }, [stakingScoreAndMultiplier, astraDecimal])
  const multiplier = useMemo(() => {
    if (stakingScoreAndMultiplier === undefined) return 0
    return Number(formatUnits(stakingScoreAndMultiplier[1], 13))
  }, [stakingScoreAndMultiplier])

  // Verify Multiplier Cross Chain
  const {
    verifyMultiplierCrosschain,
    error: verifyMultiplierCrsschainError,
    isLoading: verifyMultiplierCrosschainLoading,
  } = useVerifyMultiplierCrosschain({
    enabled: !!address && Number(gasFee) > 0 && !!selectedChain,
    args: [selectedChain, address as `0x${string}`],
    gasFee,
    onSuccessTx: () => {
      // refetchCrossChainDetails()
      // refetchStakingInfo()
    },
  })

  // compare the bsc and current chain multiplier

  const onSelectChain = (value: string) => setSelectedChain(value)

  useEffect(() => {
    async function init() {
      if (!selectedChain) return
      setIsLoading(true)
      // get verify multiplier transaction fee from third party
      const axelarResult: any = await axelarSDK.estimateGasFee(
        'arbitrum-sepolia',
        selectedChain,
        BigInt(21000),
        'auto'
      )
      setGasFee(axelarResult.toString())

      if (!address) return setIsLoading(false)
      const selectedChainId = chainToId[selectedChain]
      const rpcUrl = chainConfig[selectedChainId].rpcURL
      const contractAddress =
        chainConfig[selectedChainId].CrosschainSaleManagerAddress
      const userAddress = address
      const otherChainMultiplier = await getCrossChainMultiplier(
        rpcUrl,
        contractAddress,
        userAddress
      )
      const formatOtherChainMultiplier = Number(
        formatUnits(otherChainMultiplier, 13)
      )
      setSelectedChainMultiplier(formatOtherChainMultiplier)
      setIsLoading(false)
    }

    init()
  }, [axelarSDK, selectedChain, address])

  return (
    <>
      <div className="text-center">
        <AstraHeader>Increase your score to win bigger allocation</AstraHeader>
        <h4>Detailed distribution of your score points earned.</h4>
      </div>
      <Card className="w-full relative mt-8 border-0 col-span-1 rounded-3xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl p-16">
        <CardContent className="p-0 items-stretch gap-8">
          <div className="bg-[#B2C4E833] w-full px-6 py-4 flex justify-between rounded-lg items-center">
            <div className="flex items-center">
              <div className="h-16 w-16">
                <Image
                  alt="prize"
                  className="!relative fill-[#56A8EA]"
                  src="/svgs/prize.svg"
                  style={{ fill: '#56A8EA' }}
                  fill={true}
                />
              </div>
              <span className="text-white text-xl ml-4">Your total score</span>
            </div>
            <span className="text-[#00E7FF] text-xl">
              <AstraLoading isLoading={false}>
                {/* {numberFormatter(stakingScore)} */}
              </AstraLoading>
            </span>
          </div>
          <div>
            <Table>
              <TableHeader className="[&_tr]:border-white :p-2">
                <TableRow className="h-12">
                  <TableHead>Challenges</TableHead>
                  <TableHead>Score Earned</TableHead>
                  <TableHead>About</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr]:border-0 text-left">
                <TableRow className="h-24">
                  <TableCell>Staking Score</TableCell>
                  <TableCell>{numberFormatter(stakingScore)} points</TableCell>
                  <TableCell>
                    Staking $ASTRADAO tokens gives an additional bonus score
                  </TableCell>
                  <TableCell>
                    <Select
                      disabled={verifyMultiplierCrosschainLoading}
                      onValueChange={onSelectChain}
                    >
                      <SelectTrigger className="bg-[#FBF8F8] rounded-lg p-4 flex w-full gap-2 h-[52px]">
                        <SelectValue placeholder="Select Chain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Chain</SelectLabel>
                          <SelectItem value="binance">Binance</SelectItem>
                          {/* <SelectItem value="ethereum">
                            Ethereum
                          </SelectItem>
                          <SelectItem value="polygon">
                            Polygon
                          </SelectItem>
                          <SelectItem value="base">
                            Base
                          </SelectItem> */}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* <Link href="/staking/astra"> */}
                    <Button
                      variant="astra-blue"
                      className="rounded-lg w-fit"
                      onClick={() => verifyMultiplierCrosschain?.()}
                      isLoading={verifyMultiplierCrosschainLoading || isLoading}
                      disabled={
                        !!verifyMultiplierCrsschainError ||
                        !selectedChain ||
                        selectedChainMultiplier === multiplier
                      }
                    >
                      {verifyMultiplierCrosschainLoading || isLoading
                        ? 'Loading...'
                        : 'Transfer Staking Score'}
                    </Button>
                    {/* </Link> */}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
