import Link from 'next/link'
import Image from 'next/image'
import React, { ReactNode } from 'react'

type TAstraLogo = {
  fill?: boolean
  className?: string
  width?: number
  height?: number
}

const AstraLogo = ({ fill = false, className, width, height }: TAstraLogo) => {
  let logo: ReactNode
  if (fill) {
    logo = <Image src="/svgs/logo.svg" alt="Astra Logo" fill={true} />
  } else {
    logo = (
      <Image
        src="/svgs/logo.svg"
        alt="Astra Logo"
        width={width || 125}
        height={height || 125}
      />
    )
  }
  return (
    <Link href="/" scroll={false} className={`${className}`}>
      {logo}
    </Link>
  )
}

export { AstraLogo }
