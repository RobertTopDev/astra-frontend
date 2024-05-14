import { ProposalsInfo } from './sections/proposals-info'
import { ProposalsUsers } from './sections/proposals-users'

export default async function Proposals() {
  return (
    <main className="min-h-screen   pb-20">
      <ProposalsInfo />
      <ProposalsUsers />
    </main>
  )
}
