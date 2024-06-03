'use client'

import Link from 'next/link'
import React, { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

interface NavLinkProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  children: ReactNode
  link: string
}

export const NavLink = ({ children, link }: NavLinkProps) => {
  const currentRoute = usePathname()

  return (
    <Link
      href={link.toLowerCase()}
      scroll={false}
      className={clsx(
        'hover:text-white text-[#e8e6e3] text-xs',
        currentRoute === `/${link.toLowerCase()}` && 'text-astra-blue'
      )}
      id={`layout-${link}`}
    >
      {children}
    </Link>
  )
}
