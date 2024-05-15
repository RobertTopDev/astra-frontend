'use client'

export const approveLaunchpadForDB = async (approveData: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/launchpads/approve`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(approveData),
    }
  )

  if (!response.ok)
    throw new Error(`Error while approveLaunchpadForDB: ${response.status}`)

  return response
}
