'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import {
  useAstraStakingScoreAndMultiplier,
  useAstraUserInfo,
  useAstraDecimal,
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
} from '@/components/shadcn'
import { AstraHeader, AstraLoading } from '@/components'

export default function Stake() {
  const { address } = useAccount()

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
              <AstraLoading isLoading={stakingScoreAndMultiplierLoading}>
                {stakingScore.toFixed(2)}
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
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr]:border-0 text-left">
                <TableRow className="h-24">
                  <TableCell>Staking Score</TableCell>
                  <TableCell>0.00 points</TableCell>
                  <TableCell>
                    Staking $ASTRADAO tokens gives an additional bonus score
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="astra-blue" className="rounded-lg w-fit">
                      Stake AstraDAO
                    </Button>
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
