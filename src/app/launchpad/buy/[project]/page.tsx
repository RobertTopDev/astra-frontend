'use client'

import Finished from './components/Finished'
import Progress from './components/Progress'
import { useGetLaunchpadDetail } from '@/hooks/launchpad/useGetLaunchpadDetail'
import { TLaunchpadDetailInfo } from '@/types'
import Loading from '@/app/loading'
import NotFound from '@/app/not-found'

type TPage = {
  params: {
    project: string
  }
}

export default function Page({ params }: TPage) {
  const temp = useGetLaunchpadDetail(params.project)
  let { data: launchpadDetail } = temp
  const { isLoading } = temp
  launchpadDetail = launchpadDetail as TLaunchpadDetailInfo

  return (
    <div className="container py-16 max-w-full xl:max-w-[1200px] 2xl:max-w-[1400px]">
      {isLoading && <Loading />}
      {launchpadDetail && launchpadDetail.STATUS === 'finished' && (
        <Finished data={launchpadDetail as TLaunchpadDetailInfo} />
      )}
      {launchpadDetail && launchpadDetail.STATUS === 'approved' && (
        <Progress data={launchpadDetail as TLaunchpadDetailInfo} />
      )}
      {launchpadDetail && launchpadDetail.STATUS === 'requested' && (
        <NotFound />
      )}
    </div>
  )
}
