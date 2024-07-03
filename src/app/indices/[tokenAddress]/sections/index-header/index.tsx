'use client'
import { UserAvatar } from '@/components'
import { TIndex, TInvestmentToken } from '@/types'
import React from 'react'
import { differenceInHours, format } from 'date-fns'
import { numberFormatter } from '@/util'
import styles from './index-header.module.scss'
import clsx from 'clsx'
import { BuyIndex } from './buy-index'
import { useGetAllITokens } from '@/hooks'

type TIndexHeader = {
  index: TIndex
  investmentTokens: TInvestmentToken[]
}

export const IndexHeader = ({ index, investmentTokens }: TIndexHeader) => {
  const createdAt = format(new Date(index.CREATED_AT), 'MM/dd/yyyy')
  const rebalancingPeriod = getRebalancingPeriod(
    index.LAST_REBALANCE,
    index.REBAL_TIME
  )
  const { data: iTokens } = useGetAllITokens({})

  return (
    <div className="relative z-10 container mx-auto w-full flex flex-col gap-6">
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-6">
          <div className="flex items-center gap-4">
            <UserAvatar address={index.OWNER} name={index.ITOKENNAME} />
            <BuyIndex index={index} investmentTokens={investmentTokens} />
          </div>
        </div>
        <div
          className={clsx(
            styles['span-text'],
            'col-span-6 flex flex-col gap-2'
          )}
        >
          <div>
            Created on: <span>{createdAt}</span>
          </div>
          <div>
            Rebalancing Period:&nbsp;
            <span className="capitalize">{rebalancingPeriod}</span>
          </div>
          <div>
            Eligible for Staking:&nbsp;
            <span>
              {iTokens?.some(
                (itok) => itok.contractAddress === index.ITOKEN_ADDR
              )
                ? 'Yes'
                : 'No'}
            </span>
          </div>
          <div>
            Minimum TVL to Start Index:&nbsp;
            <span>${numberFormatter(index?.ORIGINAL_THRESHOLD || 0)}</span>
          </div>
        </div>
      </div>
      <div>{index.DESCRIPTION}</div>
    </div>
  )
}

const getRebalancingPeriod = (last: string, rebal: string) => {
  const hours = differenceInHours(
    new Date(Number(last) * 1000),
    new Date(Number(rebal) * 1000)
  )
  if (hours <= 60) {
    return 'daily'
  } else if (hours <= 168) {
    return 'weekly'
  } else if (hours <= 504) {
    return 'quarterly'
  } else if (hours <= 730.001) {
    return 'monthly'
  } else if (hours > 730.001) {
    return 'yearly'
  } else {
    return 'daily'
  }
}
