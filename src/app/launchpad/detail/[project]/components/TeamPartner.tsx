import { AstraHeader } from '@/components'
import TeamCard from './TeamCard'
import { TLaunchpadDetailInfo } from '@/types'

interface Props {
  data: TLaunchpadDetailInfo | undefined
}
export default function TeamPartner({ data }: Props) {
  const teamInfo =
    data?.TEAM_INFO && data?.TEAM_INFO !== 'none'
      ? data?.TEAM_INFO.split(',')
      : []
  const teamInfoArray = teamInfo.map((item) => {
    const pairs = item.split('?')
    const obj = pairs.reduce((acc: any, currentPair) => {
      const [key, value] = currentPair.split('=')
      acc[key] = value
      return acc
    }, {})
    return obj
  })

  return (
    <div className="flex flex-col items-stretch">
      <div className="flex justify-center">
        <AstraHeader>Pucca Family Ecosystem (Pucca) Team</AstraHeader>
      </div>

      <div className="mt-8 gap-6 flex-wrap grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1">
        {teamInfoArray.map((item, i) => (
          <TeamCard key={i} data={item} />
        ))}
      </div>

      <div className="mt-12">
        <p className="text-lg">
          Who are the partners and investors of Pucca Family (Pucca)?
        </p>
        <br />
        <p className="text-xs">
          Acura Capital is one of the largest Brazilian asset management
          companies and a crucial investor and partner in the Pucca Family
          Blockchain Ecosystem. Acura Capital focuses on developing assets in
          emerging markets and brings valuable expertise and financial resources
          to our project.
        </p>
        <br />
        <p className="text-xs">
          The company is composed of experienced professionals dedicated to
          providing differentiated solutions and products in the financial
          market. Their services and financial products cater to institutional
          investors, high-net-worth individuals (HNWI), and ultra-high-net-worth
          individuals (UHNWI).
        </p>
        <br />
        <p className="text-xs">
          Acura Capital offers a comprehensive structure to meet the demands of
          its clients, providing investment options for long-term value
          generation with a focus on asset preservation. Their investment
          strategy involves constructing all-weather portfolios capable of
          performing in various market scenarios.
        </p>
        <br />
        <p className="text-xs">
          Specializing in legal claims, structured multimarket funds, variable
          income, and real estate funds, Acura Capital boasts a long track
          record of success in these areas. They have also recently developed
          investment strategies for offshore markets.
        </p>
        <br />
        <p className="text-xs">
          Their client base includes institutional investors, high-income
          investors, family offices, and foreign investors. Acura Capital’s team
          consists of highly qualified professionals with extensive experience
          in the financial industry, including portfolio management, fund
          structuring, and credit structuring.
        </p>
        <br />
        <p className="text-xs">
          With their robust team and expertise, Acura Capital manages a
          substantial portfolio valued at $1.3 billion, and their assets under
          management (AUM) have been steadily growing. The company’s asset
          distribution encompasses various types of assets, including fixed
          income, equity, real estate, and more.
        </p>
      </div>
    </div>
  )
}
