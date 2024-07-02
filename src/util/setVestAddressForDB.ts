'use client'

type Props = {
  launchpadAddress: `0x${string}`
  vestAddress: `0x${string}`
}

export const setVestAddressForDB = async (data: Props) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/launchpads/updateVestAddress`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )

  return response
}
