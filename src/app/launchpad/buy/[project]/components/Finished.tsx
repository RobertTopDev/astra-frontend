'use client'

import Link from 'next/link'
import { TLaunchpadDetailInfo, TLogoLink } from '@/types'
import { ClaimStatistics } from '@/app/launchpad/user/sections/claim-statistics'
import { differenceInSeconds, format } from 'date-fns'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn'
import { useMemo, useState } from 'react'
import {
  useChainConfig,
  useDecimals,
  useFinishLaunchpad,
  useLaunchpadInfo,
} from '@/hooks'
import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import ProjectDetail from '@/app/launchpad/detail/[project]/components/ProjectDetail'
import TeamPartner from '@/app/launchpad/detail/[project]/components/TeamPartner'
import Metrics from '@/app/launchpad/detail/[project]/components/Metrics'
import { LogoLink } from '@/app/launchpad/detail/[project]/components/Overview'
import LiveUpcoming from '@/app/launchpad/(page)/components/LiveUpcoming'
import { MiniIdenticon } from '@/components/mini-identicon'

type TProgress = {
  data: TLaunchpadDetailInfo
  launchpadLoading: boolean
}

export default function Finished({ data, launchpadLoading }: TProgress) {
  const { address } = useAccount()
  const [open, setOpen] = useState<boolean>(false)
  const { chainConfig } = useChainConfig()

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
  const baseTokenSymbol = tokenArray
    .filter((token) => token.address === data?.BASE_TOKEN)
    .map((token) => token.symbol)

  const socialLinks: TLogoLink[] = [
    {
      alt: 'Twitter Logo',
      logoUrl: '/svgs/twitter.svg',
      redirectUrl: data?.TWITTER || '#',
      background: 'bg-[#56a8ea]',
    },
    {
      alt: 'Git Logo',
      logoUrl: '/svgs/github.svg',
      redirectUrl: data?.GITHUB || '#',
      background: 'bg-[#d9d9d9]',
    },
    {
      alt: 'Telegram Logo',
      logoUrl: '/svgs/telegram.svg',
      redirectUrl: data?.TELEGRAM.startsWith('@')
        ? data?.TELEGRAM.replace('@', 'https://t.me/')
        : data?.TELEGRAM || '#',
      background: 'bg-[#56a8ea]',
    },
  ]
  if (data?.DISCORD) {
    socialLinks.push({
      alt: 'Discord Logo',
      logoUrl: '/svgs/discord.svg',
      redirectUrl: data?.DISCORD || '#',
      background: 'bg-astra-orange',
    })
  }
  if (data?.MEDIUM) {
    socialLinks.push({
      alt: 'Medium Logo',
      logoUrl: '/images/medium-logo.png',
      redirectUrl: data?.MEDIUM || '#',
      background: 'bg-[#f6832e]',
    })
  }

  const isLaunchpadFinished = useMemo(() => {
    const endTime = data.SALE_END_TIME
      ? new Date(data.SALE_END_TIME + 'Z')
      : null
    const currentTime = new Date()
    const difference = endTime ? differenceInSeconds(endTime, currentTime) : 0
    if (difference > 0) return false
    else return true
  }, [data])

  const { withdrawBaseToken, isLoading: withdrawBaseTokenLoading } =
    useFinishLaunchpad({
      enabled: !!address && isLaunchpadFinished && !!data.ID,
      address: data.LAUNCHPAD_ADDRESS as `0x${string}`,
      launchpadId: data.ID ?? '',
    })

  const { data: launchpadContractData } = useLaunchpadInfo({
    launchpad: data?.LAUNCHPAD_ADDRESS as `0x${string}`,
  })

  // base token decimals
  const { data: baseTokenDecimals } = useDecimals({
    address: data.BASE_TOKEN as `0x${string}`,
    enabled: !!data,
  })

  const withdrawAmount = useMemo(() => {
    if (launchpadContractData?.[7]?.result === undefined || !baseTokenDecimals)
      return 0
    return Number(
      formatUnits(launchpadContractData?.[7]?.result, baseTokenDecimals)
    )
  }, [launchpadContractData, address])
  const platformFee = useMemo(() => {
    if (launchpadContractData?.[11]?.result === undefined) return 0
    return Number(launchpadContractData?.[11]?.result) / 10
  }, [launchpadContractData, address])
  const receiveAmount = withdrawAmount - withdrawAmount * (platformFee / 100)

  const isOwner = useMemo(() => {
    return data.OWNER === address
  }, [address, data])

  return (
    <>
      <div className="md:p-10 p-5 rounded-3xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl relative">
        {isOwner ? (
          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="px-16" variant="astra-blue">
                  {data.STATUS === 'finished'
                    ? 'Finished'
                    : 'Finish (Withdraw Base Token)'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Base Token</DialogTitle>
                </DialogHeader>
                <div className="content">
                  <div className="flex justify-start gap-4">
                    <div className="min-w-[150px]">Withdraw Amount:</div>
                    <div>
                      {Number(withdrawAmount).toLocaleString('en-US')}{' '}
                      {baseTokenSymbol}
                    </div>
                  </div>
                  <div className="flex justify-start gap-4">
                    <div className="min-w-[150px]">Platform Fee:</div>
                    <div>{platformFee} %</div>
                  </div>
                  <div className="flex justify-start gap-4">
                    <div className="min-w-[150px]">Receive Amount:</div>
                    <div>
                      {Number(receiveAmount).toLocaleString('en-US')}{' '}
                      {baseTokenSymbol}
                    </div>
                  </div>
                </div>
                <div className="footer flex justify-between">
                  <Button
                    className="!px-6 !py-3"
                    variant="astra-blue"
                    disabled={
                      !isLaunchpadFinished ||
                      !withdrawBaseToken ||
                      data?.STATUS === 'finished'
                    }
                    isLoading={withdrawBaseTokenLoading}
                    onClick={() => withdrawBaseToken?.()}
                  >
                    {data.STATUS === 'finished'
                      ? 'Finished'
                      : 'Finish (Withdraw Base Token)'}
                  </Button>
                  <DialogClose>
                    <Button
                      asChild
                      variant="astra-blue"
                      className="!px-6 !py-3"
                    >
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <></>
        )}
        <div className="flex lg:flex-row flex-col items-center lg:gap-12 gap-6">
          <div className="w-[200px] h-[200px] min-w-[200px] p-2 rounded-full flex items-center justify-center">
            <div className="relative h-48 w-48">
              <MiniIdenticon seed="ddd" image={data?.PROJECT_IMAGE} />
            </div>
          </div>
          <div className="project-info w-full">
            <div className="text-md text-white">
              <span className="bg-[#00E7FF20] text-[#00E7FF] text-xs font-medium inline-flex items-center me-2 px-2.5 py-0.5 rounded-md">
                <svg
                  className="w-2.5 h-2.5 me-1.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                </svg>
                Finished
              </span>
            </div>
            <div className="flex justify-between">
              <div className="text-2xl text-white font-bold uppercase py-2">
                {data?.LAUNCHPAD_TOKEN_NAME}
              </div>
              <ul className="gap-2 flex flex-wrap">
                {socialLinks.map((link: TLogoLink) => (
                  <LogoLink link={link} key={link.alt + link.logoUrl} />
                ))}
              </ul>
            </div>
            <div className="flex md:flex-row flex-col md:items-center justify-between">
              <div className="text-md text-white font-thin max-w-[70%]">
                {data?.PROJECT_DETAIL}
              </div>
              <div className="flex gap-1 md:pt-0 pt-2">
                <img src="/images/launchpad/calendar.svg" alt="img" />
                <span>
                  End Time:{' '}
                  {format(
                    new Date(data?.SALE_END_TIME + 'Z'),
                    'yyyy-MM-dd HH:mm'
                  )}
                </span>
              </div>
            </div>
            <div className="bg-[#FFFFFF33] my-6 h-px"></div>
            <div className="flex flex-wrap md:flex-row items-center gap-4">
              <Link href={data?.WEBSITE_URL || ''} target="_blank">
                <span className="bg-[#FFA53020] text-[#FDA81B] text-xs font-medium inline-flex items-center p-2.5 rounded-md">
                  <svg
                    className="w-2.5 h-2.5 me-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                  </svg>
                  Website
                </span>
              </Link>
              <Link href={data?.WHITEPAPER_URL || ''} target="_blank">
                <span className="bg-[#8D6EE720] text-[#CDBDFD] text-xs font-medium inline-flex items-center p-2.5 rounded-md">
                  <svg
                    className="w-2.5 h-2.5 me-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                  </svg>
                  Whitepaper
                </span>
              </Link>
              <Link
                href={
                  chainConfig.networkURL +
                  'token/' +
                  data?.LAUNCHPAD_TOKEN_ADDRESS
                }
                target="_blank"
              >
                <span className="bg-[#1C69F520] text-[#88B1FC] text-xs font-medium inline-flex items-center p-2.5 rounded-md">
                  <svg
                    className="w-2.5 h-2.5 me-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                  </svg>
                  Token Contract Address
                </span>
              </Link>
              {/* <span className="bg-[#1ADDA320] text-[#1ADDA3] text-xs font-medium inline-flex items-center p-2.5 rounded-md">
                <svg
                  className="w-2.5 h-2.5 me-1.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                </svg>
                View detailed rules
              </span>
              <span className="bg-[#00E7FF20] text-[#00E7FF] text-xs font-medium inline-flex items-center p-2.5 rounded-md">
                <svg
                  className="w-2.5 h-2.5 me-1.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                </svg>
                FAQ
              </span> */}
            </div>
          </div>
        </div>
        <div className="header-bottom">
          <div className="bg-[#FFFFFF33] my-6 h-px"></div>
          <div className="project-detail flex flex-col md:flex-row justify-between items-center font-thin">
            <div className="md:text-left text-center">
              <p>Sale Price</p>
              <p>
                1 {data?.LAUNCHPAD_TOKEN_SYMBOL} = {data?.LAUNCHPAD_TOKEN_PRICE}{' '}
                {baseTokenSymbol}
              </p>
            </div>
            <div className="bg-[#FFFFFF33] mx-1 md:h-16 h-8 w-px"></div>
            <div className="md:text-left text-center">
              <p>Tokens Offered</p>
              <p>
                {Number(data?.TOTAL_SALE_AMOUNT).toLocaleString('en-US') +
                  ' ' +
                  data?.LAUNCHPAD_TOKEN_SYMBOL}
              </p>
            </div>
            <div className="bg-[#FFFFFF33] mx-1 md:h-16 h-8 w-px"></div>
            <div className="md:text-left text-center">
              <p>Total Raised Amount</p>
              <p>
                {Number(withdrawAmount).toLocaleString('en-US')}{' '}
                {baseTokenSymbol}
              </p>
            </div>
            <div className="bg-[#FFFFFF33] mx-1 md:h-16 h-8 w-px"></div>
            <div className="md:text-left text-center">
              <p>Hard Cap Per User</p>
              <p>
                {Number(
                  (1 / data?.LAUNCHPAD_TOKEN_PRICE) *
                    data?.MAX_PURCHASE_BASE_AMOUNT
                ).toLocaleString('en-US') +
                  ' ' +
                  data?.LAUNCHPAD_TOKEN_SYMBOL}{' '}
                ={' '}
                {Number(data?.MAX_PURCHASE_BASE_AMOUNT).toLocaleString('en-US')}{' '}
                {baseTokenSymbol}
              </p>
            </div>
          </div>
          <div className="bg-[#FFFFFF33] my-6 h-px"></div>
        </div>
      </div>

      <div className="vesting-table pt-14">
        <ClaimStatistics
          launchpads={[data]}
          launchpadLoading={launchpadLoading}
        />
      </div>

      <div className="project-details pt-14">
        <ProjectDetail
          key="projectDetail"
          data={data as TLaunchpadDetailInfo}
        />
      </div>

      <div className="team-partner pt-14">
        <TeamPartner key="teamPartner" data={data as TLaunchpadDetailInfo} />
      </div>

      <div className="metrics pt-14">
        <Metrics key="metrics" data={data as TLaunchpadDetailInfo} />
      </div>

      <div className="pt-14 pb-56">
        <LiveUpcoming status="coming-soon" />
      </div>
    </>
  )
}
