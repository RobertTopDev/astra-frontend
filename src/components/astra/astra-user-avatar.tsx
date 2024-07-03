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
  const imageFilterd = image
  if (address === '0x4505Ae1b05096ee6B83e81cB85349C1d2d1ef7D8')
    image = '/images/Bitcoin.png'
  if (address === '0x6D42Ee7B147b90081fF1Ef04F71500539b08929C')
    image = '/images/Arbitrum.png'
  if (address === '0x3bD2D86b3B93789F924efb9655a84cd374fb0987')
    image = '/images/Ethereum.png'

  return (
    <div className={cn('flex gap-4 items-center', className)} onClick={onClick}>
      <div className={cn('relative h-14 w-14', isForTable && 'h-10 w-10')}>
        {nameLink ? (
          <Link href={nameLink}>
            <MiniIdenticon seed={address + nameLink} image={imageFilterd} />
          </Link>
        ) : (
          <MiniIdenticon seed={address + name} image={imageFilterd}/>
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
