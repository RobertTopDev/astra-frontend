'use client'

import { Button } from '@/components/shadcn'
import { useLaunchpadClaimVestingRewards } from '@/hooks'
import { TLaunchpadVestingReward } from '@/types'

type TVestingRewardActionsProps = {
  vestingReward: TLaunchpadVestingReward
  refetchDatas: () => void
}

const VestingRewardActions = ({
  vestingReward,
  refetchDatas,
}: TVestingRewardActionsProps) => {
  const {
    claimVestingRewards,
    isLoading: claimVestingRewardsLoading,
    error: claimVestingRewardsError,
  } = useLaunchpadClaimVestingRewards({
    args: [
      (vestingReward.vestingScheduleID as `0x${string}`) ??
        ('' as `0x${string}`),
    ],
    address: vestingReward.vestingAddress,
    enabled:
      vestingReward.vestingScheduleID !== undefined &&
      vestingReward.releaseAmount > 0 &&
      vestingReward.launchpadTokenDecimals !== undefined,
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
      CLAIM
    </Button>
  )
}

export { VestingRewardActions }
