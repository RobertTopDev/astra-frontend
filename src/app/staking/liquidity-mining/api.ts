import { TPool } from '@/types'

export async function getAllPools(): Promise<TPool[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pools/liquidity`,
    {
      // next: {
      //   revalidate: 0,
      // },
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error('error', res)
    throw new Error('Failed to fetch data')
  }

  const json = await res.json()
  return json.data
}

export async function getLiquidityMiningDetails(): Promise<{
  totalVolume: number
  tokenPrice: string
  totalLiquidity: number
  averageAPY: string
  percentageOfAstraStacked: string
}> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/transactions/liquidity/mining/details`,
    {
      // next: {
      //   revalidate: 0,
      // },
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error('error', res)
    throw new Error('Failed to fetch data')
  }

  const json = await res.json()
  return json.data
}
