'use client'
import { Separator } from '@radix-ui/react-separator'
import { IndexBody } from '.'
import { TIndex } from '@/types'
import { useAssetsData } from '@/hooks'

type TIndicesSectionProps = {
  index: TIndex
}

const IndicesSection = ({ index }: TIndicesSectionProps) => {
  const { data: assetsData = [], isLoading: assetsDataLoading } = useAssetsData(
    {
      index,
    }
  )

  return (
    <>
      <Separator className="my-20 container bg-white" />
      <IndexBody
        index={index}
        assetsData={assetsData}
        assetsDataLoading={assetsDataLoading}
      />
    </>
  )
}

export { IndicesSection }
