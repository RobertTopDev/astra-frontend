'use client'

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
import { AstraHeader, AstraLink } from '@/components'
import LiveUpcomingCard from './LiveUpcomingCard'
import { useGetAllLaunchpad } from '@/hooks'
import Loading from '@/app/loading'
import { useState } from 'react'
type TLiveUPcoming = {
  status: string
}

export default function LiveUpcoming({ status }: TLiveUPcoming) {
  const [getOption, SetGetOption] = useState({ sort: 'ID' })
  const temp = useGetAllLaunchpad(status, getOption)
  let { data: launchpads } = temp
  const { isLoading, isError } = temp
  launchpads = isError ? [] : launchpads || []

  return (
    <div className="flex flex-col items-stretch py-8">
      <div className="flex justify-center">
        <AstraHeader>Live and Upcoming Projects on Astra DAO</AstraHeader>
      </div>
      {status === 'approved' ? (
        <div className="flex gap-6 mt-6">
          <div className="flex-1 text-white text-sm">
            <Label>Search</Label>
            <Input
              placeholder="Enter token name or symbol"
              className="bg-white rounded-full border-astra-blue text-black"
            />
          </div>
          <div className="text-white text-sm">
            <Label>Filter By</Label>
            <Select>
              <SelectTrigger className="w-30 lg:w-40">
                <SelectValue placeholder="No Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">No Filter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-white text-sm">
            <Label>Pool Type</Label>
            <Select>
              <SelectTrigger className="w-30 lg:w-40">
                <SelectValue placeholder="No Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">No Filter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-white text-sm">
            <Label>Sort By</Label>
            <Select
              onValueChange={(value) =>
                SetGetOption({ ...getOption, sort: value })
              }
            >
              <SelectTrigger className="w-30 lg:w-40">
                <SelectValue placeholder="No Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ID">No Filter</SelectItem>
                <SelectItem value="HARD_CAP">Hard Cap</SelectItem>
                <SelectItem value="SOFT_CAP">Soft Cap</SelectItem>
                {/* <SelectItem value="lpPercent">LP percent</SelectItem> */}
                <SelectItem value="SALE_START_TIME">Start Time</SelectItem>
                <SelectItem value="SALE_END_TIME">End Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-white text-sm">
            <Label>Chain</Label>
            <Select>
              <SelectTrigger className="w-30 lg:w-40">
                <SelectValue placeholder="No Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">No Filter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="mt-8 gap-6 flex-wrap grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {isLoading ? (
          <>
            <div></div>
            <Loading />
          </>
        ) : (
          launchpads.map((item, i) => (
            <LiveUpcomingCard key={i} launchpadData={item} status={status} />
          ))
        )}
      </div>
      <div className="text-center mt-8">
        <AstraLink link="https://app.uniswap.org/#/swap?inputCurrency=0x7486620D5c4505f315E4E3b4Da102afBFAcE753C&outputCurrency=0x68A27491Efe143D86cA2EA65B21Cc45997447E4e">
          <Button className="px-16" variant="astra-blue">
            SEE ALL
          </Button>
        </AstraLink>
      </div>
    </div>
  )
}
