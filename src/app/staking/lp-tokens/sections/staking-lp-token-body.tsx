'use client'
import {
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
  useGetAllLpTokens,
  useLpTokenUserAllStakeInfo,
  useLpTokenPositions,
} from '@/hooks'
import { add } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { StakingLpTokenClaimLpToken } from './staking-lp-token-claim-lp-token'
import { StakingLpTokenStakeLpTokenCard } from './staking-lp-token-stake-itoken-card'

type TStakingLpTokenBodyProps = {
  apyInfo: {
    liquidityMiningAPR: number
    stakingRewardsAPR: number
    iTokenAPR: number
  }
}

const StakingLpTokenBody = ({ apyInfo }: TStakingLpTokenBodyProps) => {
  const { address } = useAccount()
  const { chainConfig } = useChainConfig()

  const { data: lpTokens, isLoading: lpTokensLoading } = useGetAllLpTokens({})
  const [selectedPairIdx, setSelectedPairIdx] = useState<string | undefined>(
    '0'
  )
  const selectedPair = useMemo(
    () =>
      selectedPairIdx === undefined
        ? undefined
        : lpTokens !== undefined && lpTokens.length > 0
          ? lpTokens[Number(selectedPairIdx)]
          : undefined,
    [selectedPairIdx, lpTokens]
  )

  const {
    data: lpTokenPositions,
    isLoading: lpTokenPositionsLoading,
    isRefetching: lpTokenPositionsRefetching,
    refetch: refetchLpTokenPositions,
  } = useLpTokenPositions({
    selectedPair,
  })

  const {
    data: lpTokenUserAllStakeInfo,
    isLoading: lpTokenUserAllStakeInfoLoading,
    isRefetching: lpTokenUserAllStakeInfoRefetching,
    refetch: refetchLpTokenUserAllStakeInfo,
  } = useLpTokenUserAllStakeInfo({})
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
    data: eligibleAstraAmount,
    isLoading: eligibleAstraAmountLoading,
    refetch: refetchEligibleAstraAmount,
    isRefetching: eligibleAmountAstraRefetching,
  } = useAstraViewEligibleAmount({
    args: address !== undefined ? [address] : undefined,
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
      refetchEligibleAstraAmount(),
      // refetchAllowance(),
      // refetchLpTokenUserInfo(),
      refetchLpTokenUserAllStakeInfo(),
      refetchLpTokenPositions(),
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
      eligibleAmountAstraRefetching ||
      // allowanceRefetching ||
      astraUSDPriceRefetching ||
      // lpTokenUserInfoRefetching ||
      lpTokenUserAllStakeInfoRefetching ||
      lpTokenPositionsRefetching
    )
  }, [
    userInfoRefetching,
    astraDecimalRefetching,
    stakingScoreAndMultiplierRefetching,
    multiplierDecimalRefetching,
    pendingAstraRefetching,
    balanceOfRefetching,
    eligibleAmountAstraRefetching,
    // allowanceRefetching,
    astraUSDPriceRefetching,
    // lpTokenUserInfoRefetching,
    lpTokenUserAllStakeInfoRefetching,
    lpTokenPositionsRefetching,
  ])

  const isLoading = useMemo(() => {
    return (
      userInfoLoading ||
      astraDecimalLoading ||
      stakingScoreAndMultiplierLoading ||
      multiplierDecimalLoading ||
      pendingAstraLoading ||
      balanceOfLoading ||
      eligibleAstraAmountLoading ||
      // allowanceLoading ||
      astraUSDPriceLoading ||
      // lpTokenUserInfoLoading ||
      lpTokenUserAllStakeInfoLoading ||
      lpTokenPositionsLoading ||
      lpTokensLoading
    )
  }, [
    userInfoLoading,
    astraDecimalLoading,
    stakingScoreAndMultiplierLoading,
    multiplierDecimalLoading,
    pendingAstraLoading,
    balanceOfLoading,
    eligibleAstraAmountLoading,
    // allowanceLoading,
    astraUSDPriceLoading,
    // lpTokenUserInfoLoading,
    lpTokenUserAllStakeInfoLoading,
    lpTokenPositionsLoading,
    lpTokensLoading,
  ])

  const balanceOfAstraUnStaked = useMemo(() => {
    if (balanceOf === undefined || astraDecimal === undefined) return 0
    return Number(formatUnits(balanceOf, astraDecimal?.valueOf()))
  }, [balanceOf, astraDecimal])
  const astraEligibleToWithdraw = useMemo(() => {
    if (eligibleAstraAmount === undefined || astraDecimal === undefined)
      return 0
    return Number(formatUnits(eligibleAstraAmount, astraDecimal?.valueOf()))
  }, [eligibleAstraAmount, astraDecimal])
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
      console.log({ stakingScoreAndMultiplier, multiplierDecimal })
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

    return diff <= 0 ? 0 : diff > 90 ? 90 : diff
  }, [averageStakedTime, chainConfig, userInfo])
  const cooldownDate = useMemo(() => {
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

  const eligibleWithdrawableNFTId = useMemo(() => {
    if (lpTokenUserAllStakeInfo === undefined) return 'N/A'
    return lpTokenUserAllStakeInfo
      .reduce((acc, cur) => {
        if (
          cur.isERC721 &&
          cur.withdrawTime === 0 &&
          new Date().getTime() > cur.timestamp + cur.vault * 60 * 60
        )
          return acc + cur.lpTokenId + ', '
        return acc
      }, '')
      .slice(0, -2)
  }, [lpTokenUserAllStakeInfo])

  useEffect(() => {
    const timer = setInterval(() => {
      refetchDatas()
    }, 10000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  console.log({
    userInfo,
    astraDecimal,
    stakingScoreAndMultiplier,
    multiplierDecimal,
    pendingAstra,
    balanceOf,
    eligibleAmount: eligibleAstraAmount,
    astraUSDPrice,
    averageStakedTime,
    maxSlashingFee,
    cooldownDate,
    actualUnstakedValue,
    eligibleWithdrawableNFTId,
    balanceOfAstraUnStaked,
    astraEligibleToWithdraw,
    balanceOfAstraStaked,
    balanceOfAstraInUSD,
    stakingScore,
    rewardMultiplier,
    accruedRewards,
    accruedRewardsInUSD,
    astraEligibleToWithdrawInUSD,
    selectedPair,
    lpTokenPositions,
    lpTokenUserAllStakeInfo,
    lpTokenUserInfo: userInfo,
  })

  return (
    <div className="grid grid-cols-12 gap-12 [&>div]:bg-gray-400/50 [&>div]:px-12 [&>div]:py-6 [&>div]:rounded-lg">
      <StakingLpTokenStakeLpTokenCard
        isRefetching={isRefetching}
        isLoading={isLoading}
        stakingScore={stakingScore}
        rewardMultiplier={rewardMultiplier}
        balanceOfAstraUnStaked={balanceOfAstraUnStaked}
        accruedRewards={accruedRewards}
        astraDecimal={astraDecimal}
        refetchDatas={refetchDatas}
        lpTokenPositions={lpTokenPositions}
        lpTokens={lpTokens}
        setSelectedPairIdx={setSelectedPairIdx}
        selectedPairIdx={selectedPairIdx}
      />
      <StakingLpTokenClaimLpToken
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
        eligibleWithdrawableNFTId={eligibleWithdrawableNFTId}
      />
    </div>
  )
}

export { StakingLpTokenBody }
