'use client'

import { useMemo } from 'react'
import Finished from './components/Finished'
import Progress from './components/Progress'
import { useGetLaunchpadDetailById, useLaunchpadInfo } from '@/hooks'
import { TLaunchpadDetailInfo } from '@/types'
import Loading from '@/app/loading'
import NotFound from '@/app/not-found'

type TPage = {
  params: {
    project: string
  }
}

export default function Page({ params }: TPage) {
  const temp = useGetLaunchpadDetailById(params.project)
  let { data: launchpadDetail } = temp
  const { isLoading } = temp
  launchpadDetail = launchpadDetail as TLaunchpadDetailInfo

  const launchpadStatus = useMemo(() => {
    if (!launchpadDetail) return 'upcoming'
    else if (
      new Date(launchpadDetail.SALE_START_TIME + 'Z').getTime() >
      new Date().getTime()
    )
      return 'upcoming'
    else if (
      new Date(launchpadDetail?.SALE_START_TIME + 'Z').getTime() <=
        new Date().getTime() &&
      new Date(launchpadDetail.SALE_END_TIME + 'Z').getTime() >=
        new Date().getTime()
    )
      return 'inprogress'
    else return 'finished'
  }, [launchpadDetail])

  const launchpadAddress = useMemo(() => {
    if (launchpadDetail) return launchpadDetail.LAUNCHPAD_ADDRESS
  }, [launchpadDetail])

  const {
    data: launchpadInfoData,
    isLoading: launchpadInfoLoading,
    refetch: refetchLaunchpadData,
  } = useLaunchpadInfo({ launchpad: launchpadAddress as `0x${string}` })

  return (
    <div className="container py-16 max-w-full xl:max-w-[1200px] 2xl:max-w-[1400px]">
      {isLoading && <Loading />}
      {launchpadStatus === 'finished' &&
        (launchpadDetail?.STATUS === 'approved' ||
          launchpadDetail?.STATUS === 'finished') && (
          <Finished
            data={launchpadDetail as TLaunchpadDetailInfo}
            launchpadData={launchpadInfoData}
            launchpadLoading={isLoading}
          />
        )}
      {(launchpadStatus === 'inprogress' || launchpadStatus === 'upcoming') &&
        launchpadDetail?.STATUS === 'approved' && (
          <Progress
            data={launchpadDetail as TLaunchpadDetailInfo}
            launchpadLoading={isLoading}
            launchpadInfoData={launchpadInfoData}
            launchpadInfoLoading={launchpadInfoLoading}
            refetchLaunchpadData={refetchLaunchpadData}
          />
        )}
      {launchpadStatus === 'upcoming' &&
        launchpadDetail?.STATUS === 'requested' && <NotFound />}
    </div>
  )
}
