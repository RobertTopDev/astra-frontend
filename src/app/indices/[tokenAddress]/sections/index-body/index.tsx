'use client'
import { TIndex, TIndexCompositionWithAsset } from '@/types'
import { getRiskScoreColor, millifyText } from '@/util'
import clsx from 'clsx'
import { useState } from 'react'
import { IndexChart, choices } from './index-chart'
import { cn } from '@/lib'
import { IndexComposition } from './index-composition'

type TIndexBody = {
  assetsData: TIndexCompositionWithAsset[]
  assetsDataLoading: boolean
  index: TIndex
  className?: string
}

const IndexBody = ({
  index,
  assetsData,
  className,
  assetsDataLoading,
}: TIndexBody) => {
  const [activeChoice, setActiveChoice] = useState<(typeof choices)[number]>(
    choices[choices.length - 1]
  )
  return (
    <div
      className={cn('relative z-10 container mx-auto w-full pb-20', className)}
    >
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-6 flex flex-col gap-12">
          <div className="flex justify-end">
            <ul className="flex gap-1">
              {choices.map((choice) => (
                <li
                  key={choice}
                  onClick={() => setActiveChoice(choice)}
                  className={clsx(
                    'cursor-pointer px-2',
                    activeChoice === choice
                      ? 'text-astra-blue font-bold border-b-[2px] border-b-astra-blue'
                      : 'hover:text-white/80'
                  )}
                >
                  {choice}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 flex flex-col">
              <div className="text-sm">Total Value Locked</div>
              <div className="text-xl">
                ${millifyText(Math.round(index.TVL) / Math.pow(10, 6))}
              </div>
            </div>
            <div className="col-span-3 flex flex-col">
              <div className="text-sm">Return on Investment</div>
              <div className="text-green-400 text-xl">
                {index?.ROI_NEW ? parseFloat(index.ROI_NEW).toFixed(2) + '%' : 'N/A'}
              </div>
            </div>
            <div className="col-span-3 flex flex-col">
              <div className="text-sm">Risk Score</div>
              <div
                className={clsx(
                  getRiskScoreColor(index.RISK_SCORE ? index.RISK_SCORE : 1),
                  'text-xl'
                )}
              >
                {index?.RISK_SCORE ? index?.RISK_SCORE + '/5' : 'N/A'}
              </div>
            </div>
            <div className="col-span-3 flex flex-col">
              <div className="text-sm">Max Draw Down</div>
              <div className="text-xl text-destructive">
                {index?.MAX_DROP_DOWN
                  ? -(index?.MAX_DROP_DOWN).toFixed(2)
                  : '-0'}
                %
              </div>
            </div>
          </div>
          <div className="relative rounded-md">
            <IndexChart index={index} choice={activeChoice} id="chart" />
          </div>
          <div>
            *80% of the performance fees will be sent to pool creator, 16%
            distributed among stakers, and 4% will be sent to the treasury.
          </div>
        </div>
        <div className="col-span-6 flex flex-col gap-6 relative">
          <IndexComposition
            index={index}
            assetsData={assetsData}
            assetsDataLoading={assetsDataLoading}
          ></IndexComposition>
        </div>
      </div>
    </div>
  )
}

export { IndexBody }
