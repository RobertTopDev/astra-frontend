'use client'

import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/shadcn/ui/toast'
import { useToastTransaction } from '.'

export function ToasterTransaction() {
  const { toasts } = useToastTransaction()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="data-[state=closed]:slide-out-to-left-full"
          >
            <div className="grid gap-1 relative">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="border-2 w-[1rem] h-[1rem] border-black/[28] border-t-astra-blue rounded-full animate-spin pr-2"></span>
              &nbsp;
            </span>
            {action}
          </Toast>
        )
      })}
      <ToastViewport className="space-y-2 sm:right-auto" />
    </ToastProvider>
  )
}
