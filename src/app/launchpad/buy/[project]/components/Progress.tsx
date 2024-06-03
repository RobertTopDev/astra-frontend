import { TLaunchpadDetailInfo } from '@/types'
import BuyContent from './BuyContent'
import FollowSection from './FollowSection'
import Stake from './Stake'

type TProgress = {
  data: TLaunchpadDetailInfo
}

export default function Progress({ data }: TProgress) {
  return (
    <>
      <div className="mt-8">
        <FollowSection />
      </div>
      <div className="mt-12">
        <BuyContent detail={data} />
      </div>
      <div className="mt-12">
        <Stake />
      </div>
    </>
  )
}
