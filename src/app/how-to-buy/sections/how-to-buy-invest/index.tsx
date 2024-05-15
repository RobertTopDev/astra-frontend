import { Button } from '@/components/shadcn'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const HowToBuyInvest = () => {
  return (
    <div className="z-20 container mx-auto py-20 w-full">
      <div className="grid grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6 col-span-full flex justify-center items-center relative">
          <Image
            src="/svgs/how-to-buy-astra.svg"
            alt="Astra Banner"
            fill
            className="relative z-20"
          />
        </div>
        <div className="lg:col-span-6 col-span-full flex flex-col justify-center items-center mb-40 gap-12">
          <h2 className="text-5xl tracking-widest">INVEST IN AN INDEX</h2>
          <Link href="/indices/">
            <Button variant="astra-blue">GET STARTED</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export { HowToBuyInvest }
