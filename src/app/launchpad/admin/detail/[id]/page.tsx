'use client'

import Overview from '../../../detail/[project]/components/Overview'
import Content from '../../../detail/[project]/components/Content'
import { useGetLaunchpadDetailById } from '@/hooks'
import Loading from '@/app/loading'
import { redirect } from 'next/navigation'

type TPage = {
  params: {
    id: string
  }
}
export default function Page({ params }: TPage) {
  const { id } = params
  const {
    data: launchpadDetail,
    isLoading,
    isError,
    refetchData,
  } = useGetLaunchpadDetailById(id)
  if (isError) redirect('/launchpad/admin')

  return (
    <div className="container py-16 max-w-full xl:max-w-[1200px] 2xl:max-w-[1400px]">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="mt-8">
            <Overview launchpadDetail={launchpadDetail!} />
          </div>
          <div className="mt-12">
            <Content
              launchpadDetail={launchpadDetail!}
              isLoading={isLoading}
              refetchData={refetchData}
            />
          </div>
        </>
      )}
    </div>
  )
}
