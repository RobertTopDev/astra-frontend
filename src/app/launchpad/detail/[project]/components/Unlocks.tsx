import { days } from '@/app/governance/proposals/create/constants'
import { TLaunchpadDetailInfo } from '@/types'

type TComponent = {
  launchpadDetail: TLaunchpadDetailInfo
}

export default function Unlocks({ launchpadDetail }: TComponent) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="p-8 h-32 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex flex-col justify-center h-full text-white">
          <div className="text-md ">Public Sale</div>
          <div className="md:text-xl text-md font-medium">
            {launchpadDetail?.VEST_INITIAL_UNLOCK || 100}% at TGE,{' '}
            {launchpadDetail?.VEST_CLIFF / 86400}{' '}
            {launchpadDetail?.VEST_CLIFF / 86400 === 1 ? 'day' : 'days'} cliff
            and {launchpadDetail?.VEST_DURATION / 86400}{' '}
            {launchpadDetail?.VEST_DURATION / 86400 === 1 ? 'day' : 'days'}{' '}
            vesting with {launchpadDetail?.VEST_SLICE_PERIOD_SECONDS / 86400}{' '}
            {launchpadDetail?.VEST_SLICE_PERIOD_SECONDS / 86400 === 1
              ? 'day'
              : 'days'}{' '}
            unlocks
          </div>
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex flex-col justify-center h-full text-white">
          <div className="text-md">Private Sale</div>
          <div className="md:text-xl text-md font-medium">
            {launchpadDetail.SALE_ROUND_DETAIL
              ? launchpadDetail.SALE_ROUND_DETAIL.split('<>')[0].split(':')[2]
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  )
}
