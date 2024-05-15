import { TProposal, TProposalSignature } from '@/types'
import { ProposalInfo } from './sections/proposal-info'

async function getProposal({ proposalId }: { proposalId: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/proposals/${proposalId}`,
    {
      // next: {
      //   revalidate: 0,
      // },
      next: { revalidate: 0 },
    }
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error('error', res)
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

async function getProposalSignatures({ proposalId }: { proposalId: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/signatures/${proposalId}`,
    {
      // next: {
      //   revalidate: 0,
      // },
      next: { revalidate: 0 },
    }
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary console.log('error', res)
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

type TProposalPage = {
  params: {
    proposalId: string
  }
}

export default async function ProposalPage({ params }: TProposalPage) {
  const { data: proposal } = (await getProposal({
    proposalId: params.proposalId,
  })) as {
    data: TProposal
  }

  const { data: signatures } = (await getProposalSignatures({
    proposalId: params.proposalId,
  })) as {
    data: TProposalSignature[]
  }

  return (
    <main className="relative min-h-screen mt-[2rem] pb-20">
      <ProposalInfo proposal={proposal} signatures={signatures} />
    </main>
  )
}
