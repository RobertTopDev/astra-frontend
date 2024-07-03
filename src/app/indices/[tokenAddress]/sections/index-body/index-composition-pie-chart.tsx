'use client'
import { TIndexCompositionWithAsset } from '@/types'
import React, { useEffect, useMemo, useState } from 'react'
import ReactEchartsCore from 'echarts-for-react'
import { useToast } from '@/components/shadcn'

type CurrentIndexAllocation = {
  value: number
  name: string | undefined
  TOKEN_CONTRACT_ADDR: `0x${string}`
  TOKEN_WEIGHT: string
  decimals?: number | undefined
  tokenBalance?: string | undefined
  holdings?: number | undefined
  tokenPrice?: number | undefined
}

type TIndexCompositionPieChartProps = {
  assetsData: TIndexCompositionWithAsset[]
}

const IndexCompositionPieChart = ({
  assetsData,
}: TIndexCompositionPieChartProps) => {
  const { toast } = useToast()
  const [currentIndexAllocation, setCurrentIndexAllocation] = useState<
    CurrentIndexAllocation[]
  >([])

  useEffect(() => {
    const array = assetsData.map((token) => {
      return {
        ...token,
        value: Number(token?.TOKEN_WEIGHT),
        name: token.name,
      }
    })
    setCurrentIndexAllocation(array)
  }, [assetsData])

  const optionsCurrentIndex = useMemo(() => {
    return {
      color: [
        '#443B9C',
        '#716AB8',
        '#1600F8',
        '#E02020',
        '#FFC300',
        '#5E5E84',
        '#28BDFD',
        '#28E7FD',
        '#00C938',
        '#00FF75',
        '#FFC300',
      ],
      tooltip: {
        trigger: 'item',
        valueFormatter: (value: number | string) => value + '%',
        textStyle: {
          color: 'black', // Set the tooltip text color to black
        },
      },
      series: [
        {
          height: 300,
          type: 'pie',
          data: currentIndexAllocation,
          avoidLabelOverlap: true,
          label: {
            textStyle: {
              fontSize: 14,
            },
            color: '#EEE',
            formatter: '{b}  {c}%',
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: '#fff',
          },
          smooth: true,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  }, [currentIndexAllocation])

  function copyTextFunction(e?: { data?: { TOKEN_CONTRACT_ADDR: string } }) {
    navigator.clipboard
      .writeText(e?.data?.TOKEN_CONTRACT_ADDR ?? '')
      .then(() => {
        toast({
          title: 'Copied to clipboard',
          description: 'Token address copied to clipboard',
        })
      })
  }

  const EChartsCurrentIndex = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return React.memo(() => {
      return (
        <div className="h-[140px] py-2 h-[400px] w-full">
          <ReactEchartsCore
            option={optionsCurrentIndex}
            notMerge={true}
            lazyUpdate={true}
            theme={'my_theme'}
            style={{
              height: '100%',
              width: '100%',
            }}
            onEvents={{ click: copyTextFunction }}
          />
        </div>
      )
    })
  }, [optionsCurrentIndex])

  return (
    <>
      <EChartsCurrentIndex />
    </>
  )
}

export { IndexCompositionPieChart }
