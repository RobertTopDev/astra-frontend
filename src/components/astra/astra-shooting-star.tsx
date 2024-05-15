import React, { ComponentProps } from 'react'
import styles from './astra-shooting-star.module.scss'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

type TAstraShootingStar = {
  className?: string
  isRight?: boolean
} & ComponentProps<'div'>

const AstraShootingStar = ({
  className,
  isRight = false,
  ...props
}: TAstraShootingStar) => {
  return (
    <div
      className={twMerge(
        clsx(
          styles['astra-shooting-star'],
          isRight
            ? styles['astra-shooting-star-right']
            : styles['astra-shooting-star-left'],
          className
        )
      )}
      {...props}
    ></div>
  )
}

export { AstraShootingStar }
