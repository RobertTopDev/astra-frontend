import { InfoCircledIcon } from '@radix-ui/react-icons'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { TLaunchpadDetailInfo } from '@/types'
import { differenceInSeconds } from 'date-fns'
import { ClockIcon } from '@radix-ui/react-icons'
import { AstraLink, AstraLoading } from '@/components'
import Image from 'next/image'
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons'
import { useFollowCheck, useGetBuyRuleLaunchpad } from '@/hooks'
import { useAccount } from 'wagmi'

type TComponent = {
  launchpadData: TLaunchpadDetailInfo
}

export default function Offering({ launchpadData }: TComponent) {
  const router = useRouter()
  const pathname = usePathname()
  const { address } = useAccount()

  const launchpadId = pathname.split('detail/')[1]
  // const isAdmin = pathname.includes('owner') || pathname.includes('admin')

  const [remainingTime, setRemainingTime] = useState('00:00:00')
  const [saleStartsIn, setSaleStartsIn] = useState('00:00:00')

  const pad = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  const followingTemp = useFollowCheck(address)
  const followingData = followingTemp.data
  const follwingDataLoading = followingTemp.isLoading
  const telegramfollowing: boolean =
    followingData?.[0]?.IS_TELEGRAM_FOLLOWING || false
  const twitterfollowing: boolean = false

  const { data: buyRuleStatus, isLoading: buyRuleStatusLoading } =
    useGetBuyRuleLaunchpad()
  const isLoading = buyRuleStatusLoading || follwingDataLoading

  useEffect(() => {
    let intervalEndId: NodeJS.Timeout
    let intervalStartId: NodeJS.Timeout
    if (launchpadData?.SALE_END_TIME) {
      const updateRemainingTime = () => {
        const endTime = new Date(launchpadData.SALE_END_TIME + 'Z')
        const currentTime = new Date()

        const difference = differenceInSeconds(endTime, currentTime)

        if (difference > 0) {
          const hours = Math.floor(difference / (60 * 60))
          const minutes = Math.floor((difference % (60 * 60)) / 60)
          const seconds = difference % 60
          setRemainingTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
        } else {
          clearInterval(intervalEndId)
          setRemainingTime('00:00:00')
          return
        }
      }

      const updateSaleStartsIn = () => {
        const startTime = new Date(launchpadData.SALE_START_TIME + 'Z')
        const currentTime = new Date()

        const difference = differenceInSeconds(startTime, currentTime)

        if (difference > 0) {
          const hours = Math.floor(difference / (60 * 60))
          const minutes = Math.floor((difference % (60 * 60)) / 60)
          const seconds = difference % 60
          setSaleStartsIn(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
        } else {
          clearInterval(intervalStartId)
          setSaleStartsIn('00:00:00')
          return
        }
      }

      updateRemainingTime()
      updateSaleStartsIn()

      intervalEndId = setInterval(updateRemainingTime, 1000)
      intervalStartId = setInterval(updateSaleStartsIn, 1000)
    }
  }, [launchpadData])

  return (
    <div className="flex flex-col gap-4">
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex justify-between">
          {`${launchpadData?.LAUNCHPAD_TOKEN_SYMBOL} Public Sale`}
          {saleStartsIn === '00:00:00' ? ' ends in' : ' coming up soon'}:
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ClockIcon />
            <div className="text-2xl ml-2">
              {saleStartsIn === '00:00:00' ? remainingTime : saleStartsIn}
            </div>
          </div>
          {launchpadData?.STATUS === 'requested' ||
          saleStartsIn !== '00:00:00' ? (
            <div className="text-black text-center rounded-xl px-8 py-2 bg-astra-blue bg-opacity-15">
              Participate
            </div>
          ) : (
            <div
              className="text-black text-center rounded-xl cursor-pointer px-8 py-2 bg-gradient-to-r from-[#00E7FF] to-[#28E7FD] border-astra-blue bg-opacity-15"
              onClick={() => router.push(`/launchpad/buy/${launchpadId}`)}
            >
              {remainingTime === '00:00:00' ? 'Finished' : 'Participate'}
            </div>
          )}
          {/* <div
            className="text-black text-center rounded-xl cursor-pointer px-8 py-2 bg-gradient-to-r from-[#00E7FF] to-[#28E7FD] border-astra-blue bg-opacity-15"
            onClick={() => router.push(`/launchpad/buy/${launchpadId}`)}
          >
            {remainingTime === '00:00:00:00' ? 'Finished' : 'Participate'}
          </div> */}
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div>
          <div className="text-sm">
            In order to Participate in this public sale you need to
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <AstraLink link="https://twitter.com/astradao_org">
              <div
                className={`text-white flex gap-4 rounded-xl h-full items-center p-4 bg-[#454561] ${
                  twitterfollowing ? '' : 'border border-white'
                } justify-between`}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 mr-4">
                    <Image
                      alt="twitter"
                      className="!relative"
                      src="/svgs/twitter_blue.svg"
                      style={{ fill: '#56A8EA' }}
                      fill={true}
                    />
                  </div>
                  User needs to follow Astra DAO on Twitter.
                </div>
                <div>
                  <ResetIcon className="w-8 h-8" />
                </div>
              </div>
            </AstraLink>
            <AstraLink link="https://t.me/testAstraDaoGroup">
              <div
                className={`text-white flex gap-4 rounded-xl h-full items-center p-4 bg-[#454561] ${
                  telegramfollowing ? '' : 'border border-white'
                } justify-between`}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 mr-4">
                    <Image
                      alt="telegram"
                      className="!relative"
                      src="/svgs/telegram_blue.svg"
                      fill={true}
                    />
                  </div>
                  User needs to follow Astra DAO on Telegram.
                </div>
                <div>
                  <AstraLoading
                    isLoading={follwingDataLoading}
                    className="w-6 h-6"
                  >
                    {telegramfollowing ? (
                      <CheckIcon className="w-8 h-8 text-astra-blue" />
                    ) : (
                      <ResetIcon className="w-8 h-8" />
                    )}
                  </AstraLoading>
                </div>
              </div>
            </AstraLink>
            <AstraLink link="/staking/astra">
              <div
                className={`text-white flex gap-4 rounded-xl h-full items-center p-4 bg-[#454561] justify-between ${
                  buyRuleStatus &&
                  buyRuleStatus !== undefined &&
                  buyRuleStatus.length > 0 &&
                  buyRuleStatus[1].result &&
                  buyRuleStatus[1]?.result?.[0] > 0
                    ? ''
                    : 'border border-white'
                }`}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 mr-4">
                    <Image
                      alt="twitter"
                      className="!relative"
                      src="/svgs/astra_blue.svg"
                      fill={true}
                    />
                  </div>
                  {`Increase your token sale allocation by staking ${launchpadData?.LAUNCHPAD_TOKEN_SYMBOL} in a lockup vault.`}
                </div>
                <div>
                  <AstraLoading isLoading={isLoading} className="w-6 h-6">
                    {buyRuleStatus &&
                    buyRuleStatus !== undefined &&
                    buyRuleStatus.length > 0 &&
                    buyRuleStatus[1].result &&
                    buyRuleStatus[1]?.result?.[0] > 0 ? (
                      <CheckIcon className="w-8 h-8 text-astra-blue" />
                    ) : (
                      <ResetIcon className="w-8 h-8" />
                    )}
                  </AstraLoading>
                </div>
              </div>
            </AstraLink>
            <AstraLink link="/launchpad/kyc">
              <div
                className={`text-white flex gap-4 rounded-xl h-full items-center p-4 bg-[#454561] justify-between ${
                  buyRuleStatus && buyRuleStatus?.[0]?.result
                    ? ''
                    : 'border border-white'
                }`}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 mr-4">
                    <Image
                      alt="twitter"
                      className="!relative object-contain"
                      // src="/svgs/document.svg"
                      src="/svgs/purefi.png"
                      fill={true}
                    />
                  </div>
                  User needs to complete PureFi KYC.
                </div>
                <div>
                  <AstraLoading isLoading={isLoading} className="w-6 h-6">
                    {buyRuleStatus && buyRuleStatus?.[0]?.result ? (
                      <CheckIcon className="w-8 h-8 min-w-8 max-w-8 text-astra-blue" />
                    ) : (
                      <ResetIcon className="w-8 h-8 text-white" />
                    )}
                  </AstraLoading>
                </div>
              </div>
            </AstraLink>
          </div>
        </div>
      </div>
    </div>
  )
}
