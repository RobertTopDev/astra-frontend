import { Hero } from './sections/hero'
import { Indices } from './sections/indices'
import { InvestStep } from './sections/invest-step'

export default async function Home() {
  return (
    <main className="min-h-screen">
      <div className="overflow-hidden flex flex-col items-center justify-between relative">
        <Hero></Hero>
      </div>
      <InvestStep />
      <Indices />
    </main>
  )
}
