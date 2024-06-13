'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/shadcn'
import { AstraHeader } from '@/components'
import LiveUpcomingCard from '../../(page)/components/LiveUpcomingCard'
import { useGetAllLaunchpad } from '@/hooks'
import Loading from '@/app/loading'
import { useDebouncedCallback } from 'use-debounce'
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
  const [page, setPage] = useState(0)
  const [isReloading, setIsReloading] = useState(false)
  const [launchpadTotal, setLaunchpadTotal] = useState<TLaunchpadDetailInfo[]>(
    []
  )
  const [getOption, SetGetOption] = useState<SortType>({
    sort: 'SALE_START_TIME',
    filter: 'requested',
    chain: 'None',
    search: '',
    type: 'all',
  })

  const temp = useGetAllLaunchpad(status, getOption, page)
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

  const deleteLaunchpadInUIByID = (id: string) => {
    const temp = _.filter(launchpadTotal, (launchpad) => {
      return launchpad.ID.toString() !== id
    })
    setLaunchpadTotal(temp)
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

  return (
    <div className="flex flex-col items-stretch py-8">
      <div className="flex justify-center">
        <AstraHeader>Live and Upcoming Token Sales on Astra DAO</AstraHeader>
      </div>
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
                <AstraHeader className="text-astra-blue">{favouriteLaunchpads.length===1?'Favourite':'Favourites'}</AstraHeader>
              </div>
              <div className="border white w-full mt-3"></div>

              <div className="mt-8 gap-6 flex-wrap grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                {favouriteLaunchpads.map((item, i) => (
                  <LiveUpcomingCard
                    key={i}
                    status={status}
                    launchpadData={item}
                    handle={handlePriorityToggle}
                    deleteInUI={deleteLaunchpadInUIByID}
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
                status={status}
                launchpadData={item}
                handle={handlePriorityToggle}
                deleteInUI={deleteLaunchpadInUIByID}
              />
            ))}
          </div>
        </>
      )}

      <div className="text-center mt-8">
        <Button
          onClick={() => {
            setIsReloading(true)
            setPage(page + 1)
          }}
          className="px-16"
          variant="astra-blue"
          disabled={launchpads?.length !== 6}
          isLoading={isReloading}
        >
          {isReloading ? 'Loading...' : 'SEE MORE'}
        </Button>
      </div>
    </div>
  )
}

export default LiveUpcoming
