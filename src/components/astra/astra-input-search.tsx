import * as React from 'react'
import { Input, InputProps } from '../shadcn'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib'

type TAstraInputSearchProps = InputProps

const AstraInputSearch = ({ className, ...props }: TAstraInputSearchProps) => {
  return (
    <div className="relative flex gap-1.5">
      <MagnifyingGlassIcon className="absolute transform top-1/2 -translate-y-1/2 left-3 text-astra-blue" />
      <Input
        type="text"
        placeholder="Search name or paste Address"
        className={cn(
          'pl-8 rounded-full text-xs tracking-widest border border-astra-blue dark:bg-transparent dark:text-neutral-900',
          className
        )}
        {...props}
      />
    </div>
  )
}

export { AstraInputSearch }
