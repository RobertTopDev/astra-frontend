import { AstraHeader } from '@/components'
import { TransactionsTable } from './sections/transaction-table'

export default async function Transactions() {
  return (
    <main className="min-h-screen  ">
      <div className="container flex flex-col relative py-20 items-center gap-6">
        <AstraHeader>TRANSACTION HISTORY</AstraHeader>
        <span>Your recent transactions will show up soon</span>
        <TransactionsTable />
      </div>
    </main>
  )
}
