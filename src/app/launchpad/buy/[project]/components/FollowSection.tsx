'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, Button } from '@/components/shadcn'
import { AstraLink, AstraLoading } from '@/components'
import { MiniIdenticon } from '@/components/mini-identicon'
import { CheckIcon, ResetIcon, PersonIcon } from '@radix-ui/react-icons'
import { TLaunchpadDetailInfo } from '@/types'
import { formatUnits } from 'viem'
import { useDecimals, useFollowCheck } from '@/hooks'
import { useAccount } from 'wagmi'
import { followTwitter } from '@/util/followTwitter'
import { serialize } from 'cookie-es'

type Props = {
  detail: TLaunchpadDetailInfo
  buyRuleStatus: any
  buyRuleStatusLoading: boolean
  launchpadData: any
  launchpadLoading: boolean
}

export default function FollowSection({
  detail,
  buyRuleStatus,
  buyRuleStatusLoading,
  launchpadData,
  launchpadLoading,
}: Props) {
  const { address } = useAccount()
  const [twitterFollowInprogress, setTwitterFollowInprogress] = useState(false)
  const [twitterCheckStarted, setTwitterCheckStarted] = useState(false)

  const followingTemp = useFollowCheck(address)
  const followingData = followingTemp.data
  const follwingDataLoading = followingTemp.isLoading
  const telegramfollowing: boolean =
    followingData?.[0]?.IS_TELEGRAM_FOLLOWING || false
  const twitterfollowing: boolean =
    followingData?.[0]?.IS_TWITTER_FOLLOWING || false

  const isLoading =
    buyRuleStatusLoading || launchpadLoading || follwingDataLoading

  const { data: baseTokenDecimals, isLoading: baseTokenDecimalsLoading } =
    useDecimals({
      address: detail?.BASE_TOKEN as `0x${string}`,
      enabled: !!detail,
    })
  const handleFollowTwitter = async (confirm: boolean = false) => {
    if (
      !!address &&
      /^0x[a-fA-F0-9]{40}$/.test(address) &&
      !twitterFollowInprogress
    ) {
      setTwitterFollowInprogress(true)
      try {
        if (!confirm) {
          const twitterApi = await (
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/twitter/login`, {
              method: 'POST',
            })
          ).json()
          document.cookie = serialize('comebackAt', window.location.href, {
            sameSite: 'none',
            path: '/apicallback_',
            secure: true,
          })

          window.open(twitterApi.url, '_blank')
          // location.href = twitterApi.url
        } else {
          const res = await followTwitter(address)
          if (res.ok) {
            // Handle successful response
            followingTemp.refetchData()
          } else {
            // Handle unsuccessful response
            console.error('Failed to follow Twitter account:', res.statusText)
          }
        }
      } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error following Twitter account:', error)
      } finally {
        // Always set the in-progress state to false when done
        setTwitterFollowInprogress(false)
        if (confirm) {
          location.href = location.pathname
        }
      }
    }
  }
  useEffect(() => {
    if (location.href.includes('?twitter_confirm') && !twitterCheckStarted) {
      setTwitterCheckStarted(true)
      handleFollowTwitter(true)
    }
  }, [twitterCheckStarted])

  return (
    <Card className="w-full relative border-0 col-span-1 rounded-3xl bg-[#363653] shadow-xl p-10">
      <CardContent className="p-0 flex flex-row items-center">
        <div className="self-stretch w-1/2 flex justify-between gap-8 pr-8 border-[#FFFFFF21] border-r-2 border-solid">
          <div className="relative h-32 w-32">
            <MiniIdenticon seed="ddd" image={detail?.PROJECT_IMAGE} />
          </div>
          <div className="flex grow basis-[0%] flex-col items-stretch">
            <div className="text-white text-3xl tracking-[2px]">
              Participate in {detail?.LAUNCHPAD_TOKEN_SYMBOL} token sale
            </div>
            <div className="h-0.5 my-4 bg-[#FFFFFF21]"></div>
            <div className="text-white text-sm">
              <div className="flex items-center">
                <span>Number of participants:</span>
                &nbsp;
                <AstraLoading isLoading={isLoading} className="w-4 h-4">
                  <span className="text-astra-blue ">
                    {(launchpadData &&
                      Number(launchpadData?.[6]?.result).toLocaleString(
                        'en-US'
                      )) ||
                      0}{' '}
                    participants
                  </span>
                </AstraLoading>
              </div>
              <div className="flex items-center">
                <span>Total Assets Connected:</span>&nbsp;
                <AstraLoading isLoading={isLoading} className="w-4 h-4">
                  <span className="text-astra-blue">
                    ${' '}
                    {(launchpadData &&
                      Number(
                        formatUnits(
                          launchpadData?.[7]?.result ?? 0,
                          baseTokenDecimals ?? 0
                        )
                      ).toLocaleString('en-US')) ||
                      0}
                  </span>
                </AstraLoading>
              </div>
            </div>
            <a href="#" aria-label="View">
              {buyRuleStatus &&
              buyRuleStatus?.[0]?.result &&
              // buyRuleStatus?.[1]?.result?.[0] > 0 &&
              telegramfollowing ? (
                <Button
                  variant="astra-blue"
                  className="py-2 mt-4 rounded w-[150px]"
                >
                  <span className="text-base">ELIGIBLE</span>
                </Button>
              ) : (
                <Button
                  variant="astra-blue"
                  className="py-2 !px-2 mt-4 bg-[#292944] text-[#66667A] rounded w-[200px]"
                  disabled
                >
                  <span className="text-base">NOT ELIGIBLE</span>
                </Button>
              )}
            </a>
          </div>
        </div>
        <div className="w-1/2 pl-8">
          <div className="text-sm">
            In order to Participate in this public sale you need to
          </div>

          <div className="flex flex-col gap-4 mt-8">
            {twitterfollowing ? (
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
                    {address ? (
                      <AstraLoading
                        isLoading={follwingDataLoading}
                        className="w-6 h-6"
                      >
                        {twitterfollowing ? (
                          <CheckIcon className="w-8 h-8 text-astra-blue" />
                        ) : (
                          <ResetIcon className="w-8 h-8" />
                        )}
                      </AstraLoading>
                    ) : (
                      <ResetIcon className="w-8 h-8" />
                    )}
                  </div>
                </div>
              </AstraLink>
            ) : (
              <div
                className={`text-white flex gap-4 rounded-xl h-full items-center p-4 bg-[#454561] ${
                  twitterfollowing ? '' : 'border border-white cursor-pointer'
                } justify-between`}
                onClick={() => handleFollowTwitter(false)}
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
                  {address ? (
                    <AstraLoading
                      isLoading={twitterFollowInprogress}
                      className="w-6 h-6"
                    >
                      {twitterfollowing ? (
                        <CheckIcon className="w-8 h-8 text-astra-blue" />
                      ) : (
                        <PersonIcon className="w-8 h-8" />
                      )}
                    </AstraLoading>
                  ) : (
                    <ResetIcon className="w-8 h-8" />
                  )}
                </div>
              </div>
            )}
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
                  {address ? (
                    <AstraLoading isLoading={isLoading} className="w-6 h-6">
                      {telegramfollowing ? (
                        <CheckIcon className="w-8 h-8 text-astra-blue" />
                      ) : (
                        <ResetIcon className="w-8 h-8" />
                      )}
                    </AstraLoading>
                  ) : (
                    <ResetIcon className="w-8 h-8" />
                  )}
                </div>
              </div>
            </AstraLink>
            {/* <div className="flex gap-4 rounded-xl items-center p-4 bg-[#454561] justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-4">
                  <Image
                    alt="twitter"
                    className="!relative"
                    src="/svgs/twitter_blue.svg"
                    fill={true}
                  />
                </div>
                Follow launch pad project (ETH) on Twitter.
              </div>
              <ResetIcon className="w-8 h-8" />
            </div>
            <div className="flex gap-4 rounded-xl items-center p-4 bg-[#454561] justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-4">
                  <Image
                    alt="talegram"
                    className="!relative"
                    src="/svgs/telegram_blue.svg"
                    fill={true}
                  />
                </div>
                Follow launch pad project (ETH) on Telegram.
              </div>
              <AstraLoading isLoading={follwingDataLoading} className="w-6 h-6">
                {telegramfollowing ? (
                  <CheckIcon className="w-8 h-8 text-astra-blue" />
                ) : (
                  <ResetIcon className="w-8 h-8" />
                )}
              </AstraLoading>
            </div> */}
            <AstraLink link="/staking/astra">
              <div
                className={`text-white flex gap-4 rounded-xl h-full items-center p-4 bg-[#454561] justify-between ${
                  buyRuleStatus && buyRuleStatus?.[1]?.result?.[0] > 0
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
                  {`Increase your token sale allocation by staking $ASTRADAO in a lockup vault.`}
                </div>
                <div>
                  {address ? (
                    <AstraLoading isLoading={isLoading} className="w-6 h-6">
                      {buyRuleStatus && buyRuleStatus?.[1]?.result?.[0] > 0 ? (
                        <CheckIcon className="w-8 h-8 text-astra-blue" />
                      ) : (
                        <ResetIcon className="w-8 h-8" />
                      )}
                    </AstraLoading>
                  ) : (
                    <ResetIcon className="w-8 h-8" />
                  )}
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
                  {address ? (
                    <AstraLoading isLoading={isLoading} className="w-6 h-6">
                      {buyRuleStatus && buyRuleStatus?.[0]?.result ? (
                        <CheckIcon className="w-8 h-8 text-astra-blue" />
                      ) : (
                        <ResetIcon className="w-8 h-8 text-white" />
                      )}
                    </AstraLoading>
                  ) : (
                    <ResetIcon className="w-8 h-8" />
                  )}
                </div>
              </div>
            </AstraLink>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
