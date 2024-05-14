import { cn } from '@/lib'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { PropsWithChildren } from 'react'
import { Button } from '../shadcn'

type TToggleSortButton<T> = {
  column: Column<T, unknown>
  className?: string
} & PropsWithChildren

export const AstraTableToggleSortButton = <T,>({
  column,
  children,
  className,
}: TToggleSortButton<T>) => {
  return (
    <div className={cn('text-left w-full', className)}>
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="rounded-none text-lg font-medium px-0"
      >
        {children}
        {column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
