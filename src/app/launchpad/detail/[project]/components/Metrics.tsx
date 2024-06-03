import TokenDistributeChart from '../../../chart/'
import { TLaunchpadDetailInfo } from '@/types'
interface Props {
  data: TLaunchpadDetailInfo | undefined
}

export default function Metrics({ data }: Props) {
  // assume that  we use the pre defined labels
  const values =
    data?.METRICS && data?.METRICS !== 'none'
      ? data?.METRICS.split(',').map((item) =>
          parseInt(item.split(':')[1].trim(), 10)
        )
      : []

  return (
    <div>
      <p className="text-3xl text-center mb-12">Metrics</p>
      {values.length > 0 ? (
        <div className="token-distribution-chart rounded-3xl p-[0.8px] bg-gradient-to-b from-transparent to-gray-200 shadow-xl mb-12">
          <div className="bg-[#515475] lg:p-16 p-4 rounded-[calc(1.5rem-1px)]">
            <TokenDistributeChart isTitle={true} xSymbol={values} />

            <p className="text-center mt-5">Data provided by project</p>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="sales-round-details lg:p-16 p-4 rounded-3xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl color-white">
        <div className="caption-top pb-8 text-2xl font-bold text-center w-full">
          Sale Round Details
        </div>
        <div className="mobile:overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="text-xl">
              <tr className="border-t-[1px] border-b-[1px] border-white border-opacity-20">
                <th className="px-4 py-6"></th>
                <th className="px-4 py-6">Price</th>
                <th className="px-4 py-6">Fundraised</th>
                <th className="px-4 py-6">Lock-up</th>
              </tr>
            </thead>
            <tbody className="text-lg">
              <tr>
                <td className="p-4 pt-10">Private Sale</td>
                <td className="p-4 pt-10">$0.9</td>
                <td className="p-4 pt-10">1,080,000</td>
                <td className="p-4 pt-10">
                  0% at TGE, 6 months cliff and 2 years vesting with monthly
                  unlocks
                </td>
              </tr>
              <tr>
                <td className="p-4">Private Sale</td>
                <td className="p-4">$0.9</td>
                <td className="p-4">1,080,000</td>
                <td className="p-4">
                  0% at TGE, 6 months cliff and 2 years vesting with monthly
                  unlocks
                </td>
              </tr>
              <tr>
                <td className="p-4">Private Sale</td>
                <td className="p-4">$0.9</td>
                <td className="p-4">1,080,000</td>
                <td className="p-4">
                  0% at TGE, 6 months cliff and 2 years vesting with monthly
                  unlocks
                </td>
              </tr>
              <tr>
                <td className="p-4">Private Sale</td>
                <td className="p-4">$0.9</td>
                <td className="p-4">1,080,000</td>
                <td className="p-4">
                  0% at TGE, 6 months cliff and 2 years vesting with monthly
                  unlocks
                </td>
              </tr>
              <tr>
                <td className="p-4">Private Sale</td>
                <td className="p-4">$0.9</td>
                <td className="p-4">1,080,000</td>
                <td className="p-4">
                  0% at TGE, 6 months cliff and 2 years vesting with monthly
                  unlocks
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
