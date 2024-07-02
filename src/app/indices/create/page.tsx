import { TToken } from '@/types'
import { CreateHeader } from './sections/create-header'
import { CreateForm } from './sections/create-form'

async function getTokensList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tokens/all`, {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error('error', res)
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function CreateIndex() {
  const { data: allTokens } = (await getTokensList()) as {
    data: TToken[]
  }

  return (
    <main className="min-h-screen  ">
      <div className="container flex flex-col items-center gap-6 justify-center w-full h-full pb-20 xl:w-1/2">
        <CreateHeader />
        <CreateForm allTokens={allTokens} />
      </div>
    </main>
  )
}
