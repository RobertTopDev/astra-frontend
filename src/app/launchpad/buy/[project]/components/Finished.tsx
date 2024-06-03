'use client'

import { TLaunchpadDetailInfo } from '@/types'
import TokenDistributeChart from '../../../chart/'

type TProgress = {
  data: TLaunchpadDetailInfo
}

export default function Finished({ data }: TProgress) {
  console.log(data)

  return (
    <>
      <div className="md:p-10 p-5 rounded-3xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl relative">
        <div className="flex lg:flex-row flex-col items-center lg:gap-12 gap-6">
          <div className="w-[200px] h-[200px] min-w-[200px] p-2 border border-white rounded-full flex items-center justify-center">
            <img
              className="w-full"
              src="/images/launchpad/hooked.png"
              alt="img"
            />
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
            <div className="text-2xl text-white font-bold uppercase py-2">
              Hooked Protocol
            </div>
            <div className="flex md:flex-row flex-col md:items-center justify-between">
              <div className="text-md text-white font-thin">
                A web3 Gameified social learning platform
              </div>
              <div className="flex gap-1 md:pt-0 pt-2">
                <img src="/images/launchpad/calendar.svg" alt="img" />
                <span>End Time: 01/12/2022</span>
              </div>
            </div>
            <div className="bg-[#FFFFFF33] my-6 h-px"></div>
            <div className="flex flex-wrap md:flex-row items-center gap-4">
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
                HOOK Research Report
              </span>
              <span className="bg-[#1ADDA320] text-[#1ADDA3] text-xs font-medium inline-flex items-center p-2.5 rounded-md">
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
              </span>
            </div>
          </div>
        </div>
        <div className="header-bottom">
          <div className="bg-[#FFFFFF33] my-6 h-px"></div>
          <div className="project-detail flex flex-col md:flex-row justify-between items-center font-thin">
            <div className="md:text-left text-center">
              <p>Sale Price</p>
              <p>1 HOOK = 0.0003381 BNB</p>
            </div>
            <div className="bg-[#FFFFFF33] mx-1 md:h-16 h-8 w-px"></div>
            <div className="md:text-left text-center">
              <p>Tokens Offered</p>
              <p>25,000,000.0000 HOOK</p>
            </div>
            <div className="bg-[#FFFFFF33] mx-1 md:h-16 h-8 w-px"></div>
            <div className="md:text-left text-center">
              <p>Single Initial Investment</p>
              <p>0.1 BNB</p>
            </div>
            <div className="bg-[#FFFFFF33] mx-1 md:h-16 h-8 w-px"></div>
            <div className="md:text-left text-center">
              <p>Hard cap per user</p>
              <p>150000 HOOK = 50.7149 BNB (= 10889 USD)</p>
            </div>
          </div>
          <div className="bg-[#FFFFFF33] my-6 h-px"></div>
        </div>
      </div>

      <div className="chart-section mt-16">
        <div className="flex items-center gap-4">
          <img
            className="w-14 h-14"
            src="/images/launchpad/lead-vc.png"
            alt="img"
          />
          <div className="">
            <div className="text-2xl text-white font-bold">
              Final Token Distribution
            </div>
            <div className="text-md text-white font-thin">
              01/12/2022 | 12:00
            </div>
          </div>
        </div>
        <div className="pt-2">
          The allocation calculation is complete. We will deduct the
          corresponding BNB from your account based on your final HOOK
          allocation, which will be transferred to your spot account along with
          your remaingin BNB
        </div>
        <div className="mt-10">
          <TokenDistributeChart isTitle={false} xSymbol={[]} />
        </div>
      </div>

      <div className="description pt-14 pb-56">
        <div className="text-lg text-white font-bold">
          Hooked Protocol - A Web3 Gamified Social Learning Platform
        </div>
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 lg:divide-x lg:divide-gray-500 pt-10">
          <div className="col-span-2">
            <div className="text-md font-bold pb-3">Project Introduction</div>
            <p className="font-thin pb-5">
              Hokked Protocol is building the on-ramp layer for massive Web3
              adoption, providing tailored learn & Earn products and onboarding
              infrastructures for users & businesses to enter the new world of
              web3.
            </p>
            <p className="font-thin pb-5">
              Its first pilot product. wild cash with quiz-to-earn experience
              and other gamified learning features, achieved an impressive
              growth of over 2 milion month monthly active users.
            </p>
            <p className="font-thin pb-8">
              Hooked Protocol adopts an innovative single token (HOOK) oriented
              structure, supplemented with in-ecosystem only utility token HGT
              (Hooked Gold Token). HOOK is the governance of the ecosystem
            </p>
            <div className="text-md font-bold pb-8">
              Key Features and Highlights
            </div>
            <div className="text-md font-bold pb-2">
              Hooked Protocol Token Sale and Economics
            </div>
            <div className="rounded-xl p-[1px] bg-gradient-to-b from-transparent to-gray-400">
              <div className="p-8 rounded-[calc(0.75rem-1px)] bg-gradient-to-r from-[#51547597] to-[#51547599]">
                <div className="grid grid-cols-2 gap-4 text-sm md:text-md">
                  <div className="p-3 text-gray-400 text-right bg-[#292944] rounded-md">
                    Hard Cap
                  </div>
                  <div className="p-3 text-white text-left bg-[#292944] rounded-md">
                    2500000 USD
                  </div>
                  <div className="p-3 text-gray-400 text-right bg-[#292944] rounded-md">
                    Total Token Supply
                  </div>
                  <div className="p-3 text-white text-left bg-[#292944] rounded-md">
                    500000000 HOOK
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:pl-8">
            <div className="text-md font-bold pb-5">Social Channels</div>
            <div className="pb-2">
              <span className="min-w-[270px] bg-[#56A8EA20] text-white text-xs font-medium inline-flex items-center p-2.5 rounded-md">
                <img
                  src="/images/launchpad/twitter.svg"
                  className="me-2"
                  alt="img"
                />
                <span className="underline">
                  https://twitter.com/hookedprotocol
                </span>
              </span>
            </div>
            <div className="pb-2">
              <span className="min-w-[270px] bg-[#5865F226] text-white text-xs font-medium inline-flex items-center p-2.5 rounded-md">
                <img
                  src="/images/launchpad/discord.svg"
                  className="me-2"
                  alt="img"
                />
                <span className="underline">https://discord.gg/2aWBxMKRFf</span>
              </span>
            </div>
            <div className="w-full">
              <span className="min-w-[270px] bg-[#32A8DA20] text-white text-xs font-medium inline-flex items-center p-2.5 rounded-md">
                <img
                  src="/images/launchpad/telegram.svg"
                  className="me-2"
                  alt="img"
                />
                <span className="underline">
                  https://t.me/HookedProtocolOfficial
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
