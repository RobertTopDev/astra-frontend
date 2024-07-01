import { AstraTable } from '@/components'
import { TStakers } from '@/types'
import React from 'react'
import { stakersColumns } from '../../components/stakers-table-columns'

async function getAllStakers() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stakers/pools/top`,
      {
        next: { revalidate: 3600 * 3 },
      }
    )

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }

    return res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

const ProposalsUsers = async () => {
  const { data } = (await getAllStakers()) as { data: Array<TStakers> | null }

  return (
    <div className="container w-full flex flex-col gap-6">
      <div>TOP ADDRESSES</div>
      {!!data && <AstraTable data={data} columns={stakersColumns} />}
    </div>
  )
}

export { ProposalsUsers }
