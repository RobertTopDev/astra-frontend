'use client'

import React from 'react'
import { shorten, truncate } from '@/util'
import { useNetwork } from 'wagmi'
import { MiniIdenticon } from '../mini-identicon'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../shadcn'
import { cn } from '@/lib'
import Link from 'next/link'

type TUserAvatar = {
  address: string
  name?: string
  className?: string
  isForTable?: boolean
  isToken?: boolean
  nameLink?: string
  image?: string
  onClick?: () => void
}

const UserAvatar = ({
  address,
  name,
  className,
  isForTable = false,
  isToken = false,
  nameLink,
  image,
  onClick,
}: TUserAvatar) => {
  const { chain } = useNetwork()
  // chain?.network
  // chain?.blockExplorers?.default

  return (
    <div className={cn('flex gap-4 items-center', className)} onClick={onClick}>
      <div className={cn('relative h-14 w-14', isForTable && 'h-10 w-10')}>
        {nameLink ? (
          <Link href={nameLink}>
            <MiniIdenticon seed={address + nameLink} image={image} />
          </Link>
        ) : (
          <MiniIdenticon seed={address + name} />
        )}
      </div>
      <div className="flex flex-col text-left text-white">
        {!!name &&
          (nameLink ? (
            <div
              className={cn(
                'font-[900] flex text-lg hover:opacity-70 cursor-pointer leading-tight',
                isForTable && 'text-base'
              )}
            >
              {nameLink ? (
                <Link href={nameLink}>{truncate(name, 25)}</Link>
              ) : (
                truncate(name, 25)
              )}
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'font-[900] flex text-lg hover:opacity-70 cursor-pointer leading-tight',
                      isForTable && 'text-base'
                    )}
                  >
                    {nameLink ? (
                      <Link href={nameLink}>{truncate(name, 25)}</Link>
                    ) : (
                      truncate(name, 25)
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        <div className="text-astra-blue hover:opacity-70 leading-tight cursor-pointer">
          {chain?.blockExplorers?.default ? (
            <a
              href={`${chain?.blockExplorers?.default.url}/${
                isToken ? 'token' : 'address'
              }/${address}`}
              target="_blank"
            >
              {shorten(address)}
            </a>
          ) : (
            <>{shorten(address)}</>
          )}
        </div>
      </div>
    </div>
  )
}

export { UserAvatar }
