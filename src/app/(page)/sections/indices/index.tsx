import styles from './indices.module.scss'
import clsx from 'clsx'
import { AstraHeader } from '@/components'
import {
  IndexCard,
  IndicesTable,
  getIndices,
} from '@/app/indices/(page)/components'

// TODO: Implement by card fetch
const Indices = async () => {
  const { highestEarner, mostInvested, lowestRisk, indices } =
    await getIndices()

  return (
    <div
      className="container py-20 text-center flex flex-col gap-16"
      id="indices"
    >
      <div className="flex flex-col gap-16">
        <AstraHeader>MOST POPULAR INDICES</AstraHeader>
        <div
          className={clsx(styles['index-container'], 'grid grid-cols-12 gap-8')}
        >
          <div className="lg:col-span-4 col-span-full flex flex-col gap-8">
            <h2>HIGHEST EARNER</h2>
            {highestEarner && (
              <IndexCard index={highestEarner} id="chart_one" />
            )}
          </div>
          <div className="lg:col-span-4 col-span-full flex flex-col gap-8">
            <h2>MOST INVESTED</h2>
            {mostInvested && <IndexCard index={mostInvested} id="chart_two" />}
          </div>
          <div className="lg:col-span-4 col-span-full flex flex-col gap-8">
            <h2>LOWEST RISK</h2>
            {lowestRisk && <IndexCard index={lowestRisk} id="chart_three" />}
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col gap-16">
        <AstraHeader>INDICES</AstraHeader>
        {indices && <IndicesTable data={indices} />}
      </div> */}
    </div>
  )
}

export { Indices }
