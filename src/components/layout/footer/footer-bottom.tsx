import { AstraLogo } from '@/components'
import React from 'react'

const FooterBottom = () => {
  return (
    <div className="bottom-0 right-0 sm:px-16 px-2 sm:py-6 py-2 bg-black">
      <div className="container flex justify-between items-center">
        <div>
          <AstraLogo />
        </div>
        <p className="font-extralight text-sm md:text-left text-right">
          Copyright © {new Date().getFullYear()} - Astra DAO - All Rights
          Reserved
        </p>
      </div>
    </div>
  )
}

export { FooterBottom }
