'use client'
import React from 'react'
import { ProposalsMenu } from '../../components/proposals-menu'
import { AstraCard, AstraHeader, AstraLoading } from '@/components'
import {
  Button,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn'
import { useAllProposals } from '@/hooks'
import { ArrowDownIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { ProposalRow } from './proposal-row'

const ProposalsInfo = () => {
  const [filter, setFilter] = React.useState('all')
  const { data: proposals, isLoading: proposalsLoading } = useAllProposals({
    limit: 5,
  })

  const proposalOptions = [
    { value: 'all', label: 'All' },
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Active' },
    { value: '2', label: 'Canceled' },
    { value: '3', label: 'Defeated' },
    { value: '4', label: 'Succeeded' },
    { value: '5', label: 'Queued' },
    { value: '6', label: 'Expired' },
    { value: '7', label: 'Executed' },
  ]

  return (
    <div className="w-full container pb-20">
      <AstraHeader className="text-center my-10">OVERVIEW</AstraHeader>
      <div className="grid grid-cols-12 gap-4">
        <ProposalsMenu className="col-span-3" />
        <AstraCard contentClassName="h-full" className="col-span-9 h-full">
          <div className="flex flex-col w-full h-full gap-4">
            <div className="relative w-full flex justify-center">
              <div className="text-xl font-bold tracking-wide">
                RECENT PROPOSALS
              </div>
              <div className="absolute right-0 transform top-1/2 -translate-y-1/2">
                <Select onValueChange={setFilter} defaultValue={filter}>
                  <SelectTrigger className="w-auto min-w-[10rem]">
                    <SelectValue placeholder="Select an Action" />
                  </SelectTrigger>
                  <SelectContent>
                    {proposalOptions?.map((proposalOption) => (
                      <SelectItem
                        value={proposalOption.value}
                        key={proposalOption.value}
                      >
                        {proposalOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            {!!proposals && proposals.length > 0 ? (
              proposals.map((proposal) => (
                <>
                  <ProposalRow proposal={proposal}></ProposalRow>
                  <Separator></Separator>
                </>
              ))
            ) : proposalsLoading ? (
              <div className="flex justify-center items-center h-full w-full">
                <AstraLoading isLoading={proposalsLoading}></AstraLoading>
              </div>
            ) : (
              <div className="flex justify-center items-center h-full w-full">
                There is no Proposals
              </div>
            )}
            {!!proposals && proposals.length >= 5 ? (
              <div className="flex justify-center">
                <Link href="/governance/proposals/all">
                  <Button variant="astra-blue">
                    <div className="flex items-center">
                      View All Proposals <ArrowDownIcon></ArrowDownIcon>
                    </div>
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        </AstraCard>
      </div>
    </div>
  )
}

export { ProposalsInfo }
