import { useMemo } from 'react'
import { TLaunchpadDetailInfo } from '@/types'
import BuyContent from './BuyContent'
import FollowSection from './FollowSection'
// import Stake from './Stake'
import Contributor from './Contributor'
import { useGetBuyRuleLaunchpad, useLaunchpadFactoryInfo } from '@/hooks'
import LiveUpcoming from '@/app/launchpad/(page)/components/LiveUpcoming'
import { ClaimStatistics } from '@/app/launchpad/user/sections/claim-statistics'
import { useAccount } from 'wagmi'
import CrosschainStatus from '@/app/launchpad/user/components/CrosschainStatus'

type TProgress = {
  data: TLaunchpadDetailInfo
  launchpadInfoData: any
  launchpadInfoLoading: boolean
  launchpadLoading: boolean
  refetchLaunchpadData: () => void
}

export default function Progress({
  data,
  launchpadLoading,
  launchpadInfoData,
  launchpadInfoLoading,
  refetchLaunchpadData,
}: TProgress) {
  const { address } = useAccount()

  const { data: factoryData, isLoading: factoryLoading } =
    useLaunchpadFactoryInfo({ lIndex: data.LAUNCHPAD_INDEX.toString() })
  const launchpadAddress = useMemo(
    () => factoryData?.[11] ?? data.LAUNCHPAD_ADDRESS,
    [factoryData]
  )
  const { data: buyRuleStatus, isLoading: buyRuleStatusLoading } =
    useGetBuyRuleLaunchpad()

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
        {/* <Stake launchpadData={launchpadInfoData} /> */}
        <CrosschainStatus />
      </div>
      <div className="participated mt-12">
        <LiveUpcoming status="user" />
      </div>
    </>
  )
}
