export async function getApyInfo() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/proposals/APY/details/`,
      {
        next: { revalidate: 3600 * 3 },
      }
    )
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }

    const json = await res.json()

    return json.data as {
      liquidityMiningAPR: number
      stakingRewardsAPR: number
      iTokenAPR: number
    }
  } catch (err) {
    console.error('Fetch error: ', err)
    return {
      liquidityMiningAPR: 0,
      stakingRewardsAPR: 0,
      iTokenAPR: 0,
    }
  }
}
