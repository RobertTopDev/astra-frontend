import { AstraHeader } from '@/components'
import { IndicesTable, getIndices } from '../../components'

const IndicesTableSection = async () => {
  const { indices } = await getIndices()

  return (
    <div className="relative z-10 container mx-auto w-full py-20">
      <div className="flex flex-col gap-16 items-center w-full" id="indices">
        <AstraHeader>ALL INDICES</AstraHeader>
        {!!indices && <IndicesTable data={indices} />}
      </div>
    </div>
  )
}

export { IndicesTableSection }
