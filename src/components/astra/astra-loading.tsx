import { cn } from '@/lib'
import React, { PropsWithChildren } from 'react'

type TAstraLoadingProps = PropsWithChildren<{
  className?: string
  isLoading: boolean
}>

const AstraLoading = ({
  children,
  className,
  isLoading,
}: TAstraLoadingProps) => {
  return (
    <>
      {isLoading ? (
        <div
          className={cn(
            'inline-block border-2 w-[1rem] h-[1rem] border-black/[28] border-t-astra-blue rounded-full animate-spin pr-2',
            className
          )}
        ></div>
      ) : (
        // <span className={cn('', className)}>
        // </span>
        children
      )}
    </>
  )
}

export { AstraLoading }
