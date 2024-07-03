import { TIndex, TInvestmentToken } from '@/types'
import { IndicesSection } from './sections/index-body/indices-section'
import { IndexHeader } from './sections/index-header'

type TGetIndex = {
  tokenAddress: string
}

async function getIndex({ tokenAddress }: TGetIndex) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/indices/${tokenAddress}`,
    {
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) {
    console.error('error', res)
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

async function getInvestmentTokenList() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tokens/investment`,
    {
      next: { revalidate: 5000 },
    }
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error('error', res)
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

type TPage = {
  params: {
    tokenAddress: string
  }
}

export default async function Page({ params }: TPage) {
  const { data: index } = (await getIndex({
    tokenAddress: params.tokenAddress,
  })) as {
    data: TIndex
  }
  const { data: investmentTokens } = (await getInvestmentTokenList()) as {
    data: TInvestmentToken[]
  }

  return (
    <main className="min-h-screen mt-[2rem]">
      <IndexHeader investmentTokens={investmentTokens} index={index} />
      {!!index && <IndicesSection index={index}></IndicesSection>}
    </main>
  )
}
