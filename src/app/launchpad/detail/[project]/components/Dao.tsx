import { TLaunchpadDetailInfo } from '@/types'
import Image from 'next/image'

type TComponent = {
  launchpadDetail: TLaunchpadDetailInfo
}

export default function Dao({ launchpadDetail }: TComponent) {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      <div className="md:p-8 p-4 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
            <Image
              width={500}
              height={300}
              className="w-10 h-10"
              src="/images/launchpad/lead-vc.png"
              alt="img"
            />
          </div>
          <div className="md:text-left text-center">
            <div className="text-md text-white">Lead VC</div>
            <div className="lg:text-2xl truncate text-lg text-white font-bold">
              {launchpadDetail?.LEAD_VC}
            </div>
          </div>
        </div>
      </div>
      <div className="md:p-8 p-4 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="w-[60px] h-[60px] bg-[#1cdca0] rounded-full flex items-center justify-center">
            <Image
              width={500}
              height={300}
              className="w-10 h-10"
              src="/images/launchpad/market-maker.png"
              alt="img"
            />
          </div>
          <div className="md:text-left text-center">
            <div className="text-md text-white">Market Maker</div>
            <div className="lg:text-2xl truncate text-lg text-white font-bold">
              {launchpadDetail?.MARKET_MAKER}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="md:p-8 p-4 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
            <Image
              width={500}
              height={300}
              className="w-10 h-10"
              src="/images/launchpad/controlled-cap.svg"
              alt="img"
            />
          </div>
          <div className="md:text-left text-center">
            <div className="text-md text-white">Controlled Cap</div>
            <div className="lg:text-2xl truncate text-lg text-white font-bold">
              {launchpadDetail?.CONTROLLED_CAP}
            </div>
          </div>
        </div>
      </div>
      <div className="md:p-8 p-4 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
            <Image
              width={500}
              height={300}
              className="w-10 h-10"
              src="/images/launchpad/dao-approved.svg"
              alt="img"
            />
          </div>
          <div className="md:text-left text-center">
            <div className="text-md text-white">DAO Approved Metrics</div>
            <div className="lg:text-2xl truncate text-lg text-white font-bold">
              {launchpadDetail?.DAO_APPROVED_METRICS}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}
