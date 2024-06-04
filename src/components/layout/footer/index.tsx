'use client'

import { FooterBottom } from './footer-bottom'
import { FooterLinks } from './footer-links'
import { FooterTermsOfUse } from './footer-terms-of-use'
import styles from './footer.module.scss'
import clsx from 'clsx'
import FooterInfo from './footer-info'
import { Separator } from '@/components/shadcn'

export const Footer = () => {
  return (
    <>
      <div className={clsx(styles['footer-content'])}>
        <div className="container flex flex-col gap-4 py-16">
          <FooterInfo />
          <Separator className="bg-astra-blue my-6" />
          <FooterLinks />
          <Separator className="bg-astra-blue my-6" />
          <FooterTermsOfUse />
        </div>
      </div>
      <FooterBottom />
    </>
  )
}
