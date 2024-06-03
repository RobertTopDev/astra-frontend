import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '.'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90',
        destructive:
          'bg-red-500 text-neutral-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
        outline:
          'border border-neutral-200 bg-transparent shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        secondary:
          'bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50',
        'astra-destructive':
          'lg:px-12 md:py-2 px-4 rounded-full text-xs tracking-widest border border-destructive dark:bg-neutral-900 dark:text-destructive dark:hover:bg-neutral-900/80 dark:hover:text-destructive/90',
        'astra-blue':
          'lg:px-16 md:px-12 px-4 rounded-full text-xs tracking-widest border border-astra-blue dark:bg-astra-blue/90 dark:text-neutral-900 dark:hover:bg-neutral-50 dark:hover:text-neutral-900',
        'astra-blue-outline':
          'lg:px-16 md:px-12 px-4 rounded-full text-xs tracking-widest border border-astra-blue dark:text-white dark:hover:bg-white/90 dark:hover:text-neutral-900',
        'astra-white':
          'lg:px-16 md:px-12 px-4 rounded-full text-xs tracking-widest border border-astra-blue dark:text-neutral-900 dark:bg-neutral-50 dark:hover:bg-astra-blue/80 dark:hover:text-white',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  tooltip?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      disabled,
      type = 'button',
      tooltip,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return tooltip ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Comp
              className={cn(
                buttonVariants({ variant, size, className }),
                className
              )}
              ref={ref}
              disabled={isLoading || disabled}
              type={type}
              {...props}
            >
              <>
                <div className="flex gap-2 items-center justify-center">
                  {isLoading && (
                    <>
                      <span className="border-2 w-[1rem] h-[1rem] border-black/[28] border-t-astra-blue rounded-full animate-spin pr-2"></span>
                      &nbsp;
                    </>
                  )}

                  {children}
                </div>
              </>
            </Comp>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), className)}
        ref={ref}
        disabled={isLoading || disabled}
        type={type}
        {...props}
      >
        <>
          <div className="flex gap-2 items-center justify-center">
            {isLoading && (
              <>
                <span className="border-2 w-[1rem] h-[1rem] border-black/[28] border-t-astra-blue rounded-full animate-spin pr-2"></span>
                &nbsp;
              </>
            )}

            {children}
          </div>
        </>
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
