'use client'

import React, { useState, useEffect } from 'react'
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn'
import { AstraHeader } from '@/components'
import LiveUpcomingCard from './LiveUpcomingCard'
import { useGetAllLaunchpad } from '@/hooks'
import Loading from '@/app/loading'
import { useDebouncedCallback } from 'use-debounce'
import { useAccount } from 'wagmi'
import _ from 'lodash'
import { TLaunchpadDetailInfo } from '@/types'

type TLiveUpcoming = {
  status: string
}

interface SortType {
  sort: string
  filter: string
  chain: string
  search: string
  type: string
}

const LiveUpcoming: React.FC<TLiveUpcoming> = ({ status }) => {
  const [total, setTotal] = useState(0)
  const { address } = useAccount()
  const [page, setPage] = useState(0)
  const [isReloading, setIsReloading] = useState(false)
  const [launchpadTotal, setLaunchpadTotal] = useState<TLaunchpadDetailInfo[]>(
    []
  )
  const [getOption, SetGetOption] = useState<SortType>({
    sort: 'SALE_START_TIME',
    filter: status === 'coming-soon' ? 'requested' : 'None',
    chain: 'None',
    search: '',
    type: 'all',
  })
  const temp = useGetAllLaunchpad(status, getOption, page, address)
  const { data: launchpads, isLoading, refetchData } = temp
  const handleSearch = useDebouncedCallback((term: string) => {
    setLaunchpadTotal([])
    setPage(0)
    SetGetOption({ ...getOption, search: term })
  }, 300)

  const [priority, setPriority] = useState<string[]>(
    JSON.parse(localStorage.getItem('priority') || '[]')
  )

  const favouriteLaunchpads = _.filter(launchpadTotal, (launchpad) => {
    const index = priority.indexOf(launchpad.ID.toString())
    return index !== -1
  })

  const handlePriorityToggle = (str: string) => {
    const updatedPriority = [...priority]
    const index = updatedPriority.indexOf(str)

    if (index !== -1) {
      updatedPriority.splice(index, 1)
    } else {
      updatedPriority.push(str)
    }

    setPriority(updatedPriority)
    localStorage.setItem('priority', JSON.stringify(updatedPriority))
  }

  useEffect(() => {
    refetchData()
  }, [page])

  useEffect(() => {
    if (launchpads) {
      const newLaunchpadTotal = _.unionBy(launchpadTotal, launchpads, 'ID')
      setLaunchpadTotal(newLaunchpadTotal)
    }
    setIsReloading(false)
  }, [launchpads])

  useEffect(() => {
    if (launchpads) {
      setTotal((prevTotal) => {
        const maxItem = _.maxBy(launchpads, 'TOTAL')
        return maxItem?.TOTAL || prevTotal
      })
    }
  }, [launchpads])
  return (
    <div className="flex flex-col items-stretch py-8">
      <div className="flex justify-center">
        <AstraHeader>
          {status === 'user'
            ? 'Participated Token Sales on Astra DAO'
            : status === 'owner'
              ? 'Requested Token Sales'
              : 'Live and Upcoming Token Sales on Astra DAO'}
        </AstraHeader>
      </div>
      {status === 'all' ? (
        <div className="flex gap-6 mt-6 flex-wrap">
          <div
            className="flex-1 text-white text-sm"
            style={{ minWidth: '20%' }}
          >
            <Label>Search</Label>
            <Input
              placeholder="Enter token name or symbol"
              className="bg-white rounded-full border-astra-blue text-black"
              onChange={(e) => {
                handleSearch(e.target.value)
              }}
              disabled={isLoading || isReloading}
              defaultValue={getOption.search}
            />
          </div>
          <div className="text-white text-sm">
            <Label>Filter By</Label>
            <Select
              onValueChange={(value) => {
                setPage(0)
                setLaunchpadTotal([])
                SetGetOption({ ...getOption, filter: value })
              }}
            >
              <SelectTrigger className="w-30 lg:w-40">
                <SelectValue placeholder="No Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">No Filter</SelectItem>
                <SelectItem value="requested">Upcoming</SelectItem>
                <SelectItem value="approved">In Progress</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="finished">Ended</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="text-white text-sm">
            <Label>Pool Type</Label>
            <Select>
              <SelectTrigger className="w-30 lg:w-40">
                <SelectValue placeholder="No Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">No Filter</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div className="text-white text-sm">
            <Label>Sort By</Label>
            <Select
              onValueChange={(value) => {
                setPage(0)
                setLaunchpadTotal([])
                SetGetOption({ ...getOption, sort: value })
              }}
            >
              <SelectTrigger className="w-30 lg:w-40">
                <SelectValue placeholder="No Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LAUNCHPAD_INDEX">No Filter</SelectItem>
                <SelectItem value="HARD_CAP">Hard Cap</SelectItem>
                <SelectItem value="SOFT_CAP">Soft Cap</SelectItem>
                <SelectItem value="SALE_START_TIME">Start Time</SelectItem>
                <SelectItem value="SALE_END_TIME">End Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-white text-sm">
            <Label>Chain</Label>
            <Select
              onValueChange={(value) => {
                setPage(0)
                setLaunchpadTotal([])
                SetGetOption({ ...getOption, chain: value })
              }}
            >
              <SelectTrigger className="w-30 lg:w-40">
                <SelectValue placeholder="No Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">No Filter</SelectItem>
                <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                <SelectItem value="Binance">Binance</SelectItem>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <></>
      )}
      {isLoading ? (
        <>
          <div></div>
          <Loading />
        </>
      ) : (
        <>
          {favouriteLaunchpads.length !== 0 ? (
            <>
              <div className="flex">
                <AstraHeader className="text-astra-blue">
                  {favouriteLaunchpads.length === 1
                    ? 'Favourite'
                    : 'Favourites'}
                </AstraHeader>
              </div>
              <div className="border white w-full mt-3"></div>

              <div className="mt-8 gap-6 flex-wrap grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                {favouriteLaunchpads.map((item, i) => (
                  <LiveUpcomingCard
                    key={i}
                    launchpadData={item}
                    status={status}
                    handle={handlePriorityToggle}
                  />
                ))}
              </div>
              <div className="border white w-full mt-3"></div>
            </>
          ) : (
            <></>
          )}
          <div className="mt-8 gap-6 flex-wrap grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            {launchpadTotal.map((item, i) => (
              <LiveUpcomingCard
                key={i}
                launchpadData={item}
                status={status}
                handle={handlePriorityToggle}
              />
            ))}
          </div>
        </>
      )}
      {status === 'user' ? (
        <></>
      ) : (
        <div className="text-center mt-8">
          <Button
            onClick={() => {
              setIsReloading(true)
              setPage(page + 1)
            }}
            className="px-16"
            variant="astra-blue"
            disabled={launchpadTotal.length >= total}
            isLoading={isReloading}
          >
            {isReloading ? 'Loading...' : 'SEE MORE'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default LiveUpcoming
