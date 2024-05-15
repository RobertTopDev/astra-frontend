'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { PortfolioIndices } from './portfolio-indices'
import { PortfolioOverview } from './portfolio-overview'
import { WithdrawIndexModal } from './withdraw-index-modal'
import { useGetUserIndices } from '@/hooks'
import { AstraLoading } from '@/components'
import { Button } from '@/components/shadcn'
import Link from 'next/link'

const PortfolioSection = () => {
  const [withdrawIndex, setWithdrawIndex] = useState<number>()
  const {
    data: userIndices,
    isLoading: userIndicesLoading,
    refetch: refetchUserIndices,
  } = useGetUserIndices({})
  const [selected, setSelected] = React.useState<string>()
  const selectedIndex = useMemo(
    () =>
      !selected || !userIndices
        ? undefined
        : userIndices.find((i) => i.ITOKEN_INDEX === selected) ??
          userIndices[0],
    [userIndices, selected]
  )

  useEffect(() => {
    if (
      selected === undefined &&
      userIndices !== undefined &&
      userIndices.length > 0
    ) {
      setSelected(userIndices[0].ITOKEN_INDEX)
    }
  }, [userIndices])

  return (
    <>
      {userIndicesLoading ? (
        <div className="min-h-screen flex justify-center items-center">
          Your Index portfolio will show up soon
        </div>
      ) : userIndices === undefined || userIndices.length === 0 ? (
        <div className="min-h-screen flex flex-col gap-6 justify-center items-center">
          <div className="flex gap-4 items-center">
            <div className="mr-[2rem] text-[6rem] transform rotate-90">
              <span>:</span>
              <span>(</span>
            </div>
            <h1 className="text-4xl font-bold">No portfolio found.</h1>
          </div>
          <Link href="/indices">
            <Button variant="astra-blue">Go to Indices</Button>
          </Link>
        </div>
      ) : (
        selectedIndex !== undefined && (
          <>
            <PortfolioOverview
              userIndices={userIndices}
              setWithdrawIndex={setWithdrawIndex}
              refetchUserIndices={refetchUserIndices}
              userIndicesLoading={userIndicesLoading}
              selected={selected}
              setSelected={setSelected}
              selectedIndex={selectedIndex}
            ></PortfolioOverview>
            <PortfolioIndices
              userIndices={userIndices}
              setWithdrawIndex={setWithdrawIndex}
              userIndicesLoading={userIndicesLoading}
              setSelected={setSelected}
            ></PortfolioIndices>
          </>
        )
      )}
      <WithdrawIndexModal
        withdrawIndex={withdrawIndex}
        setWithdrawIndex={setWithdrawIndex}
        userIndices={userIndices}
      ></WithdrawIndexModal>
    </>
  )
}

export { PortfolioSection }
