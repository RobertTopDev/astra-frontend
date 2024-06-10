'use client'

import { useAccount } from 'wagmi'
import LiveUpcoming from '../(page)/components/LiveUpcoming'
import { ClaimStatistics } from './sections/claim-statistics'
import { useGetBuyRuleLaunchpad, useGetParticipatedLaunchpad } from '@/hooks'
import Image from 'next/image'
import { useMemo } from 'react'
import { AstraLink } from '@/components'

export default function ClaimPage() {
  const { address } = useAccount()
  const { data: launchpads, isLoading: launchpadLoading } =
    useGetParticipatedLaunchpad(address)

  const { data: buyRuleStatus } = useGetBuyRuleLaunchpad()

  const isKycVerified = useMemo(() => {
    return buyRuleStatus?.[0]?.result ?? false
  }, [buyRuleStatus])

  return (
    <main className="container py-16 max-w-full xl:max-w-[1200px] 2xl:max-w-[1400px] relative">
      <div className="kyc-status text-center py-2 px-8 bg-white rounded-sm w-fit my-0 mx-auto absolute " style={{top:"-30px", right:"50px"}}>
        {isKycVerified ? (
          <span className="text-black">KYC Verified</span>
        ) : (
          <AstraLink link="/launchpad/kyc">
            <span className="text-red-600 cursor-pointer">
              KYC Is Not Verified (Click to verify KYC)
            </span>
          </AstraLink>
        )}
      </div>
      <header className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div className="flex flex-col items-stretch w-[55%] max-md:w-full max-md:ml-0">
          <div className="flex flex-col items-stretch my-auto px-5 max-md:max-w-full max-md:mt-10">
            <h1 className="text-white text-2xl font-medium tracking-[2.5px] uppercase max-md:max-w-full">
              AstraDao Launchpad Portfolio
            </h1>
            <p className="text-white text-base leading-6 tracking-wide mt-8 max-md:max-w-full">
              Providing exceptional projects and fostering confidence in the
              Decentralized launchpad space.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-stretch w-[45%] ml-5 max-md:w-full max-md:ml-0">
          <Image
            loading="lazy"
            src="/svgs/launchpad/astra-stars.svg"
            alt="launchpad"
            className="aspect-[1.47] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-10"
            width={500}
            height={500}
          />
        </div>
      </header>
      <div className="border white w-full"></div>

      <div className="participated">
        <LiveUpcoming status="user" />
      </div>
      <div className="participated">
        <ClaimStatistics
          launchpads={launchpads}
          launchpadLoading={launchpadLoading}
        />
      </div>
      <div className="requested mt-12">
        <LiveUpcoming status="owner" />
      </div>
      <div className="participated mt-12">
        <LiveUpcoming status="coming-soon" />
      </div>
    </main>
  )
}
