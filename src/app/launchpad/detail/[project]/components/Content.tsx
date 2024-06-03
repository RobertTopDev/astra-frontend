'use client'

import { ReactNode, useState } from 'react'
import ProjectDetail from './ProjectDetail'
import TeamPartner from './TeamPartner'
import Metrics from './Metrics'
import LiveUpcoming from '@/app/launchpad/(page)/components/LiveUpcoming'
import Loading from '@/app/loading'
import { useGetLaunchpadDetail } from '@/hooks/launchpad/useGetLaunchpadDetail'
import { TLaunchpadDetailInfo } from '@/types'

type TComponent = {
  index: string
}

export default function Content({ index }: TComponent) {
  const { data: launchpadDetail, isLoading } = useGetLaunchpadDetail(index)

  const [selectedTab, setSelectedTab] = useState<number>(0)
  const tabContent: ReactNode[] = [
    <ProjectDetail
      key="projectDetail"
      data={launchpadDetail as TLaunchpadDetailInfo}
    />,
    <TeamPartner
      key="teamPartner"
      data={launchpadDetail as TLaunchpadDetailInfo}
    />,
    <Metrics key="metrics" data={launchpadDetail as TLaunchpadDetailInfo} />,
  ]

  return (
    <div className="">
      <div className="max-w-[600px] overflow-x-auto m-auto">
        <div className="w-[600px] flex rounded-xl items-center p-1 bg-[#292944]">
          <div
            className={`flex-1 text-center rounded-xl cursor-pointer p-3 ${
              selectedTab === 0
                ? 'bg-astra-blue bg-opacity-15 text-astra-blue'
                : 'text-white'
            }`}
            onClick={() => setSelectedTab(0)}
          >
            Project Details
          </div>
          <div
            className={`flex-1 text-center rounded-xl cursor-pointer p-3 ${
              selectedTab === 1
                ? 'bg-astra-blue bg-opacity-15 text-astra-blue'
                : 'text-white'
            }`}
            onClick={() => setSelectedTab(1)}
          >
            Team & Partners
          </div>
          <div
            className={`flex-1 text-center rounded-xl cursor-pointer p-3 ${
              selectedTab === 2
                ? 'bg-astra-blue bg-opacity-15 text-astra-blue'
                : 'text-white'
            }`}
            onClick={() => setSelectedTab(2)}
          >
            Metrics
          </div>
        </div>
      </div>
      <div className="mt-12">
        {isLoading ? <Loading /> : tabContent[selectedTab]}
      </div>
      <div className="mt-12">
        <LiveUpcoming status="requested" />
      </div>
    </div>
  )
}
