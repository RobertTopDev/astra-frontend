import { AstraCountdown, AstraLoading } from '@/components'
import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn'
import { numberFormatter } from '@/util'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { PropsWithChildren, useMemo } from 'react'
import {
  useChainConfig,
  useClaimAstraItoken,
  useRestakeAstraItokenRewards,
  useWithdrawIToken,
} from '@/hooks'
import { add } from 'date-fns'
import { ClaimRewardsDialog } from '../../components/claim-rewards-dialog'

type TStakingAstraClaimAstraProps = {
  isLoading: boolean
  accruedRewards: number
  accruedRewardsInUSD: number
  stakedAmount: number
  stakedAmountInUSD: number
  slashingRewards: number
  apyInfo: {
    liquidityMiningAPR: number
    stakingRewardsAPR: number
    iTokenAPR: number
  }
  eligbleITokenToWithdraw: number
  eligbleITokenToWithdrawUSD: number
  selectedITokenIdx: string | undefined
  refetchDatas: () => void
  actualUnstakedValue: number
  userInfo:
    | readonly [bigint, bigint, bigint, bigint, bigint, boolean, bigint]
    | undefined
}

const StakingITokenClaimIToken = ({
  isLoading,
  accruedRewards,
  accruedRewardsInUSD,
  stakedAmount,
  slashingRewards,
  apyInfo,
  refetchDatas,
  userInfo,
  selectedITokenIdx,
  stakedAmountInUSD,
  actualUnstakedValue,
  eligbleITokenToWithdraw,
  eligbleITokenToWithdrawUSD,
}: TStakingAstraClaimAstraProps) => {
  // WEB3 CONFIG
  const { chainConfig } = useChainConfig()

  const cooldownDate = useMemo(() => {
    if (userInfo === undefined || Number(userInfo[6]) === 0 || !userInfo[5])
      return
    const cooldownUserTimestamp = Number(userInfo[6])
    const cooldownDays = chainConfig.cooldownDetails.ASTRAStakingCooldownDays
    const cooldownUnit =
      chainConfig.cooldownDetails.ASTRAStakingCooldownDaysUnit
    return add(new Date(cooldownUserTimestamp * 1000), {
      [cooldownUnit]: cooldownDays,
    })
  }, [userInfo, chainConfig])

  // ASTRA STATISTICS
  const cooldownStatus = () => {
    if (!cooldownDate) return 0
    const currentTimestamp = new Date()
    return currentTimestamp <= cooldownDate ? 1 : 2
  }

  // WITHDRAW
  const {
    withdrawIToken: withdrawIToken,
    error: withdrawITokenError,
    isLoading: withdrawITokenLoading,
  } = useWithdrawIToken({
    enabled:
      selectedITokenIdx !== undefined &&
      Number(eligbleITokenToWithdraw) > 0 &&
      userInfo !== undefined &&
      cooldownStatus() !== 1,
    isCooldown: userInfo !== undefined && userInfo[5],
    args:
      selectedITokenIdx !== undefined
        ? [BigInt(selectedITokenIdx), false]
        : undefined,
    onSuccessTx: () => {
      refetchDatas()
    },
  })

  // WITHDRAW WITH STAKED
  const {
    withdrawIToken: withdrawITokenWithStaked,
    error: withdrawITokenWithStakedError,
    isLoading: withdrawITokenWithStakedLoading,
  } = useWithdrawIToken({
    enabled:
      selectedITokenIdx !== undefined &&
      Number(eligbleITokenToWithdraw) > 0 &&
      userInfo !== undefined &&
      cooldownStatus() !== 1,
    args:
      selectedITokenIdx !== undefined
        ? [BigInt(selectedITokenIdx), true]
        : undefined,
    onSuccessTx: () => {
      refetchDatas()
    },
  })

  // CLAIM ASTRA Itoken
  const {
    claimAstraIToken,
    error: claimAstraError,
    isLoading: claimAstraLoading,
  } = useClaimAstraItoken({
    enabled: Number(stakedAmount) !== 0 && Number(accruedRewards) > 0,
    onSuccessTx: () => {
      refetchDatas()
    },
  })

  // RESTAKE ASTRA
  const {
    restakeAstraRewards,
    error: restakeAstraRewardsError,
    isLoading: restakeAstraRewardsLoading,
  } = useRestakeAstraItokenRewards({
    enabled: Number(stakedAmount) !== 0 && Number(accruedRewards) > 0,
    onSuccessTx: () => {
      refetchDatas()
    },
  })

  const WaitCooldown = ({ children }: PropsWithChildren) => {
    if (cooldownStatus() === 0) {
      return (
        <Button
          className="my-2 whitespace-nowrap"
          variant="astra-blue"
          disabled={!withdrawIToken || !!withdrawITokenError}
          isLoading={withdrawITokenLoading || isLoading}
          onClick={() => withdrawIToken?.()}
        >
          ACTIVATE COOLDOWN
        </Button>
      )
    } else if (cooldownStatus() === 1) {
      // TODO: GET A TIMER
      return (
        <Button
          className="relative my-2 text-[0.55rem]"
          variant="astra-blue-outline"
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[100%] text-xs text-white">
            COOLING DOWN
          </div>
          <AstraCountdown cooldownDate={cooldownDate} refetch={refetchDatas} />
        </Button>
      )
    } else {
      return children
    }
  }

  const actualClaimableReward = useMemo(() => {
    if (Number(accruedRewards) === 0) return 0
    if (Number(slashingRewards) === 0) return Number(accruedRewards)
    return accruedRewards - (slashingRewards / 100) * accruedRewards
  }, [accruedRewards, slashingRewards])

  return (
    <div className="col-span-6 flex flex-col gap-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="font-medium">iTOKEN STAKED</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="reset">
                    <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      Your assets can be unstaked and withdrawn from the staking
                      vault once the lock up time has ended and at the end of
                      the cool down period. Once the cooldown period of 1-day
                      ends, the unstake window will be active. To activate the
                      cooldown period, click the &apos;Activate Cooldown&apos;
                      button. Unstake and withdraw after the countdown time
                      elapses. Once assets are withdrawn, the cool down button
                      will be reset, and you will need to click the
                      &apos;Activate Cooldown&apos; button again for any future
                      withdrawals.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="bg-white p-4 rounded-lg flex flex-col flex-grow text-black font-medium">
              <div>
                <AstraLoading isLoading={isLoading}>
                  {numberFormatter(stakedAmount)}
                </AstraLoading>
              </div>
              <div className="text-xs">
                <AstraLoading isLoading={isLoading}>
                  $ {numberFormatter(stakedAmountInUSD, true)} USD
                </AstraLoading>
              </div>
            </div>
            <WaitCooldown>
              <ClaimRewardsDialog
                stakingType="iToken"
                maxSlashingFee={slashingRewards}
                eligibleToWithdraw={eligbleITokenToWithdraw}
                accruedRewards={accruedRewards}
                receivedRewardValue={actualUnstakedValue}
                payout={
                  <Button
                    variant="astra-blue"
                    disabled={!withdrawIToken || !!withdrawITokenError}
                    isLoading={withdrawITokenLoading || isLoading}
                    onClick={() => withdrawIToken?.()}
                  >
                    PAYOUT
                  </Button>
                }
                restake={
                  <Button
                    variant="astra-blue"
                    disabled={
                      !withdrawITokenWithStaked ||
                      !!withdrawITokenWithStakedError
                    }
                    isLoading={withdrawITokenWithStakedLoading || isLoading}
                    onClick={() => withdrawITokenWithStaked?.()}
                  >
                    RE-STAKE
                  </Button>
                }
              >
                <Button
                  variant="astra-blue"
                  disabled={
                    !withdrawIToken ||
                    !withdrawITokenWithStaked ||
                    Number(stakedAmount) === 0
                  }
                  isLoading={isLoading}
                  className="my-2"
                >
                  UNSTAKE
                </Button>
              </ClaimRewardsDialog>
            </WaitCooldown>
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="font-medium">CLAIMABLE ASTRADAO</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="reset">
                    <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      The Claimable ASTRADAO is calculated by multiplying
                      ACCURED REWARDS with REWARD MULTIPLIER.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="bg-white p-4 rounded-lg flex flex-col flex-grow text-black font-medium">
              <div>
                <AstraLoading isLoading={isLoading}>
                  {numberFormatter(accruedRewards)}
                </AstraLoading>
              </div>
              <div className="text-xs">
                <AstraLoading isLoading={isLoading}>
                  $ {numberFormatter(accruedRewardsInUSD, true)} USD
                </AstraLoading>
              </div>
            </div>
            {(!claimAstraIToken && !restakeAstraRewards) ||
            Number(stakedAmount) === 0 ? (
              <Button variant="astra-blue" className="my-2">
                CLAIM
              </Button>
            ) : (
              <ClaimRewardsDialog
                stakingType="ASTRADAO"
                maxSlashingFee={slashingRewards}
                eligibleToWithdraw={eligbleITokenToWithdraw}
                accruedRewards={accruedRewards}
                receivedRewardValue={actualClaimableReward}
                payout={
                  <Button
                    variant="astra-blue"
                    disabled={!claimAstraIToken || !!claimAstraError}
                    isLoading={claimAstraLoading || isLoading}
                    onClick={() => claimAstraIToken?.()}
                  >
                    PAYOUT
                  </Button>
                }
                restake={
                  <Button
                    variant="astra-blue"
                    disabled={
                      !restakeAstraRewards || !!restakeAstraRewardsError
                    }
                    isLoading={restakeAstraRewardsLoading || isLoading}
                    onClick={() => restakeAstraRewards?.()}
                  >
                    RE-STAKE
                  </Button>
                }
              >
                <Button
                  variant="astra-blue"
                  isLoading={isLoading}
                  disabled={!claimAstraIToken}
                  className="my-2"
                >
                  CLAIM
                </Button>
              </ClaimRewardsDialog>
            )}
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col text-xs">
        <div className="flex justify-between">
          <div>iToken eligible to withdraw</div>
          <div className="font-medium text-sm">
            <AstraLoading isLoading={isLoading}>
              {numberFormatter(eligbleITokenToWithdraw)}
            </AstraLoading>
          </div>
        </div>
        <div className="flex justify-between">
          <div></div>
          <div className="font-medium">
            <AstraLoading isLoading={isLoading}>
              $ {numberFormatter(eligbleITokenToWithdrawUSD, true)} USD
            </AstraLoading>
          </div>
        </div>
        <div className="flex justify-between">
          <div>Staking APY</div>
          <div className="font-medium">
            <AstraLoading isLoading={isLoading}>
              {apyInfo.iTokenAPR > 0
                ? numberFormatter(apyInfo.iTokenAPR) + '%'
                : 'Coming Soon'}
            </AstraLoading>
          </div>
        </div>
        <div className="flex justify-between">
          <div>Cooldown Period</div>
          <div className="font-medium">
            {chainConfig.cooldownDetails.ASTRAStakingCooldownDays}&nbsp;
            {chainConfig.cooldownDetails.ASTRAStakingCooldownDaysUnit.slice(
              0,
              chainConfig.cooldownDetails.ASTRAStakingCooldownDays === 1
                ? -1
                : undefined
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div>Current Max. Slashing</div>
          <div className="font-medium text-orange-300">
            <AstraLoading isLoading={isLoading}>
              {slashingRewards}%
            </AstraLoading>
          </div>
        </div>
      </div>
    </div>
  )
}

export { StakingITokenClaimIToken }
