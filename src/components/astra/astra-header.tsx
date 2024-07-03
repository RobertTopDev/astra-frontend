import { cn } from '@/lib'
import React, { PropsWithChildren } from 'react'

const AstraHeader = ({
  children,
  className,
}: { className?: string } & PropsWithChildren) => {
  return (
    <h2 className={cn('text-3xl tracking-widest', className)}>{children}</h2>
  )
}

export { AstraHeader }
