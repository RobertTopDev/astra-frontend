'use client'

import { AstraLink } from '@/components'
import Image from 'next/image'
import { Button } from '@/components/shadcn'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Error({ reset }: { reset: () => void }) {
  const pathname = usePathname()

  return (
    <main className="min-h-screen h-full w-full items-center justify-center flex flex-col gap-6 transform -translate-y-[7rem]">
      <div className="w-[512px] h-[420px] flex relative">
        <Image
          src="/images/505-error.png"
          alt="Astra Error 505"
          fill
          className="relative z-20 transform"
        />
      </div>
      <h2 className="text-3xl font-bold">500 - Internal server error</h2>
      <p className="w-full max-w-[580px] text-center">
        The server encountered an unexpected condition that prevented it from
        fulfilling the request. You can contact us at&nbsp;
        <AstraLink link="mailto:dao@astradao.org">dao@astradao.org</AstraLink>
        &nbsp; and we can help out!
      </p>
      <div className="flex flex-col items-center gap-2">
        <Button variant="astra-blue" onClick={reset}>
          Try Again
        </Button>
        {process.env.NEXT_PUBLIC_APP_URI !== undefined &&
        !['/', '/governance/proposals', '/staking'].includes(pathname) &&
        document.referrer.includes(process.env.NEXT_PUBLIC_APP_URI) ? null : (
          <Link href="/">
            <Button variant="astra-white">Go Back</Button>
          </Link>
        )}
      </div>
    </main>
  )
}
