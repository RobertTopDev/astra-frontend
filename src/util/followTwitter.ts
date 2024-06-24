'use client'

export const followTwitter = async (address: `0x${string}` | undefined) => {
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid address format');
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/launchpads/follow`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address:address,
        data: 'twitter'
      })
    }
  )
  if (!response.ok) {
    throw new Error('Failed to follow Twitter');
  }

  return response
}
