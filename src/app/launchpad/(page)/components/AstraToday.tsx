'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { AstraCard, AstraHeader } from '@/components'
import { Button } from '@/components/shadcn'
import styles from '@/components/astra/astra-community.module.scss'

export default function AstraToday() {
  return (
    <div className="py-20 w-full">
      <div className="flex flex-col items-center gap-12 ">
        <AstraHeader>Launch on Astra DAO today</AstraHeader>
        <div>
          <AstraCard className="bg-opacity-20 bg-[#B2C4E833] border-none">
            <div className="grid grid-cols-12 relative">
              <div className="lg:col-span-9 col-span-full flex flex-col gap-6">
                <div className="text-lg text-justify">
                  Astra DAO is the largest on-chain launchpad with over 1
                  million users across the world, and a host of technical and
                  operational resources for its launch partners.
                </div>
                <div className="mt-8">
                  <Link href="/launchpad/request">
                    <Button className="px-16" variant="astra-blue">
                      Apply for Launchpad
                    </Button>
                  </Link>
                </div>
              </div>
              <div className={clsx(styles['astra-icon'], 'lg:block hidden')}>
                <Image
                  fill={true}
                  alt="Dolphin"
                  src="/images/dolphin.png"
                  className="object-cover"
                />
              </div>
            </div>
          </AstraCard>
        </div>
      </div>
    </div>
  )
}
