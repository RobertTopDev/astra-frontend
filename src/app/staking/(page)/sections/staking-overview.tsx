'use client'
import {
  AstraButtonAuthenticated,
  AstraHeader,
  AstraLoading,
} from '@/components'
import { Button, Separator } from '@/components/shadcn'
import {
  useAstraDecimal,
  useAstraUserInfo,
  useClaimAstra,
  useAstraClaimable,
  useRestakeAstra,
  useITokenAstraClaimable,
  useClaimAstraItoken,
} from '@/hooks'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { ClaimAstraRewardsDialog } from '../../components/claim-astra-rewards-dialog'
import { numberFormatter } from '@/util'

const StakingOverview = () => {
  const { data: astraDecimal, isLoading: astraDecimalLoading } =
    useAstraDecimal()

  const {
    data: userInfo,
    isLoading: stakedBalanceLoading,
    refetch: refetchUserInfo,
  } = useAstraUserInfo({})

  const {
    data: astraRewards,
    isLoading: astraRewardsLoading,
    refetch: refetchAstraRewards,
  } = useAstraClaimable({})

  const {
    data: iTokenRewards,
    refetch: refetchITokenRewards,
    isLoading: iTokenRewardsLoading,
  } = useITokenAstraClaimable({})

  const {
    restake,
    isLoading: restakeLoading,
    error: restakeError,
  } = useRestakeAstra({
    onSuccessTx: () => {
      refetchAstraRewards()
      refetchITokenRewards()
      refetchUserInfo()
    },
  })

  const {
    claimAstra,
    isLoading: claimAstraLoading,
    error: claimAstraError,
  } = useClaimAstra({
    onSuccessTx: () => {
      refetchAstraRewards()
      refetchITokenRewards()
      refetchUserInfo()
    },
  })

  // CLAIM ASTRA
  const {
    claimAstraIToken,
    error: claimITokenError,
    isLoading: claimITokenLoading,
  } = useClaimAstraItoken({
    onSuccessTx: () => {
      refetchAstraRewards()
      refetchITokenRewards()
      refetchUserInfo()
    },
  })

  const astraReward = useMemo(() => {
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

  const payout = () => {
    if (astraRewards && astraRewards.valueOf() > BigInt(0)) {
      claimAstra?.()
    } else if (iTokenRewards && iTokenRewards.valueOf() > BigInt(0)) {
      claimAstraIToken?.()
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-6 py-12 w-full m-auto">
      <AstraHeader>OVERVIEW</AstraHeader>
      <div className="flex flex-col justify-center items-center gap-4">
        <Separator className="bg-astra-blue h-[2px]" />
        <div className="grid px-5">
          <div className="col-span-8 flex flex-col gap-4">
            <div className="text-lg">
              Your claimable ASTRADAO this week:&nbsp;
              <AstraLoading
                isLoading={
                  astraRewardsLoading ||
                  astraDecimalLoading ||
                  iTokenRewardsLoading
                }
              >
                {numberFormatter(astraReward)}
              </AstraLoading>
            </div>
            <div>
              Total ASTRADAO Locked:&nbsp;
              <AstraLoading
                isLoading={stakedBalanceLoading || astraDecimalLoading}
              >
                {userInfo !== undefined && astraDecimal !== undefined
                  ? numberFormatter(formatUnits(userInfo[0], astraDecimal))
                  : 0.0}
                &nbsp;
              </AstraLoading>
            </div>
          </div>
        </div>
        <Separator className="bg-astra-blue h-[2px]" />
      </div>
      <AstraButtonAuthenticated>
        <ClaimAstraRewardsDialog
          payout={
            <Button
              variant="astra-blue"
              disabled={!claimAstra || !!claimAstraError || !!claimITokenError}
              isLoading={claimAstraLoading || claimITokenLoading}
              onClick={payout}
            >
              PAYOUT
            </Button>
          }
          restake={
            <Button
              variant="astra-blue"
              disabled={!restake || !!restakeError}
              isLoading={restakeLoading}
              onClick={() => restake?.()}
            >
              RE-STAKE
            </Button>
          }
        >
          <Button variant="astra-blue">CLAIM REWARD</Button>
        </ClaimAstraRewardsDialog>
      </AstraButtonAuthenticated>
    </div>
  )
}

export { StakingOverview }
