import Link from 'next/link'
import { PropsWithChildren } from 'react'

type TAstraLink = {
  link: string
  isPage?: boolean
} & PropsWithChildren

export const AstraLink = ({ link, children, isPage = false }: TAstraLink) => {
  if (isPage) {
    return (
      <Link
        href={link}
        scroll={false}
        target="_blank"
        className="text-astra-blue"
      >
        {children}
      </Link>
    )
  }
  return (
    <a href={link} target="_blank" className="text-astra-blue">
      {children}
    </a>
  )
}
