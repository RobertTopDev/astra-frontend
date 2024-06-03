'use client'

export const addContributorForDB = async (conData: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/launchpads/addContributor`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conData),
    }
  )

  return response
}
