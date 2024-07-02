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
import { TLaunchpadDetailInfo } from '@/types'

type Props = {
  launchpadAddress: `0x${string}`
  launchpadData: TLaunchpadDetailInfo
}
export default function Contributor({
  launchpadAddress,
  launchpadData,
}: Props) {
  const { chainConfig } = useChainConfig()

  const { data: contributorList, isLoading: contributorListLoading } =
    useGetContributorListForDB(launchpadAddress)

  const tokenArray = [
    {
      symbol: 'USDT',
      address: chainConfig.USDTContractAddress,
    },
    {
      symbol: 'USDC',
      address: chainConfig.USDCContractAddress,
    },
    {
      symbol: 'ETH',
      address: chainConfig.WETHContractAddress,
    },
  ]

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
                      <TableCell>
                        {con.CONTRIBUTED_AMOUNT}{' '}
                        {tokenArray
                          .filter(
                            (token) =>
                              token.address === launchpadData?.BASE_TOKEN
                          )
                          .map((token) => token.symbol)}
                      </TableCell>
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
