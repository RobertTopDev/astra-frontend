'use client'

import React, { useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Input } from '@/components/shadcn/ui/input'
import { AstraHeader } from '@/components'

import CompletedTable from './CompletedTable'
import { useGetAllLaunchpad } from '@/hooks'
import { TLaunchpadDetailInfo } from '@/types'
import { useDebouncedCallback } from 'use-debounce'
import Loading from '@/app/loading'

interface SortType {
  sort: string
  filter: string
  chain: string
  search: string
  type: string
}

export default function Completed() {
  const status = 'all'
  const [getOption, SetGetOption] = useState<SortType>({
    sort: 'SALE_END_TIME',
    filter: 'finished',
    chain: 'None',
    search: '',
    type: 'all',
  })
  const { data: completedData, isLoading } = useGetAllLaunchpad(
    status,
    getOption
  )

  const handleSearch = useDebouncedCallback((term: string) => {
    SetGetOption({ ...getOption, search: term })
  }, 300)
  return (
    <div className="flex flex-col items-stretch py-8">
      <div className="flex items-center flex-col">
        <AstraHeader>Completed Token Sales</AstraHeader>
        <h1>All token Sales that were hosted on Astra DAO crypto launchpad.</h1>
      </div>
      <div className="flex flex-wrap justify-between mt-8">
        <div className="flex flex-wrap rounded-3xl items-center p-1 bg-[#292944]">
          <div
            className={`w-[150px] text-center rounded-3xl cursor-pointer p-3 ${
              getOption.type === 'all' ? 'text-black bg-astra-blue' : ''
            }`}
            onClick={() => SetGetOption({ ...getOption, type: 'all' })}
          >
            View all
          </div>
          <div
            className={`w-[150px] text-center rounded-3xl cursor-pointer p-3 ${
              getOption.type === 'gaming' ? 'text-black bg-astra-blue' : ''
            }`}
            onClick={() => SetGetOption({ ...getOption, type: 'gaming' })}
          >
            Gaming
          </div>
          <div
            className={`w-[150px] text-center rounded-3xl cursor-pointer p-3 ${
              getOption.type === 'metaverse' ? 'text-black bg-astra-blue' : ''
            }`}
            onClick={() => SetGetOption({ ...getOption, type: 'metaverse' })}
          >
            Metaverse
          </div>
          <div
            className={`w-[150px] text-center rounded-3xl cursor-pointer p-3 ${
              getOption.type === 'defi' ? 'text-black bg-astra-blue' : ''
            }`}
            onClick={() => SetGetOption({ ...getOption, type: 'defi' })}
          >
            DeFi
          </div>
          <div
            className={`w-[150px] text-center rounded-3xl cursor-pointer p-3 ${
              getOption.type === 'socialNetwork'
                ? 'text-black bg-astra-blue'
                : ''
            }`}
            onClick={() =>
              SetGetOption({ ...getOption, type: 'socialNetwork' })
            }
          >
            Social Network
          </div>
        </div>
        <div
          className="flex-1 text-white max-w-[300px] h-14"
          style={{ minWidth: '20%' }}
        >
          <div className="relative flex gap-1.5">
            <MagnifyingGlassIcon className="absolute transform top-1/2 -translate-y-1/2 text-black left-3 w-6 h-6" />
            <Input
              type="text"
              placeholder="Search"
              onChange={(e) => {
                handleSearch(e.target.value)
              }}
              className="py-3 px-6 pl-10 rounded-full text-base tracking-widest border border-astra-blue bg-white text-black h-14"
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <>
            <div></div>
            <Loading />
          </>
        ) : completedData ? (
          <CompletedTable data={completedData as TLaunchpadDetailInfo[]} />
        ) : null}
      </div>
    </div>
  )
}
