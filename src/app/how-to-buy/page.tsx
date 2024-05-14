import { AstraCommunity } from '@/components'
import { HowToBuyAstraDao } from './sections/how-to-buy-astra-dao'
import { HowToBuyInfo } from './sections/how-to-buy-info'
import { HowToBuyInvest } from './sections/how-to-buy-invest'

export default async function HowToBuy() {
  return (
    <main className="min-h-screen  ">
      <HowToBuyAstraDao />
      <HowToBuyInfo />
      <HowToBuyInvest />
      <AstraCommunity />
    </main>
  )
}
