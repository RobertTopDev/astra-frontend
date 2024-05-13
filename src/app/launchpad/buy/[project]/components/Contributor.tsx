'use client'

import React from 'react'
import { useGetContributorListForDB, useChainConfig } from '@/hooks'
import {
  Card,
  CardContent,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/shadcn'
import { AstraHeader, AstraLoading } from '@/components'
import { shorten } from '@/util'

type Props = {
  launchpadAddress: `0x${string}`
}
export default function Contributor({ launchpadAddress }: Props) {
  const { chainConfig } = useChainConfig()

  const { data: contributorList, isLoading: contributorListLoading } =
    useGetContributorListForDB(launchpadAddress)

  return (
    <>
      <div className="text-center">
        <AstraHeader>Contributor List</AstraHeader>
        <h4>Investing transaction table</h4>
      </div>
      <Card className="w-full relative mt-8 border-0 col-span-1 rounded-3xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl p-16">
        <CardContent className="p-0 items-stretch gap-8">
          <div>
            <Table>
              <TableHeader className="[&_tr]:border-white :p-2">
                <TableRow className="h-12">
                  <TableHead>User</TableHead>
                  <TableHead>Invest Amount</TableHead>
                  <TableHead>Transaction Link</TableHead>
                  <TableHead>Invest At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr]:border-0 text-left">
                <AstraLoading isLoading={contributorListLoading}>
                  {contributorList?.map((con: any, idx: number) => (
                    <TableRow
                      className="h-12"
                      key={idx}
                      onClick={() =>
                        window.open(
                          `${chainConfig.networkURL}/tx/${con.CONTRIBUTE_TRANSACTION}`
                        )
                      }
                    >
                      <TableCell>{shorten(con.CONTRIBUTOR_ADDRESS)}</TableCell>
                      <TableCell>{con.CONTRIBUTED_AMOUNT} USDC</TableCell>
                      <TableCell>
                        {shorten(con.CONTRIBUTE_TRANSACTION)}
                      </TableCell>
                      <TableCell>{con.CREATED_AT}</TableCell>
                    </TableRow>
                  ))}
                </AstraLoading>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
