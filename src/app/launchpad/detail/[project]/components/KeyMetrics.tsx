import { TLaunchpadDetailInfo } from '@/types'
import { convertToInternationalCurrencySystem, convertUSD } from '@/util'

type TComponent = {
  launchpadDetail: TLaunchpadDetailInfo
}
export default function KeyMetrics({ launchpadDetail }: TComponent) {
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex flex-col justify-center h-full">
          <div className="text-md text-white">Lead VC</div>
          <div className="text-2xl truncate text-[#00E7FF] font-bold">
            {launchpadDetail?.LEAD_VC}
          </div>
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex flex-col justify-center h-full">
          <div className="text-md text-white">Blockchain Network</div>
          <div className="text-2xl truncate text-[#00E7FF] font-bold">
            {launchpadDetail?.CHAIN}
          </div>
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex flex-col justify-center h-full">
          <div className="text-md text-white">Token Supply</div>
          <div className="text-2xl truncate text-[#00E7FF] font-bold">
            {convertToInternationalCurrencySystem(
              launchpadDetail?.LAUNCHPAD_TOKEN_TOTAL_SUPPLY
            )}
          </div>
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex flex-col justify-center h-full">
          <div className="text-md text-white">Project Valuation</div>
          <div className="text-2xl truncate text-[#00E7FF] font-bold">
            {convertUSD(launchpadDetail?.PROJECT_VALUATION)}
          </div>
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex flex-col justify-center h-full">
          <div className="text-md text-white">Initial Market Cap</div>
          <div className="text-2xl truncate text-[#00E7FF] font-bold">
            {convertUSD(launchpadDetail?.INITIAL_MARKET_CAP)}
          </div>
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex flex-col justify-center h-full">
          <div className="text-md text-white">Hard Cap</div>
          <div className="text-2xl truncate text-[#00E7FF] font-bold">
            {convertUSD(launchpadDetail?.HARD_CAP)}
          </div>
        </div>
      </div>
    </div>
  )
}
