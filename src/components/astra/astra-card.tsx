import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'
import { Card, CardContent } from '../shadcn'
import Image from 'next/image'
import styles from './astra-card.module.scss'
import { cn } from '@/lib'

type TAstraCard = {
  image?: string
  alt?: string
  className?: string
  imageClassName?: string
  contentClassName?: string
} & PropsWithChildren

const AstraCard = ({
  image,
  alt,
  children,
  className,
  contentClassName,
  imageClassName,
}: TAstraCard) => {
  return (
    <Card className={cn('relative rounded-3xl bg-[#15192b]', className)}>
      {image && alt && (
        <>
          <div className="absolute -top-[1/2] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={clsx(styles['rhex'], 'w-[4rem] h-[7rem]')}></div>
          </div>
          <div
            className={cn(
              'absolute -top-[1/2] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[4rem] aspect-square z-10',
              imageClassName
            )}
          >
            <Image src={image} alt={alt} fill={true} className="object-fill" />
          </div>
        </>
      )}
      <CardContent
        className={cn(
          'relative p-12 pt-16 flex items-center gap-4',
          contentClassName
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}

export { AstraCard }
