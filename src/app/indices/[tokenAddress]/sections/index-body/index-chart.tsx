'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createChart,
  ColorType,
  Background,
  Time,
  IChartApi,
} from 'lightweight-charts'
import { TIndex } from '@/types'
import { format, subDays } from 'date-fns'
import { getChartOptions } from '@/util'
import { useIndexPerformance, useIndexPerformanceDate } from '@/hooks'
import { AstraLoading } from '@/components'
import isEmpty from 'lodash/isEmpty'

export const choices = ['1D', '1W', '1M', '3M', '1Y', 'MAX'] as const

type SeriesData = {
  value?: number
  close?: number
}

type TIndexChartProps = {
  index: TIndex
  choice?: (typeof choices)[number]
  id: string
  style?: 'card' | 'page'
}

export const IndexChart = ({ index, choice, id, style }: TIndexChartProps) => {
  const isCard = style === 'card'
  const divRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi>()
  const [chartOptions, setChartOptions] = useState<{
    min?: number
    max?: number
    type: string
  }>({
    type: choice ?? '15m',
  })
  const {
    data: { min, max },
  } = useIndexPerformanceDate({
    index,
  })

  const { data: indexData, isLoading: isLoadingData } = useIndexPerformance({
    index,
    chartOptions,
    enabled: !!index.ITOKEN_ADDR,
  })

  useEffect(() => {
    setChartOptions((p) => ({ ...p, type: choice ?? '15m' }))
  }, [choice])

  // fallback to default period if no data for selected period
  useEffect(() => {
    if (
      !isLoadingData && // not loading/ finished loading
      indexData === undefined && // loaded data is undefined
      !!min &&
      !!max
    ) {
      const chartOpts = getChartOptions(min, max)
      setChartOptions(chartOpts)
    }
  }, [min, max, indexData, isLoadingData])

  const [width, height] = [900, 450]
  const [chartLegend, setChartLegend] = useState({
    total: true,
    eth: true,
    index: true,
    // tvl: id === 'chart_two' || id === 'chart' ? true : false,
  })
  function dateToString(inputDate: number) {
    const date = new Date(inputDate * 1000)
    return format(
      new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      ),
      'dd MMM yy, HH:mm:ss'
    )
  }

  useEffect(() => {
    if (chartRef.current === undefined || !chartRef.current?.timeScale) return
    const to = Math.floor(new Date().getTime() / 1000)
    switch (choice) {
      case '1D':
        chartRef.current?.timeScale().setVisibleRange({
          from: Math.floor(subDays(new Date(), 1).getTime() / 1000) as Time,
          to: to as Time,
        })
        break
      case '1W':
        chartRef.current?.timeScale().setVisibleRange({
          from: Math.floor(subDays(new Date(), 7).getTime() / 1000) as Time,
          to: to as Time,
        })
        break
      case '1M':
        chartRef.current?.timeScale().setVisibleRange({
          from: Math.floor(subDays(new Date(), 30).getTime() / 1000) as Time,
          to: to as Time,
        })
        break
      case '3M':
        chartRef.current?.timeScale().setVisibleRange({
          from: Math.floor(subDays(new Date(), 90).getTime() / 1000) as Time,
          to: to as Time,
        })
        break
      case '1Y':
        chartRef.current?.timeScale().setVisibleRange({
          from: Math.floor(subDays(new Date(), 365).getTime() / 1000) as Time,
          to: to as Time,
        })
        break
      case 'MAX':
        // CHART FIT CONTENT
        chartRef.current?.timeScale().fitContent()
        break
      default:
        break
    }
    // update chart
  }, [choice])
  useEffect(() => {
    const lineData = []
    const lineData2 = []
    const lineData3 = []
    const lineData4 = []

    if (!divRef.current) return

    if (indexData && indexData?.length > 0) {
      for (const each of indexData) {
        lineData.push({
          time: Math.floor(Date.parse(each?.DATE + 'Z') / 1000) as Time,
          value: Number(each?.TOTAL_MARKET_CUMULATIVE_ROI),
        })
        lineData2.push({
          time: Math.floor(Date.parse(each?.DATE + 'Z') / 1000) as Time,
          value: Number(each?.ETH_CUMULATIVE_ROI),
        })
        lineData3.push({
          time: Math.floor(Date.parse(each?.DATE + 'Z') / 1000) as Time,
          value: each?.INDEX_CUMULATIVE_ROI ?? 0,
        })
        // lineData4.push({
        //   time: Math.floor(Date.parse(each?.DATE + 'Z') / 1000) as Time,
        //   value: each?.TVL ?? 0,
        // })
      }

      const temp = document.getElementById(`${id}`)

      if (temp) {
        // do not remove tooltip as it causes re-rendering of the whole chart multiple times
        temp.innerHTML = ''

        const toolTipWidth = 200
        // const toolTipWidth = id === 'chart' ? 200 : 120

        const toolTipHeight = 300
        const toolTipMargin = 0

        // Create and style the tooltip html element
        const toolTip: HTMLDivElement = document.createElement('div')
        if (
          chartLegend.total ||
          chartLegend.eth ||
          chartLegend.index
          // ||chartLegend.tvl
        ) {
          toolTip.style.cssText = `width:${toolTipWidth}px; height:100%; overflow: hidden; position:absolute;padding: 8px 8px 8px 8px;display:none;font-size: 14px; text-align:left;z-index:100000;top:12px;left:12px;box-shadow:5px 11px 70px rgba(18, 18, 18, 0.08); pointer-events: none`
          toolTip.style.background = 'rgba(255,255,255,0.1)'
          toolTip.style.color = '#fff'
          toolTip.style.borderColor = 'rgba(0, 120, 255, 1)'
          temp.appendChild(toolTip)
        }

        const chart = createChart(divRef.current, {
          height: 300,
          leftPriceScale: {
            scaleMargins: {
              top: 0.2,
              bottom: 0.2,
            },
            visible: true,
            borderVisible: false,
            // borderColor: 'rgba(178,178,178,0)',
          },
          rightPriceScale: {
            visible: false,
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: true,
            // borderColor: 'rgba(178, 178, 178, 0)',
            borderVisible: false,
          },
          grid: {
            horzLines: {
              color: 'rgba(0,0,0,0)',
            },
            vertLines: {
              color: 'rgba(0,0,0,0)',
            },
          },
          crosshair: {
            horzLine: {
              labelVisible: false,
            },
            vertLine: {
              visible: true,
              style: 0,
              width: 2,
              color: 'rgba(255, 255, 255, 0.4)',
              labelVisible: false,
            },
          },
          layout: {
            background: {
              type: ColorType.Solid,
              // color: isCard ? '#2B2B43' : '#323150',
              color: 'rgba(1,1,1,0)',
            } as Background,
            textColor: isCard ? '#fff' : '#fff',
            fontFamily: 'Roboto, sans-serif',
            fontSize: id === 'chart' ? 14 : 12,
          },
          // localization: {
          //   dateFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
          // },
          handleScroll: {
            mouseWheel: false,
            pressedMouseMove: true,
          },
          handleScale: {
            // axisPressedMouseMove: true,
            mouseWheel: true,
            pinch: true,
          },
        })

        const lineSeries1 = chart.addAreaSeries({
          visible: chartLegend.total,
          priceScaleId: 'left',
          lineWidth: 2,
          lineColor: 'rgba(251, 252, 118 ,1)',
          bottomColor: 'rgba(251, 252, 118 ,0)',
          topColor: 'rgba(251, 252, 118 ,0.25)',
        })
        lineSeries1.setData(lineData)

        const lineSeries2 = chart.addAreaSeries({
          visible: chartLegend.eth,
          priceScaleId: 'left',
          lineWidth: 2,
          lineColor: 'rgba(0, 231, 255, 1)',
          topColor: 'rgba(0, 231, 255, 0.25)',
          bottomColor: 'rgba(0, 231, 255, 0)',
        })
        lineSeries2.setData(lineData2)

        const lineSeries3 = chart.addAreaSeries({
          visible: chartLegend.index,
          priceScaleId: 'left',
          lineWidth: 2,
          lineColor: 'rgba(0, 255, 133, 1)',
          bottomColor: 'rgba(0, 255, 133, 0)',
          topColor: 'rgba(0, 255, 133, 0.25)',
        })
        lineSeries3.setData(lineData3)

        // const lineSeries4 = chart.addAreaSeries({
        //   visible: chartLegend.tvl,
        //   priceScaleId: 'left',
        //   lineWidth: 2,
        //   lineColor: 'rgba(117, 54, 232, 1)',
        //   bottomColor: 'rgba(117, 54, 232, 0)',
        //   topColor: 'rgba(117, 54, 232, 0.25)',
        // })
        // lineSeries4.setData(lineData4)

        chart.subscribeCrosshairMove(function (param) {
          if (
            param === undefined ||
            param.time === undefined ||
            param.point === undefined ||
            param.point.x < 0 ||
            param.point.x > divRef.current!.clientWidth ||
            param.point.y < 0 ||
            param.point.y > divRef.current!.clientWidth
          ) {
            toolTip.style.display = 'none'
          } else {
            // const dateStr = dateToString(param.time);
            const dateStr = dateToString(Number(param.time))
            toolTip.style.display = 'block'

            const data = param.seriesData.get(lineSeries1) as SeriesData
            const tooltipData =
              data?.value !== undefined ? data?.value : data?.close

            const data2 = param.seriesData.get(lineSeries2) as SeriesData
            const tooltipData2 =
              data2?.value !== undefined ? data2?.value : data2?.close

            const data3 = param.seriesData.get(lineSeries3) as SeriesData
            const tooltipData3 =
              data3?.value !== undefined ? data3?.value : data3?.close

            // const data4 = param.seriesData.get(lineSeries4) as SeriesData
            // const tooltipData4 =
            //   data4?.value !== undefined ? data4?.value : data4?.close

            // const theme = 'dark'
            toolTip.innerHTML = `
            <div style='display: flex; height:100%; flex-direction: column; justify-content: space-between'>
            <div>
            <div style="display:${
              chartLegend.total ? 'inline-block' : 'none'
            };height:12px;width:12px;pointer-events: none;background-color:${'#FBFC76'};wordWrap:break-word; overflowWrap: break-word;border-radius:50%"> </div>
            <div style="line-height:27px;display: ${
              chartLegend.total ? 'inline' : 'none'
            };font-size: 14px;wordWrap:break-word; overflowWrap: break-word";  color:'#EEEEEE'">  
            Total Crypto ROI: <span style='color:'#EEEEEE';'> ${tooltipData?.toFixed(
              2
            )}%</span>
            </div> <br  style="display: ${
              chartLegend.total ? 'inline-block' : 'none'
            }">

            <div style="display: ${
              chartLegend.eth ? 'inline-block' : 'none'
            };height:12px;width:12px;pointer-events: none;background-color:${'#00E7FF'};wordWrap:break-word; overflowWrap: break-word;border-radius:50%"> </div>
            <div style="line-height:27px;display: ${
              chartLegend.eth ? 'inline' : 'none'
            };font-size: 14px;  wordWrap:break-word; overflowWrap: break-word";  color:'#EEEEEE'">  
            ETH ROI:<span style='color:'#EEEEEE';'> ${tooltipData2?.toFixed(2)}%
          </span>
            </div> <br style="display: ${
              chartLegend.eth ? 'inline-block' : 'none'
            }">
            
            <div style="display: ${
              chartLegend.index ? 'inline-block' : 'none'
            };height:12px;width:12px;pointer-events: none;background-color:${'#00FF85'};wordWrap:break-word; overflowWrap: break-word;border-radius:50%"> </div>
            <div style="line-height:27px;display: ${
              chartLegend.index ? 'inline' : 'none'
            };font-size: 14px;  wordWrap:break-word; overflowWrap: break-word";  color:'#EEEEEE'">
            Index ROI:<span style='color:'#EEEEEE';'> ${tooltipData3?.toFixed(
              2
            )}%</span>
            </div> <br style="display: ${
              chartLegend.index ? 'inline-block' : 'none'
            }">
            
            <div style="border-bottom:1px solid #565656;margin-left:-8px;margin-bottom:150px"></div>
            </div>
            <div style="margin-bottom:5px; text-align: center; display:absolute;bottom:0px">${format(
              new Date(dateStr),
              'yyyy-MM-dd HH:mm'
            )}</div>
            </div>
            `
            //   toolTip.innerHTML = `
            //   <div style="display:${
            //     chartLegend.total ? 'inline-block' : 'none'
            //   };height:12px;width:12px;pointer-events: none;background-color:${'#FBFC76'};wordWrap:break-word; overflowWrap: break-word;border-radius:50%"> </div>
            //   <div style="line-height:27px;display: ${
            //     chartLegend.total ? 'inline' : 'none'
            //   };font-size: 14px;wordWrap:break-word; overflowWrap: break-word";  color:'#EEEEEE'">
            //   ${
            //     id === 'chart' ? 'Total Crypto ROI:' : 'Total:'
            //   } <span style='color:'#EEEEEE';'> ${tooltipData?.toFixed(2)}%</span>
            //   </div> <br  style="display: ${
            //     chartLegend.total ? 'inline-block' : 'none'
            //   }">

            //   <div style="display: ${
            //     chartLegend.eth ? 'inline-block' : 'none'
            //   };height:12px;width:12px;pointer-events: none;background-color:${'#00E7FF'};wordWrap:break-word; overflowWrap: break-word;border-radius:50%"> </div>
            //   <div style="line-height:27px;display: ${
            //     chartLegend.eth ? 'inline' : 'none'
            //   };font-size: 14px;  wordWrap:break-word; overflowWrap: break-word";  color:'#EEEEEE'">
            //   ${
            //     id === 'chart' ? 'ETH ROI:' : 'ETH:'
            //   } <span style='color:'#EEEEEE';'> ${tooltipData2?.toFixed(2)}%
            // </span>
            //   </div> <br style="display: ${
            //     chartLegend.eth ? 'inline-block' : 'none'
            //   }">

            //   <div style="display: ${
            //     chartLegend.index ? 'inline-block' : 'none'
            //   };height:12px;width:12px;pointer-events: none;background-color:${'#00FF85'};wordWrap:break-word; overflowWrap: break-word;border-radius:50%"> </div>
            //   <div style="line-height:27px;display: ${
            //     chartLegend.index ? 'inline' : 'none'
            //   };font-size: 14px;  wordWrap:break-word; overflowWrap: break-word";  color:'#EEEEEE'">
            //   ${
            //     id === 'chart' ? 'Index ROI:' : 'Index:'
            //   } <span style='color:'#EEEEEE';'> ${tooltipData3?.toFixed(
            //     2
            //   )}%</span>
            //   </div> <br style="display: ${
            //     chartLegend.index ? 'inline-block' : 'none'
            //   }">

            //   <div style="border-bottom:1px solid #565656;margin-left:-8px;margin-bottom:150px"></div>
            //   <div style="margin-bottom:5px; text-align: center ">${format(
            //     new Date(dateStr),
            //     'yyyy-MM-dd HH:mm'
            //   )}</div>
            //   `
            let left = param.point.x + 0 // relative to timeScale
            const timeScaleWidth = chart.timeScale().width()
            const priceScaleWidth = chart.priceScale('left').width()
            const halfTooltipWidth = toolTipWidth / 2
            left += priceScaleWidth - halfTooltipWidth
            left = Math.min(
              left,
              priceScaleWidth + timeScaleWidth - toolTipWidth
            )
            left = Math.max(left, priceScaleWidth)
            const y = param.point.y
            let top = y + toolTipMargin
            if (top > divRef.current!.clientHeight - toolTipHeight) {
              top = y - toolTipHeight - toolTipMargin
            }
            if (top >= 240) {
              top = top - 50
            }
            if (top < 0) top = 0
            toolTip.style.left = left + 'px'
            toolTip.style.top = top + 'px'
          }
        })

        const handleResize = () => {
          chart.applyOptions({ width: divRef.current!.clientWidth })
        }

        window.addEventListener('resize', handleResize)

        chart.timeScale().fitContent()

        chartRef.current = chart

        return () => {
          window.removeEventListener('resize', handleResize)

          chart.remove()
        }
      }
    }
  }, [chartRef, indexData, chartLegend, height, width, id])
  return (
    <>
      <div className="w-full h-full flex mx-auto">
        <div className="relative pt-0 w-full h-fit min-h-[320px] my-auto">
          {isLoadingData ? (
            <div className="z-10 absolute top-0 w-full h-full rounded-xl">
              <div className="flex w-full h-full justify-center items-center tracking-widest font-bold">
                <AstraLoading isLoading={true}></AstraLoading>
              </div>
            </div>
          ) : null}
          <div className="flex flex-col-reverse">
            {isCard || (
              <div className="flex items-center my-2 flex-wrap px-1 justify-center ">
                <div className="cursor-pointer flex items-center">
                  <button
                    onClick={() => {
                      const temp: boolean = !chartLegend.total
                      setChartLegend({ ...chartLegend, total: temp })
                    }}
                  >
                    <span className="rounded-[50%] h-[10px] w-[10px] mr-1 inline-block bg-[#FBFC76]"></span>
                    <span>Total Crypto ROI</span>
                  </button>
                </div>
                <div className="mx-2 cursor-pointer flex items-center">
                  <button
                    onClick={() => {
                      const temp: boolean = !chartLegend.eth
                      setChartLegend({ ...chartLegend, eth: temp })
                    }}
                  >
                    <span className="rounded-[50%] h-[10px] w-[10px] mr-1 inline-block bg-[#04d4ec]"></span>
                    <span>ETH ROI</span>
                  </button>
                </div>
                <div className="cursor-pointer flex items-center">
                  <button
                    onClick={() => {
                      const temp: boolean = !chartLegend.index
                      setChartLegend({ ...chartLegend, index: temp })
                    }}
                  >
                    <span className="rounded-[50%] h-[10px] w-[10px] mr-1 inline-block bg-[#00FF85]"></span>
                    <span>Index ROI</span>
                  </button>
                </div>
                {/* <div className="cursor-pointer flex items-center">
                  <button
                    onClick={() => {
                      const temp: boolean = !chartLegend.tvl
                      setChartLegend({ ...chartLegend, tvl: temp })
                    }}
                  >
                    <span className="rounded-[50%] h-[10px] w-[10px] mr-1 inline-block bg-[#7536E8]"></span>
                    <span>TVL</span>
                  </button>
                </div> */}
              </div>
            )}
            <div ref={divRef} id={id} className="w-full relative"></div>
          </div>
        </div>
      </div>
      {isEmpty(min) ||
        isEmpty(max) ||
        (isEmpty(indexData) && (
          <div className="z-10 absolute top-0 w-full h-full bg-black/30 backdrop-blur-md">
            <div className="flex w-full h-full justify-center items-center tracking-widest font-bold">
              <AstraLoading isLoading={isLoadingData}>COMING SOON</AstraLoading>
            </div>
          </div>
        ))}
    </>
  )
}
