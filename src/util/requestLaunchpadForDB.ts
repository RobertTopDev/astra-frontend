'use client'

export const requestLuanchpadForDB = async (launchpadData: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/launchpads/request`,
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
