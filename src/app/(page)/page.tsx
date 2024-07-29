import { CompletedLaunchpad } from './sections/completed-launchpad'
import { Hero } from './sections/hero'
import { Indices } from './sections/indices'
import { InvestStep } from './sections/invest-step'
import { Utilities } from './sections/utilities'

export default async function Home() {
  return (
    <main className="min-h-screen">
      <div className="overflow-hidden flex flex-col items-center justify-between relative">
        <Hero></Hero>
      </div>
      <Utilities />
      <InvestStep />
      <Indices />
      <CompletedLaunchpad />
    </main>
  )
}
