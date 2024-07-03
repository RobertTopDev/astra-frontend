'use client'

import Overview from './components/Overview'
import Content from './components/Content'
import { useGetLaunchpadDetailById } from '@/hooks'

type TPage = {
  params: {
    project: string
  }
}

export default function Page({ params }: TPage) {
  const { data: launchpadDetail, isLoading } = useGetLaunchpadDetailById(
    params.project
  )

  return (
    <div className="container py-16 max-w-full xl:max-w-[1200px] 2xl:max-w-[1400px]">
      <div className="mt-8">
        <Overview launchpadDetail={launchpadDetail!} />
      </div>
      <div className="mt-12">
        <Content launchpadDetail={launchpadDetail!} isLoading={isLoading} />
      </div>
    </div>
  )
}
