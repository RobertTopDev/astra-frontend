'use client'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const AstraRouterBack = () => {
  const router = useRouter()
  const pathname = usePathname()

  const BackButton = () => (
    <div className="w-full container">
      <div className="flex relative z-40">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => {
            router.back()
          }}
        >
          <div className="flex gap-2 py-1 px-4 items-center bg-gray-700 rounded-full">
            <ArrowLeftIcon className="h-[1rem] w-[1rem]"></ArrowLeftIcon>
            <div className="text-sm">Go Back</div>
          </div>
        </button>
      </div>
    </div>
  )
  if (
    pathname === '/staking/transactions' ||
    pathname.includes('/launchpad/buy') ||
    pathname.includes('/launchpad/detail')
  ) {
    return <BackButton />
  }

  if (
    process.env.NEXT_PUBLIC_APP_URI !== undefined &&
    !['/', '/governance/proposals', '/staking', '/launchpad/kyc'].includes(pathname) &&
    document.referrer.includes(process.env.NEXT_PUBLIC_APP_URI) &&
    document.referrer.split(process.env.NEXT_PUBLIC_APP_URI)[1] !== pathname
  ) {
    return <BackButton />
  } else {
    return null
  }
}

export { AstraRouterBack }
