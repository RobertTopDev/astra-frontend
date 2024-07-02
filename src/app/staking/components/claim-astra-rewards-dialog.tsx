'use client'
import { AstraButtonAuthenticated, AstraHeader } from '@/components'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shadcn'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import {
  useAstraDecimal,
  useAstraUserInfo,
  useAstraAverageStakeTime,
  useChainConfig,
  useAstraClaimable,
  useAstraViewEligibleAmount,
  useITokenAstraClaimable,
} from '@/hooks'
import { formatUnits } from 'viem'
import { cn } from '@/lib'
import styles from './claim-astra-rewards-dialog.module.scss'
import {
  add,
  addMonths,
  differenceInDays,
  differenceInMinutes,
  format,
} from 'date-fns'
import { numberFormatter } from '@/util'

type TClaimAstraRewardsDialogProps = {
  children: ReactNode
  astraStakedIncluded?: boolean
  astraIncluded?: boolean
  iTokenIncluded?: boolean
  iTokenStakedIncluded?: boolean
  restake: ReactNode
  payout: ReactNode
}

const ClaimAstraRewardsDialog = ({
  children,
  astraIncluded = false,
  restake,
  payout,
}: TClaimAstraRewardsDialogProps) => {
  const [claimRewardDialog, setClaimRewardDialog] = useState(false)
  const { address: userAddress } = useAccount()
  const router = useRouter()
  const { chainConfig } = useChainConfig()

  const { data: astraDecimal } = useAstraDecimal()

  const { data: userInfo } = useAstraUserInfo({})

  const { data: astraRewards } = useAstraClaimable({})

  const { data: iTokenRewards } = useITokenAstraClaimable({})

  const { data: averageStakedTime } = useAstraAverageStakeTime({})

  const { data: eligibleAmount } = useAstraViewEligibleAmount({
    args: !!userAddress ? [userAddress] : undefined,
    enabled: !!userAddress || astraIncluded,
  })

  const astraEligibleToWithdraw = useMemo(() => {
    if (eligibleAmount === undefined || astraDecimal === undefined) return 0
    return formatUnits(eligibleAmount, astraDecimal?.valueOf())
  }, [eligibleAmount, astraDecimal])

  const accruedRewards = useMemo(() => {
    if (
      astraRewards !== undefined &&
      iTokenRewards !== undefined &&
      astraDecimal !== undefined
    ) {
      return Number(
        formatUnits(
          astraRewards?.valueOf() + iTokenRewards?.valueOf(),
          astraDecimal.valueOf()
        )
      )
    } else {
      return 0.0
    }
  }, [astraRewards, iTokenRewards, astraDecimal])

  const maxSlashingFee = useMemo(() => {
    if (averageStakedTime === undefined || userInfo === undefined) return 0
    const userTimestamp =
      averageStakedTime > 0
        ? Number(averageStakedTime)
        : Number(userInfo[4]) /*  : Number(userInfo[6]) */
    const astraSlashingFeeUnit = chainConfig.astraSlashingFeeUnit
    const astraSlashingFeeValue = chainConfig.astraSlashingFeeValue
    const ts = add(new Date(userTimestamp * 1000), {
      [astraSlashingFeeUnit]: astraSlashingFeeValue,
    })
    let diff =
      astraSlashingFeeUnit === 'days'
        ? differenceInDays(ts, new Date())
        : differenceInMinutes(ts, new Date())
    if (astraSlashingFeeUnit === 'minutes') {
      let consumedLimit = chainConfig.astraSlashingFeeValue - diff
      consumedLimit = consumedLimit / 5
      consumedLimit = Math.floor(consumedLimit)
      diff = 90 - consumedLimit
    }
    return diff <= 0 ? 0 : diff
  }, [averageStakedTime, chainConfig, userInfo])

  const actualUnstakedValue = useMemo(() => {
    return astraIncluded
      ? accruedRewards -
          (maxSlashingFee / 100) * accruedRewards +
          Number(astraEligibleToWithdraw)
      : accruedRewards - (maxSlashingFee / 100) * accruedRewards
  }, [accruedRewards, maxSlashingFee, astraEligibleToWithdraw])

  useEffect(() => {
    if (!userAddress) router.push('/')
  }, [userAddress, userInfo])

  return (
    <AstraButtonAuthenticated>
      <Dialog open={claimRewardDialog} onOpenChange={setClaimRewardDialog}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-[90vh] bg-white text-black rounded-xl overflow-y-auto">
          <div className="flex flex-col gap-6 items-center text-center">
            <div className={cn(styles['ellipse-content'], 'relative')}>
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-32 h-32 border-8 border-astra-blue rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-20 h-20 border-4 border-astra-blue rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-astra-blue rounded-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
            </div>
            <AstraHeader>SELECT PAYOUT METHOD</AstraHeader>
            <Tabs defaultValue="payout" className="w-[400px]">
              <TabsList className="text-black/70">
                <TabsTrigger value="payout">Instant Payout</TabsTrigger>
                <TabsTrigger value="re-stake">Re-Stake</TabsTrigger>
              </TabsList>
              <TabsContent value="payout">
                <div className="flex flex-col gap-6">
                  <div>
                    An Instant Payout will lead to your rewards being slashed
                    by&nbsp;
                    <span className="font-bold text-destructive">
                      {maxSlashingFee}%
                    </span>
                    .&nbsp;
                  </div>
                  {astraIncluded && (
                    <div className="flex justify-between">
                      <div className="font-bold">
                        ASTRADAO eligible to withdraw
                      </div>
                      <div className="font-bold text-green-400">
                        {numberFormatter(astraEligibleToWithdraw)} ASTRADAO
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <div className="font-bold">Rewards</div>
                    <div className="font-bold text-green-400">
                      {numberFormatter(accruedRewards)} ASTRADAO
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold">Slashing on Rewards</div>
                    <div className="font-bold text-destructive">
                      {maxSlashingFee}%
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold">You will receive</div>
                    <div className="font-bold text-green-400">
                      {numberFormatter(actualUnstakedValue)} ASTRADAO
                    </div>
                  </div>
                  {payout}
                </div>
              </TabsContent>
              <TabsContent value="re-stake">
                <div className="flex flex-col gap-6">
                  <div>
                    A Re-Stake Payout will lead to your rewards being staked
                    again for 6 months.
                  </div>
                  {astraIncluded && (
                    <div className="flex justify-between">
                      <div className="font-bold">
                        ASTRADAO eligible to withdraw
                      </div>
                      <div className="font-bold text-green-400">
                        {numberFormatter(astraEligibleToWithdraw)} ASTRADAO
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <div className="font-bold">Rewards</div>
                    <div className="font-bold text-green-400">
                      {numberFormatter(accruedRewards).toLocaleString('en-US')}
                      &nbsp; ASTRADAO
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold">Lock in Period</div>
                    <div className="font-bold text-yellow-300">6 months</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold">Unlock Period Details</div>
                    <div className="font-bold text-astra-blue">
                      {format(addMonths(new Date(), 6), 'LLL d, yyyy h:mm a')}
                    </div>
                  </div>
                  {restake}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </AstraButtonAuthenticated>
  )
}

export { ClaimAstraRewardsDialog }
