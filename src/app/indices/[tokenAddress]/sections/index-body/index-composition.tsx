import { TIndex, TIndexCompositionWithAsset } from '@/types'
import { IndexCompositionPieChart } from './index-composition-pie-chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn'
import { IndexCompositionAssets } from './index-composition-assets'
import { AstraLoading } from '@/components'

type TIndexCompositionProps = {
  assetsData: TIndexCompositionWithAsset[]
  index: TIndex
  tabClassName?: string
  assetsDataLoading: boolean
}

const IndexComposition = ({
  assetsData,
  assetsDataLoading,
}: TIndexCompositionProps) => {
  return assetsDataLoading ? (
    <div className="flex h-full w-full justify-center items-center">
      <AstraLoading isLoading={true}></AstraLoading>
    </div>
  ) : (
    <Tabs defaultValue="indices" className="w-full flex flex-col gap-6 h-full">
      <TabsList className="w-full flex justify-stretch">
        <TabsTrigger value="indices" className="flex-grow">
          Indices Breakdown
        </TabsTrigger>
        <TabsTrigger value="assets" className="flex-grow">
          Assets Breakdown
        </TabsTrigger>
      </TabsList>
      <TabsContent value="indices" className="h-full">
        <div className="h-full flex items-center justify-center">
          <IndexCompositionPieChart assetsData={assetsData} />
        </div>
      </TabsContent>
      <TabsContent value="assets" className="h-full">
        <div className="h-full flex items-start">
          <IndexCompositionAssets
            tokensIndices={assetsData}
            assetsData={assetsData}
            isLoading={assetsDataLoading}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}

export { IndexComposition }
