'use client'
import {
  useAstraAllowance,
  useAstraDecimal,
  useAstraUSDPrice,
  useAstraUserInfo,
  useAstraAverageStakeTime,
  useBalanceOf,
  useChainConfig,
  useAstraClaimable,
  useAstraMultiplierDecimal,
  useAstraStakingScoreAndMultiplier,
  useAstraViewEligibleAmount,
} from '@/hooks'
import { add } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { StakingAstraStakeAstraCard } from './staking-astra-stake-astra-card'
import { StakingAstraClaimAstra } from './staking-astra-claim-astra'

type TStakingAstraBodyProps = {
  apyInfo: {
    liquidityMiningAPR: number
    stakingRewardsAPR: number
    iTokenAPR: number
  }
}

const StakingAstraBody = ({ apyInfo }: TStakingAstraBodyProps) => {
  const { address } = useAccount()
  const { chainConfig } = useChainConfig()
  const {
    data: astraDecimal,
    isLoading: astraDecimalLoading,
    isRefetching: astraDecimalRefetching,
  } = useAstraDecimal()
  const {
    data: userInfo,
    isLoading: userInfoLoading,
    refetch: refetchUserInfo,
    isRefetching: userInfoRefetching,
  } = useAstraUserInfo({})
  const {
    data: stakingScoreAndMultiplier,
    isLoading: stakingScoreAndMultiplierLoading,
    refetch: refetchStakingScoreAndMultiplier,
    isRefetching: stakingScoreAndMultiplierRefetching,
  } = useAstraStakingScoreAndMultiplier({
    args: !!address && !!userInfo ? [address, userInfo[0]] : undefined,
    enabled: !!address && !!userInfo,
  })
  const {
    data: multiplierDecimal,
    isLoading: multiplierDecimalLoading,
    refetch: refetchMultiplierDecimal,
    isRefetching: multiplierDecimalRefetching,
  } = useAstraMultiplierDecimal({})
  const {
    data: pendingAstra,
    isLoading: pendingAstraLoading,
    refetch: refetchAstraRewards,
    isRefetching: pendingAstraRefetching,
  } = useAstraClaimable({})
  const {
    data: balanceOf,
    isLoading: balanceOfLoading,
    refetch: refetchBalanceOf,
    isRefetching: balanceOfRefetching,
  } = useBalanceOf({
    args: !!address ? [address] : undefined,
    enabled: !!address,
  })
  const {
    data: eligibleAmount,
    isLoading: eligibleAmountLoading,
    refetch: refetchEligibleAmount,
    isRefetching: eligibleAmountRefetching,
  } = useAstraViewEligibleAmount({
    args: !!address ? [address] : undefined,
    enabled: !!address,
  })
  const {
    data: allowance,
    isLoading: allowanceLoading,
    refetch: refetchAllowance,
    isRefetching: allowanceRefetching,
  } = useAstraAllowance({
    args: !!address ? [address, chainConfig.ChefContractAddress] : undefined,
    enabled: !!address,
  })
  const {
    data: astraUSDPrice,
    isLoading: astraUSDPriceLoading,
    isRefetching: astraUSDPriceRefetching,
  } = useAstraUSDPrice({})
  const { data: averageStakedTime } = useAstraAverageStakeTime({})

  const refetchDatas = async () => {
    await Promise.all([
      refetchUserInfo(),
      refetchAstraRewards(),
      refetchStakingScoreAndMultiplier(),
      refetchMultiplierDecimal(),
      refetchAstraRewards(),
      refetchBalanceOf(),
      refetchEligibleAmount(),
      refetchAllowance(),
    ])
  }

  const isRefetching = useMemo(() => {
    return (
      userInfoRefetching ||
      astraDecimalRefetching ||
      stakingScoreAndMultiplierRefetching ||
      multiplierDecimalRefetching ||
      pendingAstraRefetching ||
      balanceOfRefetching ||
      eligibleAmountRefetching ||
      allowanceRefetching ||
      astraUSDPriceRefetching
    )
  }, [
    userInfoRefetching,
    astraDecimalRefetching,
    stakingScoreAndMultiplierRefetching,
    multiplierDecimalRefetching,
    pendingAstraRefetching,
    balanceOfRefetching,
    eligibleAmountRefetching,
    allowanceRefetching,
    astraUSDPriceRefetching,
  ])

  const isLoading = useMemo(() => {
    return (
      userInfoLoading ||
      astraDecimalLoading ||
      stakingScoreAndMultiplierLoading ||
      multiplierDecimalLoading ||
      pendingAstraLoading ||
      balanceOfLoading ||
      eligibleAmountLoading ||
      allowanceLoading ||
      astraUSDPriceLoading
    )
  }, [
    userInfoLoading,
    astraDecimalLoading,
    stakingScoreAndMultiplierLoading,
    multiplierDecimalLoading,
    pendingAstraLoading,
    balanceOfLoading,
    eligibleAmountLoading,
    allowanceLoading,
    astraUSDPriceLoading,
  ])

  const balanceOfAstraUnStaked = useMemo(() => {
    if (balanceOf === undefined || astraDecimal === undefined) return 0
    return Number(formatUnits(balanceOf, astraDecimal?.valueOf()))
  }, [balanceOf, astraDecimal])
  const astraEligibleToWithdraw = useMemo(() => {
    if (eligibleAmount === undefined || astraDecimal === undefined) return 0
    return Number(formatUnits(eligibleAmount, astraDecimal?.valueOf()))
  }, [eligibleAmount, astraDecimal])
  const astraEligibleToWithdrawInUSD = useMemo(() => {
    if (astraUSDPrice === undefined || astraEligibleToWithdraw === 0) return 0
    return astraEligibleToWithdraw * astraUSDPrice
  }, [astraEligibleToWithdraw, astraUSDPrice])
  const balanceOfAstraStaked = useMemo(() => {
    if (userInfo === undefined || astraDecimal === undefined) return 0
    return Number(formatUnits(userInfo[0], astraDecimal?.valueOf()))
  }, [userInfo, astraDecimal])
  const balanceOfAstraInUSD = useMemo(() => {
    if (astraUSDPrice === undefined || balanceOfAstraStaked === 0) return 0
    return balanceOfAstraStaked * astraUSDPrice
  }, [astraUSDPrice, balanceOfAstraStaked])
  const stakingScore = useMemo(() => {
    if (stakingScoreAndMultiplier === undefined || astraDecimal === undefined)
      return 0
    return Number(
      formatUnits(stakingScoreAndMultiplier[0], astraDecimal?.valueOf())
    )
  }, [stakingScoreAndMultiplier, astraDecimal])
  const rewardMultiplier = useMemo(() => {
    if (
      stakingScoreAndMultiplier === undefined ||
      multiplierDecimal === undefined
    )
      return 1
    try {
      return (
        Number(stakingScoreAndMultiplier[1]) /
        Number(multiplierDecimal?.valueOf())
      )
    } catch (err) {
      console.error({ stakingScoreAndMultiplier, multiplierDecimal })
      console.error({ err })
      return 1
    }
  }, [stakingScoreAndMultiplier, multiplierDecimal])

  const accruedRewards = useMemo(() => {
    if (!pendingAstra || !astraDecimal) return 0
    return Number(formatUnits(pendingAstra, astraDecimal?.valueOf()))
  }, [pendingAstra, astraDecimal])
  const accruedRewardsInUSD = useMemo(() => {
    if (astraUSDPrice === undefined) return 0
    return accruedRewards * astraUSDPrice
  }, [accruedRewards, astraUSDPrice])

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
    const diff = Math.ceil(
      (ts.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )

    // let diff =
    //   astraSlashingFeeUnit === 'days'
    //     ? differenceInDays(ts, new Date())
    //     : differenceInMinutes(ts, new Date(), { roundingMethod: 'ceil' })
    // if (astraSlashingFeeUnit === 'minutes') {
    //   let consumedLimit = chainConfig.astraSlashingFeeValue - diff
    //   consumedLimit = consumedLimit / 5
    //   consumedLimit = Math.ceil(consumedLimit)
    //   diff = 90 - consumedLimit
    // }
    return diff <= 0 ? 0 : diff > 90 ? 90 : diff
  }, [averageStakedTime, chainConfig, userInfo])
  useMemo(() => {
    if (userInfo === undefined || Number(userInfo[6]) === 0 || !userInfo[5])
      return 0
    const cooldownUserTimestamp = Number(userInfo[6])
    const cooldownDays = chainConfig.cooldownDetails.ASTRAStakingCooldownDays
    const cooldownUnit =
      chainConfig.cooldownDetails.ASTRAStakingCooldownDaysUnit
    return add(new Date(cooldownUserTimestamp * 1000), {
      [cooldownUnit]: cooldownDays,
    })
  }, [userInfo, chainConfig])
  const actualUnstakedValue = useMemo(() => {
    return (
      accruedRewards -
      (maxSlashingFee / 100) * accruedRewards +
      astraEligibleToWithdraw
    )
  }, [accruedRewards, maxSlashingFee, astraEligibleToWithdraw])

  useEffect(() => {
    const timer = setInterval(() => {
      refetchDatas()
    }, 10000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="grid grid-cols-12 gap-12 [&>div]:bg-gray-400/50 [&>div]:px-12 [&>div]:py-6 [&>div]:rounded-lg">
      <StakingAstraStakeAstraCard
        isRefetching={isRefetching}
        allowance={Number(allowance)}
        isLoading={isLoading}
        stakingScore={stakingScore}
        rewardMultiplier={rewardMultiplier}
        balanceOfAstraUnStaked={balanceOfAstraUnStaked}
        accruedRewards={accruedRewards}
        astraDecimal={astraDecimal}
        refetchAllowance={refetchAllowance}
        refetchDatas={refetchDatas}
      />
      <StakingAstraClaimAstra
        isRefetching={isRefetching}
        actualUnstakedValue={actualUnstakedValue}
        isLoading={isLoading}
        balanceOfAstraStaked={balanceOfAstraStaked}
        balanceOfAstraInUSD={balanceOfAstraInUSD}
        accruedRewards={accruedRewards}
        accruedRewardsInUSD={accruedRewardsInUSD}
        astraEligibleToWithdraw={astraEligibleToWithdraw}
        astraEligibleToWithdrawInUSD={astraEligibleToWithdrawInUSD}
        slashingRewards={maxSlashingFee}
        apyInfo={apyInfo}
        refetchDatas={refetchDatas}
        userInfo={userInfo}
      />
    </div>
  )
}

export { StakingAstraBody }
