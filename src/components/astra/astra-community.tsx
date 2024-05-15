import { AstraCard, AstraHeader } from '@/components'
import clsx from 'clsx'
import React from 'react'
import styles from './astra-community.module.scss'
import Image from 'next/image'
import { FooterLogoLink } from '@/components/layout/footer/footer-links'
import { socialLinks } from '@/constants'

export const AstraCommunity = () => {
  return (
    <div className="z-20 container py-20 mx-auto w-full">
      <div className="flex flex-col items-center gap-12">
        <AstraHeader>COMMUNITY</AstraHeader>
        <div>
          <AstraCard className="bg-opacity-20">
            <div className="grid grid-cols-12 relative">
              <div className="lg:col-span-6 col-span-full flex flex-col gap-12">
                <div className="text-lg text-justify">
                  Our community grows stronger every day. Please follow our
                  social platforms to get the most up-to-date, accurate ASTRA
                  DAO information.
                  <br />
                  <br /> Using the links below, you can join our various groups
                  alongside the other members of ASTRA DAO Family!&nbsp;
                </div>
                <ul className="gap-6 flex flex-wrap">
                  {socialLinks.map((link) => (
                    <FooterLogoLink link={link} key={link.alt + link.logoUrl} />
                  ))}
                </ul>
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
