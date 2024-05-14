'use client'
import { Button } from '@/components/shadcn'
import { useAstraDecimal, useClaimVestingRewards } from '@/hooks'
import { TVestingReward } from '@/types'
import { parseUnits } from 'viem'

type TVestingRewardActionsProps = {
  vestingReward: TVestingReward
  refetchDatas: () => void
}

const VestingRewardActions = ({
  vestingReward,
  refetchDatas,
}: TVestingRewardActionsProps) => {
  const { data: astraDecimal } = useAstraDecimal()
  const {
    claimVestingRewards,
    isLoading: claimVestingRewardsLoading,
    error: claimVestingRewardsError,
  } = useClaimVestingRewards({
    args:
      vestingReward.vestingScheduleID !== undefined &&
      vestingReward.releaseAmount > 0 &&
      astraDecimal !== undefined
        ? [
            vestingReward.vestingScheduleID,
            parseUnits(vestingReward.releaseAmount + '', astraDecimal),
          ]
        : undefined,
    enabled:
      vestingReward.vestingScheduleID !== undefined &&
      vestingReward.releaseAmount > 0 &&
      astraDecimal !== undefined,
    onSuccessTx: () => {
      refetchDatas?.()
    },
  })

  return (
    <Button
      onClick={() => {
        claimVestingRewards?.()
      }}
      disabled={!claimVestingRewards || !!claimVestingRewardsError}
      isLoading={claimVestingRewardsLoading}
      variant="astra-blue"
    >
      CLAIM ASTRADAO
    </Button>
  )
}

export { VestingRewardActions }
