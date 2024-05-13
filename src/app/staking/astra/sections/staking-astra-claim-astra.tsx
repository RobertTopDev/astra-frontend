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
import { useMemo } from 'react'
import {
  useChainConfig,
  useClaimAstra,
  useRestakeAstraRewards,
  useWithdrawAstra,
} from '@/hooks'
import { add } from 'date-fns'
import { ClaimRewardsDialog } from '../../components/claim-rewards-dialog'

type TStakingAstraClaimAstraProps = {
  isRefetching: boolean
  isLoading: boolean
  balanceOfAstraStaked: number
  balanceOfAstraInUSD: number
  accruedRewards: number
  accruedRewardsInUSD: number
  astraEligibleToWithdraw: number
  astraEligibleToWithdrawInUSD: number
  slashingRewards: number
  apyInfo: {
    liquidityMiningAPR: number
    stakingRewardsAPR: number
    iTokenAPR: number
  }
  actualUnstakedValue: number
  refetchDatas: () => void
  userInfo:
    | readonly [bigint, bigint, bigint, bigint, bigint, boolean, bigint]
    | undefined
}

const StakingAstraClaimAstra = ({
  isRefetching,
  isLoading,
  balanceOfAstraStaked,
  balanceOfAstraInUSD,
  accruedRewards,
  accruedRewardsInUSD,
  astraEligibleToWithdraw,
  astraEligibleToWithdrawInUSD,
  slashingRewards,
  apyInfo,
  refetchDatas,
  userInfo,
  actualUnstakedValue,
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
    withdrawAstra,
    error: withdrawAstraError,
    isLoading: withdrawAstraLoading,
  } = useWithdrawAstra({
    enabled:
      Number(balanceOfAstraStaked) !== 0 &&
      Number(astraEligibleToWithdraw) !== 0 &&
      userInfo !== undefined &&
      cooldownStatus() !== 1,
    isCooldown: userInfo !== undefined && userInfo[5],
    args: [false],
    onSuccessTx: () => {
      refetchDatas()
    },
  })

  // WITHDRAW WITH STAKED
  const {
    withdrawAstra: withdrawAstraWithStaked,
    error: withdrawAstraWithStakedError,
    isLoading: withdrawAstraWithStakedLoading,
  } = useWithdrawAstra({
    enabled:
      Number(balanceOfAstraStaked) !== 0 &&
      Number(astraEligibleToWithdraw) > 0 &&
      userInfo !== undefined &&
      cooldownStatus() !== 1,
    args: [true],
    isCooldown: userInfo !== undefined && userInfo[5],
    onSuccessTx: () => {
      refetchDatas()
    },
  })

  // CLAIM ASTRA
  const {
    claimAstra,
    error: claimAstraError,
    isLoading: claimAstraLoading,
  } = useClaimAstra({
    enabled: Number(balanceOfAstraStaked) !== 0 && Number(accruedRewards) > 0,
    onSuccessTx: () => {
      refetchDatas()
    },
  })

  // RESTAKE ASTRA
  const {
    restakeAstraRewards,
    error: restakeAstraRewardsError,
    isLoading: restakeAstraRewardsLoading,
  } = useRestakeAstraRewards({
    enabled: Number(balanceOfAstraStaked) !== 0 && Number(accruedRewards) > 0,
    onSuccessTx: () => {
      refetchDatas()
    },
  })

  const withdrawButton = () => {
    if (cooldownStatus() === 0) {
      return (
        <Button
          className="my-2 whitespace-nowrap"
          variant="astra-blue"
          disabled={!withdrawAstra || !!withdrawAstraError}
          isLoading={withdrawAstraLoading || isLoading}
          onClick={() => withdrawAstra?.()}
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
      return (
        <ClaimRewardsDialog
          maxSlashingFee={slashingRewards}
          eligibleToWithdraw={astraEligibleToWithdraw}
          accruedRewards={accruedRewards}
          receivedRewardValue={actualUnstakedValue}
          stakingType="ASTRADAO"
          payout={
            <Button
              variant="astra-blue"
              disabled={!withdrawAstra || !!withdrawAstraError}
              isLoading={withdrawAstraLoading || isLoading}
              onClick={() => withdrawAstra?.()}
            >
              PAYOUT
            </Button>
          }
          restake={
            <Button
              variant="astra-blue"
              disabled={
                !withdrawAstraWithStaked || !!withdrawAstraWithStakedError
              }
              isLoading={withdrawAstraWithStakedLoading || isLoading}
              onClick={() => withdrawAstraWithStaked?.()}
            >
              RE-STAKE
            </Button>
          }
        >
          <Button
            variant="astra-blue"
            disabled={
              !withdrawAstra ||
              !withdrawAstraWithStaked ||
              Number(balanceOfAstraStaked) === 0
            }
            isLoading={isLoading}
            className="my-2"
          >
            UNSTAKE
          </Button>
        </ClaimRewardsDialog>
      )
    }
  }

  const actualClaimableReward = useMemo(() => {
    if (Number(accruedRewards) === 0) return 0
    if (Number(slashingRewards) === 0) return Number(accruedRewards)
    return accruedRewards - (slashingRewards / 100) * accruedRewards
  }, [accruedRewards, slashingRewards])

  return (
    <div className="col-span-6 flex flex-col gap-6 relative">
      {isRefetching && (
        <div className="absolute top-4 right-4">
          <AstraLoading isLoading={true}></AstraLoading>
        </div>
      )}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="font-medium">ASTRADAO STAKED</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
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
                  {numberFormatter(balanceOfAstraStaked)}
                </AstraLoading>
              </div>
              <div className="text-xs">
                <AstraLoading isLoading={isLoading}>
                  $ {numberFormatter(balanceOfAstraInUSD, true)} USD
                </AstraLoading>
              </div>
            </div>
            {withdrawButton()}
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="font-medium">CLAIMABLE ASTRADAO</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
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
            {(!claimAstra && !restakeAstraRewards) ||
            Number(balanceOfAstraStaked) === 0 ? (
              <Button variant="astra-blue" className="my-2">
                CLAIM
              </Button>
            ) : (
              <ClaimRewardsDialog
                maxSlashingFee={slashingRewards}
                eligibleToWithdraw={astraEligibleToWithdraw}
                accruedRewards={accruedRewards}
                receivedRewardValue={actualClaimableReward}
                stakingType="ASTRADAO"
                payout={
                  <Button
                    variant="astra-blue"
                    disabled={!claimAstra || !!claimAstraError}
                    isLoading={claimAstraLoading || isLoading}
                    onClick={() => claimAstra?.()}
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
          <div>ASTRADAO eligible to withdraw</div>
          <div className="font-medium text-sm">
            <AstraLoading isLoading={isLoading}>
              {numberFormatter(astraEligibleToWithdraw)}
            </AstraLoading>
          </div>
        </div>
        <div className="flex justify-between">
          <div></div>
          <div className="font-medium">
            <AstraLoading isLoading={isLoading}>
              $ {numberFormatter(astraEligibleToWithdrawInUSD, true)} USD
            </AstraLoading>
          </div>
        </div>
        <div className="flex justify-between">
          <div>Staking APY</div>
          <div className="font-medium">
            <AstraLoading isLoading={isLoading}>
              {apyInfo.stakingRewardsAPR > 0
                ? numberFormatter(apyInfo.stakingRewardsAPR) + '%'
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

export { StakingAstraClaimAstra }
