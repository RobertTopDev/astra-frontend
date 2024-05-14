import { Button, Card, CardContent, CardHeader } from '@/components/shadcn'
import { TIndex } from '@/types'
import React from 'react'
import { getRiskScoreColor, millifyText } from '@/util'
import styles from './indices.module.scss'
import clsx from 'clsx'
import { UserAvatar } from '@/components'
import { IndexChart } from '../../[tokenAddress]/sections/index-body/index-chart'
import Link from 'next/link'

type IndexCard = {
  index: TIndex
  id: string
}

const IndexCard = async ({ index, id }: IndexCard) => {
  return (
    <Card className=" bg-[#2b2b43] rounded-[10%] text-black flex flex-col w-full px-4 py-2 ">
      <CardHeader className="px-4 py-4">
        <UserAvatar
          address={index.ITOKEN_ADDR}
          name={index.ITOKENNAME}
          isToken
          nameLink={`/indices/${index.ITOKEN_ADDR}`}
        />
      </CardHeader>
      <CardContent className="h-full flex flex-col p-2 pb-4">
        <div className="h-full relative">
          <IndexChart index={index} id={id} style="card" />
        </div>
        <div
          className={clsx(
            styles['index-card-content'],
            'grid grid-cols-2 w-full mt-2 px-8'
          )}
        >
          <div className="flex my-1 text-white">
            <span className="text-left opacity-80 text-xs font-medium">
              TVL
            </span>
            <span className="text-left text-[31px] font-normal">
              ${millifyText(Math.round(index.TVL) / Math.pow(10, 6))}
            </span>
          </div>
          <div className="flex my-1 text-white">
            <span className="text-left opacity-80 text-xs font-medium">
              ROI
            </span>
            <span className="text-left text-[#00c938] text-[31px] font-normal">
              {!!index.ROI ? parseFloat(index.ROI).toFixed(2) : '0'}%
            </span>
          </div>
          <div className="flex my-1 text-white">
            <span className="text-left opacity-80 text-xs font-medium">
              RISK SCORE
            </span>
            <span
              className={`${getRiskScoreColor(
                !!index ? index?.RISK_SCORE : 0
              )} text-left text-[31px] font-normal`}
            >
              {index?.RISK_SCORE ? index?.RISK_SCORE + '/5' : 'N/A'}&nbsp;
            </span>
          </div>
          <div className="flex my-1 text-white">
            <span className=" text-left opacity-80 text-xs font-medium">
              MAX DRAW DOWN
            </span>
            <span className="text-destructive text-left text-[31px] font-normal">
              {index?.MAX_DROP_DOWN ? -index?.MAX_DROP_DOWN.toFixed(2) : '-0'}%
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <Link href={`/indices/${index.ITOKEN_ADDR}`}>
            <Button variant="astra-blue">INVEST</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export { IndexCard }
