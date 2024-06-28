import React from 'react'
import clsx from 'clsx'

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  barColor?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
  barColor,
  ...props
}) => {
  return (
    <div
      className={clsx('w-full rounded-xl h-2 bg-white', className)}
      {...props}
    >
      <div
        className={clsx('h-full rounded-xl bg-astra-blue', barColor)}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default ProgressBar
