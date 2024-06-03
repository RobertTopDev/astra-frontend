'use client'

import React, { useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Input } from '@/components/shadcn/ui/input'
import { AstraHeader } from '@/components'

import CompletedTable from './CompletedTable'
import { useGetAllLaunchpad } from '@/hooks'
import { TLaunchpadDetailInfo } from '@/types'

export default function Completed() {
  const [selectedTab, setSelectedTab] = useState<string>('all')
  const status = 'finished'
  const { data: completedData } = useGetAllLaunchpad(status)

  return (
    <div className="flex flex-col items-stretch py-8">
      <div className="flex items-center flex-col">
        <AstraHeader>Completed Token Sales</AstraHeader>
        <h1>
          All past IDOs offerings that were hosted on Astra DAO crypto
          launchpad.
        </h1>
      </div>
      <div className="flex justify-between mt-8">
        <div className="flex rounded-3xl items-center p-1 bg-[#292944]">
          <div
            className={`w-[150px] text-center rounded-3xl cursor-pointer p-3 ${
              selectedTab === 'all' ? 'text-black bg-astra-blue' : ''
            }`}
            onClick={() => setSelectedTab('all')}
          >
            View all
          </div>
          <div
            className={`w-[150px] text-center rounded-3xl cursor-pointer p-3 ${
              selectedTab === 'gaming' ? 'text-black bg-astra-blue' : ''
            }`}
            onClick={() => setSelectedTab('gaming')}
          >
            Gaming
          </div>
          <div
            className={`w-[150px] text-center rounded-3xl cursor-pointer p-3 ${
              selectedTab === 'metaverse' ? 'text-black bg-astra-blue' : ''
            }`}
            onClick={() => setSelectedTab('metaverse')}
          >
            Metaverse
          </div>
          <div
            className={`w-[150px] text-center rounded-3xl cursor-pointer p-3 ${
              selectedTab === 'defi' ? 'text-black bg-astra-blue' : ''
            }`}
            onClick={() => setSelectedTab('defi')}
          >
            DeFi
          </div>
          <div
            className={`w-[150px] text-center rounded-3xl cursor-pointer p-3 ${
              selectedTab === 'social' ? 'text-black bg-astra-blue' : ''
            }`}
            onClick={() => setSelectedTab('social')}
          >
            Social Network
          </div>
        </div>
        <div className="flex-1 text-white max-w-[300px] h-14">
          <div className="relative flex gap-1.5">
            <MagnifyingGlassIcon className="absolute transform top-1/2 -translate-y-1/2 text-black left-3 w-6 h-6" />
            <Input
              type="text"
              placeholder="Search"
              className="py-3 px-6 pl-10 rounded-full text-base tracking-widest border border-astra-blue bg-white text-black h-14"
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        {completedData ? (
          <CompletedTable data={completedData as TLaunchpadDetailInfo[]} />
        ) : null}
      </div>
    </div>
  )
}
