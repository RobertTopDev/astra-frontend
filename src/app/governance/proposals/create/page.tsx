import React from 'react'
import { ProposalsMenu } from '../../components/proposals-menu'
import { CreateProposal } from './sections/create-proposal'
import { getIndices } from '@/app/indices/(page)/components'

const CreatePage = async () => {
  const { indices } = await getIndices()
  return (
    <main className="min-h-screen mt-[2rem] pb-20">
      <div className="w-full container pb-20">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <ProposalsMenu />
          </div>
          <div className="col-span-9">
            <CreateProposal indices={indices} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default CreatePage
