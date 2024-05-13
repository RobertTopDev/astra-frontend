'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGetLaunchpadDetailById } from '@/hooks'
import { Button } from '@/components/shadcn'
import { convertToCSV } from '@/util/convertToCSV'
import { useAccount } from 'wagmi'
import Overview from '../../../detail/[project]/components/Overview'
import Content from '../../../detail/[project]/components/Content'

type TPage = {
  params: {
    id: string
  }
}
export default function Page({ params }: TPage) {
  const { id } = params
  const router = useRouter()
  const { address } = useAccount()
  const {
    data: launchpadDetail,
    isLoading,
    refetchData,
  } = useGetLaunchpadDetailById(id)

  const isLaunchpadRequested = useMemo(() => {
    const isRequested =
      launchpadDetail?.REQUEST_TRANSACTION && launchpadDetail?.OWNER === address

    return isRequested
  }, [launchpadDetail])

  const onExport = () => {
    convertToCSV(launchpadDetail)
  }
  const toRequest = () => {
    router.push(`/launchpad/update/${launchpadDetail?.ID}`)
  }

  return (
    <div className="container py-16 max-w-full xl:max-w-[1200px] 2xl:max-w-[1400px]">
      <div className="flex gap-4">
        <Button className="!px-6 !py-3" variant="astra-blue" onClick={onExport}>
          Export
        </Button>
        {isLaunchpadRequested || !address ? (
          <></>
        ) : (
          <Button
            className="!px-6 !py-3"
            variant="astra-blue"
            disabled={!launchpadDetail?.ID}
            onClick={toRequest}
          >
            Request
          </Button>
        )}
      </div>
      <div className="mt-4">
        <Overview launchpadDetail={launchpadDetail!} />
      </div>
      <div className="mt-12">
        <Content
          launchpadDetail={launchpadDetail!}
          isLoading={isLoading}
          refetchData={refetchData}
        />
      </div>
    </div>
  )
}
