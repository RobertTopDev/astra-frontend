import { AstraHeader } from '@/components'
import React from 'react'
import { AllocationChart } from './allocation-chart'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/shadcn'
import { allocation } from '@/constants'

const AboutAllocation = () => {
  return (
    <div className="relative z-20 container w-full pb-20">
      <div className="relative sm:mt-0 mt-10 w-full flex flex-col justify-center items-center gap-6">
        <div className="grid-cols-12 grid gap-6">
          <div className="col-span-6 flex flex-col gap-6">
            <AstraHeader className="text-left w-full">
              ASTRA DAO TOKEN ALLOCATION
            </AstraHeader>
            <div className="text-lg text-justify">
              The total supply of Astra DAO token is initially capped at 130
              Trillion tokens. The supply will only increase or decrease if the
              DAO votes to implement minting or token burn capability.
              <br />
              <br />
              Astra DAO token will be distributed among seven main groups, as
              detailed below. A portion of the tokens will be initially locked.
              Locked tokens will be unlocked over a period of time for the
              different groups according to the schedule detailed in the chart
              below, starting on launch day.
            </div>
          </div>
          <div className="col-span-6">
            <div className="w-full">
              <AllocationChart />
            </div>
          </div>
        </div>
        <div className="text-lg text-justify">
          To enable a decentralized ecosystem, provide valuable and appropriate
          incentives, Astra DAO allocated 45% of its tokens to LM and community
          rewards. Astra DAO also allocated 10% to the growth and community
          grant fund to foster growth and development.
        </div>
        <div className="w-full mt-6">
          <Table>
            <TableHeader>
              <TableRow className="[&>th]:text-astra-blue">
                <TableHead>Group</TableHead>
                <TableHead>ASTRA DAO ALLOCATIONS</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Cliff (weeks)</TableHead>
                <TableHead>TGE unlock</TableHead>
                <TableHead>Vesting (Weeks)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocation.map((alloc) => (
                <TableRow key={alloc.group} className="[&>td]:font-bold">
                  <TableCell>{alloc.group}</TableCell>
                  <TableCell>{alloc.allocation}</TableCell>
                  <TableCell>{alloc.percentage}%</TableCell>
                  <TableCell>{alloc.cliff}</TableCell>
                  <TableCell>{alloc.tge}</TableCell>
                  <TableCell>{alloc.vesting}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export { AboutAllocation }
