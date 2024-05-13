'use client'

export const updateLaunchpadForDB = async (
  launchpadData: any,
  launchpadId: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/launchpads/update?id=${launchpadId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launchpadData),
    }
  )

  return response
}
