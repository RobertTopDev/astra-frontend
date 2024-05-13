import clsx from 'clsx'
import styles from './astra-star.module.scss'
import { twMerge } from 'tailwind-merge'
import { ComponentProps } from 'react'

export const AstraStar = ({
  className,
  ...props
}: { className?: string } & ComponentProps<'div'>) => {
  return (
    <div className={twMerge(clsx(styles['ag-star'], className))} {...props} />
  )
}
