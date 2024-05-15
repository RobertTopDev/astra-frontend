'use client'
import {
  useChainConfig,
  useAstraMultiplierDecimal,
  useGetAllITokens,
  useITokenStakingScoreAndMultiplier,
  useITokenAstraClaimable,
  useDecimals,
  useAllowance,
  useAstraDecimal,
  useITokenAverageStakeTime,
  useITokenUserAllStakeInfo,
  useITokenUserInfo,
  useCoingeckoPrice,
  useAstraUSDPrice,
} from '@/hooks'
import { add, differenceInDays, differenceInMinutes } from 'date-fns'
import React, { useEffect, useMemo } from 'react'
import { formatUnits } from 'viem'
import { useAccount, useBalance, useContractRead, useToken } from 'wagmi'
import { StakingITokenClaimIToken } from './staking-itoken-claim-itoken'
import { StakingITokenStakeITokenCard } from './staking-itoken-stake-itoken-card'
import { DAAAbi } from '@/abis'
import { coingeckoMappings } from '@/constants'

type TStakingITokenBodyProps = {
  apyInfo: {
    liquidityMiningAPR: number
    stakingRewardsAPR: number
    iTokenAPR: number
  }
}

const StakingITokenBody = ({ apyInfo }: TStakingITokenBodyProps) => {
  const { address } = useAccount()
  const { chainConfig } = useChainConfig()

  const { data: iTokens, isLoading: iTokensLoading } = useGetAllITokens({})
  const [selectedITokenIdx, setSelectedITokenIdx] = React.useState<
    string | undefined
  >('0')
  const selectedIToken = useMemo(
    () =>
      selectedITokenIdx === undefined
        ? undefined
        : iTokens !== undefined && iTokens.length > 0
          ? iTokens[Number(selectedITokenIdx)]
          : undefined,
    [selectedITokenIdx, iTokens]
  )

  const { data: astraDecimals } = useAstraDecimal()
  const { data: itokenDecimals, isLoading: itokenDecimalsLoading } =
    useDecimals({
      address:
        selectedIToken !== undefined
          ? selectedIToken.contractAddress
          : undefined,
      enabled: selectedIToken !== undefined,
    })
  const {
    data: userAllStakeInfo,
    refetch: refetchUserAllStakeInfo,
    isLoading: userAllStakeInfoLoading,
    isRefetching: userAllStakeInfoRefetching,
  } = useITokenUserAllStakeInfo({})
  useMemo(() => {
    if (userAllStakeInfo === undefined) return undefined
    const infos = userAllStakeInfo.map((info) => {
      if (info.iTokenId === selectedIToken?.id) return info
    })
    return infos[infos.length - 1]
  }, [userAllStakeInfo])
  const {
    data: iTokenUserInfoTemp,
    refetch: refetchITokenUserTempInfo,
    isLoading: iTokenUserTempInfoLoading,
  } = useITokenUserInfo({})
  const {
    data: stakingScoreAndMultiplier,
    isLoading: stakingScoreAndMultiplierLoading,
    refetch: refetchStakingScoreAndMultiplier,
  } = useITokenStakingScoreAndMultiplier({
    args:
      !!address && iTokenUserInfoTemp !== undefined
        ? [address, BigInt(iTokenUserInfoTemp[0])]
        : undefined,
    enabled: !!address && !!iTokenUserInfoTemp,
  })

  const {
    data: multiplierDecimal,
    isLoading: multiplierDecimalLoading,
    refetch: refetchMultiplierDecimal,
  } = useAstraMultiplierDecimal({})
  const {
    data: pendingAstra,
    isLoading: pendingAstraLoading,
    refetch: refetchAstraRewards,
  } = useITokenAstraClaimable({})
  const {
    data: balanceOf,
    refetch: refetchBalanceOf,
    isLoading: balanceOfLoading,
  } = useBalance({
    address: address,
    token:
      selectedIToken !== undefined ? selectedIToken.contractAddress : undefined,
    enabled: !!address && selectedIToken !== undefined,
  })

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
      console.error({ err })
      return 1
    }
  }, [stakingScoreAndMultiplier, multiplierDecimal])

  const stakingScore = useMemo(() => {
    if (stakingScoreAndMultiplier === undefined || astraDecimals === undefined)
      return 0
    return formatUnits(stakingScoreAndMultiplier[0], astraDecimals?.valueOf())
  }, [stakingScoreAndMultiplier, astraDecimals])
  const { data: astraUSDPrice, isLoading: astraUSDPriceLoading } =
    useAstraUSDPrice({})
  const { data: stableCoinAddress, isLoading: stableCoinAddrIsLoading } =
    useContractRead({
      address: chainConfig.DAAContractAddress,
      abi: DAAAbi,
      functionName: 'baseStableCoin',
    })
  const { data: stableCoin, isLoading: stableCoinIsLoading } = useToken({
    address: stableCoinAddress,
    enabled: stableCoinAddress !== undefined,
  })
  const { data: stableCoinCurrency, isLoading: stableCoinCurrencyLoading } =
    useCoingeckoPrice({
      ids:
        stableCoin !== undefined
          ? coingeckoMappings[
              stableCoin.symbol as keyof typeof coingeckoMappings
            ]
          : '',
      enabled: stableCoin !== undefined,
    })

  const accruedRewards = useMemo(() => {
    if (!pendingAstra || !astraDecimals) return 0
    return Number(formatUnits(pendingAstra, astraDecimals?.valueOf()))
  }, [pendingAstra, astraDecimals])
  const accruedRewardsInUSD = useMemo(() => {
    if (astraUSDPrice === undefined) return 0
    return accruedRewards * astraUSDPrice
  }, [accruedRewards, astraUSDPrice])

  const {
    data: averageStakedTime,
    isLoading: averageStakedTimeLoading,
    refetch: refetchAverageStakedTime,
  } = useITokenAverageStakeTime({})
  const stakedAmount = useMemo(() => {
    if (userAllStakeInfo === undefined) return 0
    return userAllStakeInfo.reduce((acc, curr) => {
      if (curr.withdrawTime === 0 && curr.iTokenId === selectedIToken?.id)
        return (
          acc +
          Number(formatUnits(BigInt(curr.iTokenAmount), curr.iTokenDecimals))
        )
      return acc
    }, 0)
  }, [userAllStakeInfo, selectedIToken])
  const stakedAmountInUSD = useMemo(() => {
    if (userAllStakeInfo === undefined) return 0
    return userAllStakeInfo.reduce((acc, curr) => {
      if (curr.withdrawTime === 0 && curr.iTokenId === selectedIToken?.id)
        return (
          acc + Number(formatUnits(BigInt(curr.amount), curr.iTokenDecimals))
        )
      return acc
    }, 0)
  }, [userAllStakeInfo, selectedIToken])
  const eligibleITokenToWithdraw = useMemo(() => {
    if (userAllStakeInfo === undefined) return 0
    return userAllStakeInfo.reduce((acc, curr) => {
      if (
        curr.withdrawTime === 0 &&
        curr.iTokenId === selectedIToken?.id &&
        curr.vault === 0
      )
        return (
          acc +
          Number(formatUnits(BigInt(curr.iTokenAmount), curr.iTokenDecimals))
        )
      return acc
    }, 0)
  }, [userAllStakeInfo, selectedIToken])
  const eligibleITokenToWithdrawUSD = useMemo(() => {
    if (stableCoinCurrency === undefined || eligibleITokenToWithdraw === 0)
      return 0
    return Number(eligibleITokenToWithdraw) * stableCoinCurrency
  }, [eligibleITokenToWithdraw, stableCoinCurrency])

  const {
    data: itokenAllowance,
    isLoading: itokenAllowanceLoading,
    refetch: refetchItokenAllowance,
  } = useAllowance({
    address: selectedIToken?.contractAddress,
    args: !!address
      ? [address, chainConfig.iTokenStakingContractAddress]
      : undefined,
    enabled: !!address && selectedIToken !== undefined,
  })
  const allowanceOfUser = useMemo(() => {
    if (itokenAllowance === undefined || itokenDecimals === undefined) return 0
    return Number(formatUnits(itokenAllowance, itokenDecimals?.valueOf()))
  }, [itokenAllowance, itokenDecimals])

  const refetchDatas = async () => {
    await Promise.all([
      refetchStakingScoreAndMultiplier(),
      refetchMultiplierDecimal(),
      refetchAstraRewards(),
      refetchBalanceOf(),
      refetchItokenAllowance(),
      refetchUserAllStakeInfo(),
      refetchITokenUserTempInfo(),
      refetchAverageStakedTime(),
      // refetchUserStakeInfo(),
      // refetchITokenInfo(),
    ])
  }

  useEffect(() => {
    refetchDatas()
  }, [selectedITokenIdx])

  const slashingRewards = useMemo(() => {
    if (averageStakedTime === undefined || iTokenUserInfoTemp === undefined)
      return 0
    const userTimestamp =
      averageStakedTime > 0
        ? Number(averageStakedTime)
        : Number(iTokenUserInfoTemp[4]) /*  : Number(userInfo[6]) */
    const astraSlashingFeeUnit = chainConfig.astraSlashingFeeUnit
    const astraSlashingFeeValue = chainConfig.astraSlashingFeeValue
    const ts = add(new Date(userTimestamp * 1000), {
      [astraSlashingFeeUnit]: astraSlashingFeeValue,
    })
    let diff = 0
    if (averageStakedTime > 0)
      diff = Math.ceil(
        (ts.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    else
      diff =
        astraSlashingFeeUnit === 'days'
          ? differenceInDays(ts, new Date())
          : differenceInMinutes(ts, new Date())
    // if (astraSlashingFeeUnit === 'minutes') {
    //   let consumedLimit = chainConfig.astraSlashingFeeValue - diff
    //   consumedLimit = consumedLimit / 5
    //   consumedLimit = Math.ceil(consumedLimit)
    //   diff = 90 - consumedLimit
    // }
    return diff <= 0 ? 0 : diff > 90 ? 90 : diff
  }, [averageStakedTime, chainConfig, iTokenUserInfoTemp])

  const actualUnstakedValue = useMemo(() => {
    return accruedRewards - (slashingRewards / 100) * accruedRewards
  }, [accruedRewards, slashingRewards])

  useEffect(() => {
    const timer = setInterval(() => {
      refetchDatas()
    }, 1000000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const isLoading = useMemo(() => {
    return (
      iTokenUserTempInfoLoading ||
      itokenDecimalsLoading ||
      stakingScoreAndMultiplierLoading ||
      multiplierDecimalLoading ||
      pendingAstraLoading ||
      userAllStakeInfoLoading ||
      userAllStakeInfoRefetching ||
      averageStakedTimeLoading ||
      // eligibleAmountLoading ||
      iTokensLoading ||
      itokenAllowanceLoading ||
      stableCoinIsLoading ||
      stableCoinAddrIsLoading ||
      stableCoinCurrencyLoading ||
      astraUSDPriceLoading ||
      balanceOfLoading
    )
  }, [
    iTokenUserTempInfoLoading,
    itokenDecimalsLoading,
    stakingScoreAndMultiplierLoading,
    multiplierDecimalLoading,
    pendingAstraLoading,
    userAllStakeInfoLoading,
    userAllStakeInfoRefetching,
    averageStakedTimeLoading,
    iTokensLoading,
    itokenAllowanceLoading,
    stableCoinIsLoading,
    stableCoinAddrIsLoading,
    stableCoinCurrencyLoading,
    astraUSDPriceLoading,
    balanceOfLoading,
  ])

  return (
    <div className="grid grid-cols-12 gap-12 [&>div]:bg-gray-400/50 [&>div]:px-12 [&>div]:py-6 [&>div]:rounded-lg">
      <StakingITokenStakeITokenCard
        isLoading={isLoading}
        allowance={Number(allowanceOfUser)}
        selectedITokenIdx={selectedITokenIdx}
        stakingScore={stakingScore}
        rewardMultiplier={rewardMultiplier}
        unstakedITokenBalance={Number(balanceOf?.formatted ?? 0)}
        iTokens={iTokens}
        setSelectedITokenIdx={setSelectedITokenIdx}
        selectedIToken={selectedIToken}
        accruedRewards={accruedRewards}
        itokenDecimals={itokenDecimals}
        refetchAllowance={refetchItokenAllowance}
        refetchDatas={refetchDatas}
      />
      <StakingITokenClaimIToken
        isLoading={isLoading}
        selectedITokenIdx={selectedITokenIdx}
        accruedRewards={accruedRewards}
        accruedRewardsInUSD={accruedRewardsInUSD}
        stakedAmount={stakedAmount}
        stakedAmountInUSD={stakedAmountInUSD}
        slashingRewards={slashingRewards}
        apyInfo={apyInfo}
        refetchDatas={refetchDatas}
        userInfo={iTokenUserInfoTemp}
        actualUnstakedValue={actualUnstakedValue}
        eligbleITokenToWithdraw={eligibleITokenToWithdraw}
        eligbleITokenToWithdrawUSD={eligibleITokenToWithdrawUSD}
      />
    </div>
  )
}

export { StakingITokenBody }
