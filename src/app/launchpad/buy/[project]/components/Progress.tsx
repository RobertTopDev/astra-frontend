import { useMemo } from 'react'
import { TLaunchpadDetailInfo } from '@/types'
import BuyContent from './BuyContent'
import FollowSection from './FollowSection'
import Stake from './Stake'
import Contributor from './Contributor'
import {
  useGetBuyRuleLaunchpad,
  useLaunchpadFactoryInfo,
  useLaunchpadInfo,
} from '@/hooks'
import LiveUpcoming from '@/app/launchpad/(page)/components/LiveUpcoming'
import { ClaimStatistics } from '@/app/launchpad/user/sections/claim-statistics'
import { useAccount } from 'wagmi'

type TProgress = {
  data: TLaunchpadDetailInfo
  launchpadLoading: boolean
}

export default function Progress({ data, launchpadLoading }: TProgress) {
  const { address } = useAccount()

  const { data: factoryData, isLoading: factoryLoading } =
    useLaunchpadFactoryInfo({ lIndex: data.LAUNCHPAD_INDEX.toString() })
  const launchpadAddress = useMemo(
    () => factoryData?.[11] ?? data.LAUNCHPAD_ADDRESS,
    [factoryData]
  )
  const { data: buyRuleStatus, isLoading: buyRuleStatusLoading } =
    useGetBuyRuleLaunchpad()
  const {
    data: launchpadInfoData,
    isLoading: launchpadInfoLoading,
    refetch: refetchLaunchpadData,
  } = useLaunchpadInfo({ launchpad: launchpadAddress as `0x${string}` })

  return (
    <>
      <div className="mt-8">
        <FollowSection
          detail={data}
          buyRuleStatus={buyRuleStatus}
          buyRuleStatusLoading={buyRuleStatusLoading}
          launchpadData={launchpadInfoData}
          launchpadLoading={launchpadInfoLoading}
        />
      </div>
      <div className="mt-12">
        <BuyContent
          detail={data}
          factoryLoading={factoryLoading}
          launchpadAddress={launchpadAddress as `0x${string}`}
          launchpadData={launchpadInfoData}
          launchpadLoading={launchpadInfoLoading}
          refetchLaunchpadData={refetchLaunchpadData}
          buyRuleStatus={buyRuleStatus}
        />
      </div>
      <div className="mt-12">
        <ClaimStatistics
          launchpads={[data]}
          launchpadLoading={launchpadLoading}
        />
      </div>
      {data?.OWNER === address ? (
        <div className="contributor-list mt-12">
          <Contributor
            launchpadAddress={launchpadAddress as `0x${string}`}
            launchpadData={data}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="mt-12">
        <Stake />
      </div>
      <div className="participated mt-12">
        <LiveUpcoming status="user" />
      </div>
    </>
  )
}
