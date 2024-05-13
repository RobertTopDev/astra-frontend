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
import { ReactNode, useState } from 'react'
import { cn } from '@/lib'
import styles from './claim-astra-rewards-dialog.module.scss'
import { addMonths, format } from 'date-fns'
import { numberFormatter } from '@/util'

type TClaimRewardsDialogProps = {
  children: ReactNode
  stakingType: string
  iTokenStakedIncluded?: boolean
  restake?: ReactNode
  payout: ReactNode
  maxSlashingFee: number
  eligibleToWithdraw?: number
  accruedRewards: number
  receivedRewardValue: number
}

const ClaimRewardsDialog = ({
  children,
  restake,
  payout,
  maxSlashingFee,
  eligibleToWithdraw,
  accruedRewards,
  receivedRewardValue: receivedRewardValue,
  stakingType,
}: TClaimRewardsDialogProps) => {
  const [claimRewardDialog, setClaimRewardDialog] = useState(false)

  return (
    <AstraButtonAuthenticated>
      <Dialog open={claimRewardDialog} onOpenChange={setClaimRewardDialog}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-[90vh] bg-white text-black rounded-xl overflow-y-auto ">
          <div className="flex flex-col gap-6 items-center text-center">
            <div className={cn(styles['ellipse-content'], 'relative')}>
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-32 h-32 border-8 border-astra-blue rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-20 h-20 border-4 border-astra-blue rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-astra-blue rounded-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
            </div>
            <AstraHeader>SELECT PAYOUT METHOD</AstraHeader>
            <Tabs defaultValue="payout" className="w-[400px]">
              <TabsList className="text-muted-foreground">
                <TabsTrigger value="payout">Instant Payout</TabsTrigger>
                {restake && (
                  <TabsTrigger value="re-stake">Re-Stake</TabsTrigger>
                )}
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
                  {eligibleToWithdraw !== undefined && (
                    <div className="flex justify-between">
                      <div className="font-bold">
                        {stakingType} eligible to withdraw
                      </div>
                      <div className="font-bold text-green-400">
                        {numberFormatter(eligibleToWithdraw)} {stakingType}
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
                      ~{numberFormatter(receivedRewardValue)} ASTRADAO
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
                  {eligibleToWithdraw !== undefined && (
                    <div className="flex justify-between">
                      <div className="font-bold">
                        {stakingType} eligible to withdraw
                      </div>
                      <div className="font-bold text-green-400">
                        {numberFormatter(eligibleToWithdraw)} {stakingType}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <div className="font-bold">Rewards</div>
                    <div className="font-bold text-green-400">
                      {numberFormatter(accruedRewards).toLocaleString()}&nbsp;
                      ASTRADAO
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

export { ClaimRewardsDialog }
