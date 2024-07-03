import {
  astraLinks,
  communityLinks,
  quickLinks,
  resourcesLinks,
  socialLinks,
  supportLinks,
} from '@/constants'
import { TLink, TLogoLink } from '@/types'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import styles from './footer.module.scss'

const FooterLinks = () => {
  return (
    <div
      className={clsx(
        'grid md:grid-cols-12 grid-cols-6 gap-2',
        styles['footer-links']
      )}
    >
      <div className="col-span-2">
        <h2 className="text-astra-blue mb-4 font-medium text-base">Astra</h2>
        <ul>
          {astraLinks.map((link) => (
            <FooterLink link={link} key={link.name + link.link}></FooterLink>
          ))}
        </ul>
      </div>
      <div className="col-span-2">
        <h2 className="text-astra-blue mb-4 font-medium text-base">
          Community
        </h2>
        <ul>
          {communityLinks.map((link) => (
            <FooterLink link={link} key={link.name + link.link}></FooterLink>
          ))}
        </ul>
      </div>
      <div className="col-span-2">
        <h2 className="text-astra-blue mb-4 font-medium text-base">
          Resources
        </h2>
        <ul>
          {resourcesLinks.map((link) => (
            <FooterLink link={link} key={link.name + link.link}></FooterLink>
          ))}
        </ul>
      </div>
      <div className="col-span-2">
        <h2 className="text-astra-blue mb-4 font-medium text-base">Support</h2>
        <ul>
          {supportLinks.map((link) => (
            <FooterLink link={link} key={link.name + link.link}></FooterLink>
          ))}
        </ul>
      </div>
      <div className="col-span-2">
        <h2 className="text-astra-blue mb-4 font-medium text-base">
          Quick Links
        </h2>
        <ul>
          {quickLinks.map((link) => (
            <FooterLink link={link} key={link.name + link.link}></FooterLink>
          ))}
        </ul>
      </div>
      <div className="col-span-2">
        <h2 className="text-astra-blue mb-4 font-medium text-base">
          Our Socials
        </h2>
        <ul className="gap-6 flex flex-wrap">
          {socialLinks.map((link) => (
            <FooterLogoLink link={link} key={link.alt + link.logoUrl} />
          ))}
        </ul>
      </div>
    </div>
  )
}

type TLogoFooterLink = {
  link: TLogoLink
}

export const FooterLogoLink = ({ link }: TLogoFooterLink) => {
  let linkNode: ReactNode
  if (link.external) {
    linkNode = (
      <Link
        href={link.redirectUrl}
        scroll={false}
        id={`layout-${link}`}
        target="_blank"
      >
        <Image src={link.logoUrl} alt={link.alt} fill={true} />
      </Link>
    )
  } else {
    linkNode = (
      <Link href={link.redirectUrl} scroll={false} id={`layout-${link}`}>
        <Image src={link.logoUrl} alt={link.alt} width={16} height={16} />
      </Link>
    )
  }
  return (
    <li className={clsx('font-bold')} style={{width:"40px", height:"40px"}} >
      <div className="bg-astra-blue p-1 justify-center flex items-center" style={{width:"40px", height:"40px", borderRadius:"50%"}} >{linkNode}</div>
    </li>
  )
}
type TFooterLink = {
  link: TLink
}

const FooterLink = ({ link }: TFooterLink) => (
  <li className={clsx('font-bold')}>
    <Link
      href={link.link}
      className="hover:text-astra-blue mb-4 font-medium text-[#e8e6e3] text-xs leading-4"
      id={`layout-${link}`}
      target={link.external ? '_blank' : '_self'}
    >
      {link.name}
    </Link>
  </li>
)

export { FooterLinks }
