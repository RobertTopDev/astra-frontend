import { minidenticon } from 'minidenticons'
import { useMemo } from 'react'
import Image from 'next/image'

type TMiniIdenticon = {
  seed: string
  saturation?: number | string
  lightness?: number | string
  hashFn?: (str: string) => number
}

export const MiniIdenticon = ({
  seed,
  saturation,
  lightness,
  ...props
}: TMiniIdenticon) => {
  const svgURI = useMemo(
    () =>
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(minidenticon(seed, saturation, lightness)),
    [seed, saturation, lightness]
  )
  return (
    <Image
      src={svgURI}
      alt="Identicon"
      className="object-cover bg-white rounded-full"
      fill
      {...props}
    />
  )
}
