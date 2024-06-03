import Link from 'next/link'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import { Progress, Card, CardHeader } from '@/components/shadcn'
import { ClockIcon, HeartIcon, BellIcon } from '@radix-ui/react-icons'
import { MiniIdenticon } from '@/components/mini-identicon'
import { TLaunchpadDetailInfo } from '@/types'

type Props = {
  status: string
  launchpadData?: TLaunchpadDetailInfo
}
export default function LiveUpcomingCard({ status, launchpadData }: Props) {
  const [remainingTime, setRemainingTime] = useState('00:00:00:00')
  const [saleStartsIn, setSaleStartsIn] = useState('00:00:00:00')

  useEffect(() => {
    let intervalEndId: NodeJS.Timeout
    let intervalStartId: NodeJS.Timeout
    if (launchpadData?.SALE_END_TIME) {
      const updateRemainingTime = () => {
        const endTime = new Date(launchpadData.SALE_END_TIME)
        const currentTime = new Date()

        const difference = differenceInSeconds(endTime, currentTime)

        if (difference > 0) {
          const days = Math.floor(difference / (60 * 60 * 24))
          const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60))
          const minutes = Math.floor((difference % (60 * 60)) / 60)
          const seconds = difference % 60
          setRemainingTime(
            `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
          )
        } else {
          clearInterval(intervalEndId)
          setRemainingTime('00:00:00:00')
          return
        }
      }

      const updateSaleStartsIn = () => {
        const startTime = new Date(launchpadData.SALE_START_TIME)
        const currentTime = new Date()

        const difference = differenceInSeconds(startTime, currentTime)

        if (difference > 0) {
          const days = Math.floor(difference / (60 * 60 * 24))
          const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60))
          const minutes = Math.floor((difference % (60 * 60)) / 60)
          const seconds = difference % 60
          setSaleStartsIn(
            `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
          )
        } else {
          clearInterval(intervalStartId)
          setSaleStartsIn('00:00:00:00')
          return
        }
      }

      updateRemainingTime()
      updateSaleStartsIn()

      intervalEndId = setInterval(updateRemainingTime, 1000)
      intervalStartId = setInterval(updateSaleStartsIn, 1000)
    }
  }, [launchpadData])

  const pad = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  return (
    <div className="stroke-[1px] stroke-white stroke-opacity-0 overflow-hidden relative flex max-w-[400px] md:max-w-[500px] items-stretch w-full m-auto">
      <Card className="relative rounded-3xl w-full bg-[#B2C4E833] p-px border-none">
        <CardHeader className="rounded-3xl bg-[#000000] bg-opacity-30">
          <div className="flex justify-between items-center pb-2">
            <div className="text-black text-center text-xs font-medium whitespace-nowrap bg-[#43D9A7] justify-center items-stretch px-6 py-2 rounded-3xl">
              Sale Live
            </div>
            <div className="flex gap-2">
              <div className="text-xs bg-astra-blue rounded-xl text-astra-blue bg-opacity-15 px-3 py-1">
                Audit
              </div>
              <div className="text-xs bg-[#10B93F40] rounded-xl text-[#10B93F] bg-opacity-25 px-3 py-1">
                KYC
              </div>
            </div>
          </div>
          <div className="relative self-stretch flex items-stretch justify-between gap-3.5 mt-6">
            <div className="relative h-14 w-14">
              <MiniIdenticon seed="ddd" />
            </div>
            <div
              className="self-center flex grow basis-[0%] flex-col items-stretch my-auto "
              style={{ width: 'calc(100% - 70px)' }}
            >
              <div
                className="text-white text-xl font-black tracking-[2px]"
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {launchpadData?.LAUNCHPAD_TOKEN_NAME}
              </div>
              <div className="text-white text-sm mt-3.5">
                1 USDC ={' '}
                {launchpadData?.LAUNCHPAD_TOKEN_PRICE +
                  ' ' +
                  launchpadData?.LAUNCHPAD_TOKEN_SYMBOL}
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="relative flex w-full flex-col items-stretch p-6">
          <div className="text-white text-sm font-black">Soft/Hard</div>
          <div className="text-astra-blue text-xl tracking-[2px] mt-2">
            {launchpadData?.SOFT_CAP ? launchpadData.SOFT_CAP : 0} USDC -{' '}
            {launchpadData?.HARD_CAP ? launchpadData.HARD_CAP : 0} USDC
          </div>
          <div className="text-white text-sm mt-6">
            Progress (
            {(
              (launchpadData?.TOTAL_SALE_AMOUNT &&
              launchpadData?.TOTAL_SALE_AMOUNT
                ? launchpadData?.TOTAL_SALE_AMOUNT /
                  launchpadData?.TOTAL_SALE_AMOUNT
                : 0) * 100
            ).toFixed(2)}
            %)
          </div>

          <Progress
            value={
              (launchpadData?.TOTAL_SALE_AMOUNT &&
              launchpadData?.TOTAL_SALE_AMOUNT
                ? launchpadData?.TOTAL_SALE_AMOUNT /
                  launchpadData?.TOTAL_SALE_AMOUNT
                : 0) * 100
            }
            className="mt-2"
          />

          <div className="flex items-stretch justify-between mt-2.5">
            <div className="text-white text-sm font-black">
              {launchpadData?.SOFT_CAP ? launchpadData.SOFT_CAP : 0} USDC
            </div>
            <div className="text-white text-right text-sm font-black">
              {launchpadData?.HARD_CAP ? launchpadData.HARD_CAP : 0} USDC
            </div>
          </div>

          <div className="bg-white shrink-0 h-px mt-5 bg-opacity-30" />

          <div className="flex w-full flex-wrap items-stretch justify-between mt-6">
            <div className="flex flex-col items-stretch">
              <div className="text-white text-sm font-medium">
                {saleStartsIn === '00:00:00:00'
                  ? 'Sale Ends In'
                  : 'Sale Starts In'}
                :
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="text-astra-blue">
                  <ClockIcon />
                </div>
                <div className="text-white text-lg font-semibold tracking-widest grow whitespace-nowrap">
                  {saleStartsIn === '00:00:00:00'
                    ? remainingTime
                    : saleStartsIn}
                </div>
              </div>
            </div>

            <div className="flex items-stretch gap-2.5 mt-1 self-start">
              <a href="#" aria-label="View">
                <div className="bg-white justify-center items-stretch p-3 rounded-3xl">
                  <BellIcon className="stroke-[#7573BC]" />
                </div>
              </a>
              <a href="#" aria-label="View">
                <div className="bg-white justify-center items-stretch p-3 rounded-3xl">
                  <HeartIcon className="stroke-[#7573BC]" />
                </div>
              </a>
              <Link
                href={`/launchpad/detail/${launchpadData?.LAUNCHPAD_INDEX}`}
              >
                <div className="text-black text-center text-xs font-medium whitespace-nowrap bg-astra-blue justify-center items-stretch px-6 py-3 rounded-3xl">
                  View
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Card>
      {status === 'requested' && (
        <div className="bg-black rounded-3xl bg-opacity-80 z-20 absolute w-full h-full flex justify-center items-center">
          <p className="text-xl text-center">Coming Soon</p>
        </div>
      )}
    </div>
  )
}
