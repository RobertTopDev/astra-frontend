'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import React from 'react'
import {
  navigationMenuTriggerStyle,
  NavigationMenuLink,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/shadcn'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { TLink } from '@/types'
import { useAccount, useNetwork } from 'wagmi'
import clsx from 'clsx'
import styles from './navbar.module.scss'
import { useGetLaunchpadAdmin, useVestingRewards } from '@/hooks'

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'

function NavLink({ navLink }: { navLink: TLink }) {
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const currentRoute = usePathname()
  const { data: vestingRewards } = useVestingRewards({})
  const { data: adminData, isLoading } = useGetLaunchpadAdmin()

  if (isLoading) return null
  else if (!!navLink.menu) {
    if (navLink.name === 'LAUNCHPAD' && !isConnected) return null
    return (
      <NavigationMenuItem
        className={clsx(
          styles['nav-item'],
          currentRoute !== '/' && currentRoute == '/' + navLink.link
            ? styles['nav-item-active']
            : ''
        )}
      >
        <NavigationMenuTrigger>
          <span>{navLink.name}</span>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul
            className={`grid gap-3 p-4 ${
              isConnected
                ? 'md:w-[550px] lg:w-[725px]'
                : 'md:w-[300px] lg:w-[425px]'
            } lg:grid-cols-[.75fr_1fr]`}
          >
            {navLink.menu.map((menuLink) => {
              if (
                menuLink.name === 'Launchpad Admin' &&
                ((adminData && adminData[0]?.result !== address) ||
                  chain?.unsupported)
              )
                return null
              return (
                <ListItem
                  href={menuLink.link}
                  title={menuLink.name}
                  key={menuLink.link + menuLink.name}
                >
                  {!!menuLink.description
                    ? menuLink.description
                    : 'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.'}
                </ListItem>
              )
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  } else if (navLink.authenticated && !isConnected) {
    return null
  } else {
    if (navLink.name === 'CLAIM' && vestingRewards?.length === 0) return null
    if (navLink.name === 'LAUNCHPAD' && isConnected) return null
    return (
      <NavigationMenuItem
        className={clsx(
          styles['nav-item'],
          currentRoute != '/' && currentRoute == '/' + navLink.link
            ? styles['nav-item-active']
            : ''
        )}
      >
        <Link href={navLink.link} legacyBehavior passHref>
          <NavigationMenuLink className={clsx(navigationMenuTriggerStyle())}>
            <span>{navLink.name}</span>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    )
  }
}

export function NavMenu() {
  return (
    <NavigationMenu className="relative">
      <NavigationMenuList>
        {navLinks.map((navLink, index) => (
          <NavLink
            navLink={navLink}
            key={navLink.name + index + navLink.link}
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
