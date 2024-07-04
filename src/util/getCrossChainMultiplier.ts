export async function getCrossChainMultiplier(
  rpcUrl: string,
  contractAddress: string,
  userAddress: string
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/launchpads/getWeightedAverageMultiplier/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rpcUrl, contractAddress, userAddress }),
      }
    )

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }

    const json = await res.json()

    return json.data
  } catch (err) {
    console.error('Fetch error: ', err)
    return ''
  }
}
