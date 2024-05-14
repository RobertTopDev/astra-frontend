'use client'

import { AstraLogo } from '@/components'
import { navLinks } from '@/constants'
import { cn } from '@/lib'
import { Cross1Icon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { Fragment, useEffect, useRef, useState } from 'react'
import { NavConnect } from './nav-connect'
import { NavLink } from './nav-link'
import { NavMenu } from './nav-menu'
import styles from './navbar.module.scss'

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [toggleMenu, setToggleMenu] = useState(false)
  const [openDropdown, setOpenDropdown] = useState('')
  const menuRef = useRef<HTMLElement>(null)
  const handleSubMenuClick = (name: string) => {
    setOpenDropdown(openDropdown === name ? '' : name)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      if (scrollTop > 5) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current?.contains(event.target as Node)) {
        setToggleMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [menuRef])

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-[200] w-full sm:px-16 px-6 py-10',
        styles.header,
        scrolled && styles.scrolled
      )}
    >
      <nav className="flex sm:items-center justify-between mx-auto inset-0 px-0 container w-full max-w-full xl:max-w-[1400px]">
        <div>
          <AstraLogo />
        </div>
        <div className="flex items-center justify-end gap-2">
          <ul className="xl:flex hidden items-center justify-between p-0">
            <NavMenu />
          </ul>
          <div className="flex">
            <NavConnect />
          </div>
          <div className="xl:hidden">
            <button
              onClick={() => {
                setToggleMenu(!toggleMenu)
              }}
            >
              {toggleMenu ? <Cross1Icon /> : <HamburgerMenuIcon />}
            </button>
            {toggleMenu && (
              <nav
                ref={menuRef}
                // variants={_menu}
                className={clsx(
                  styles['nav-small'],
                  'p-6 absolute top-12 right-0'
                )}
              >
                <ul className="flex flex-col gap-6 items-start justify-between p-0">
                  {navLinks.map((link, index) =>
                    !!link.menu ? (
                      <Fragment key={index}>
                        <button
                          className="p-[12px] hover:text-white text-[#e8e6e3] text-xs"
                          onClick={() => handleSubMenuClick(link.name)}
                        >
                          {link.name} {openDropdown === link.name ? '⮙' : '⮛'}
                        </button>
                        <ul
                          className={
                            openDropdown === link.name ? 'block' : 'hidden'
                          }
                        >
                          {link.menu.map((subLink, subIndex) => (
                            <li className="py-2" key={subIndex}>
                              <NavLink
                                link={subLink.link !== '' ? subLink.link : '#'}
                              >
                                {subLink.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </Fragment>
                    ) : (
                      <li className={styles.navItem} key={index + link.link}>
                        <NavLink link={!!link.link ? link.link : '#'}>
                          {link.name}
                        </NavLink>
                      </li>
                    )
                  )}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}
