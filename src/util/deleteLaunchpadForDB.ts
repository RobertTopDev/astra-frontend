'use client'

export const deleteLaunchpadForDB = async (launchpadId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/launchpads/delete?id=${launchpadId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return response
}
