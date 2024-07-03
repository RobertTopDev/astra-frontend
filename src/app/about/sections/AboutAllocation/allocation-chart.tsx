'use client'
import ReactEchartsCore from 'echarts-for-react'
import React, { useMemo } from 'react'
import { allocation } from '@/constants/about'

const AllocationChart = () => {
  // const [currentIndexAllocation, setCurrentIndexAllocation] = useState([])
  const allocations = useMemo(() => {
    return allocation.map((item) => {
      return {
        name: item.group,
        value: item.percentage,
      }
    })
  }, [])
  const optionsCurrentIndex = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        valueFormatter: (value: number | string) => value + '%',
        textStyle: {
          color: 'black', // Set the tooltip text color to black
        },
      },
      series: [
        {
          type: 'pie',
          data: allocations,
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
  }, [allocations])

  const EChartsCurrentIndex = useMemo(() => {
    return React.memo(function EChartsCore() {
      return (
        <div className="px-4 w-full aspect-square">
          <ReactEchartsCore
            option={optionsCurrentIndex}
            notMerge={true}
            lazyUpdate={true}
            theme={'my_theme'}
            style={{
              height: '100%',
              width: '100%',
            }}
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

export { AllocationChart }
