import { AstraCommunity } from '@/components'
import {
  About,
  AboutBoard,
  AboutUtility,
  AboutAllocation,
  AboutFAQs,
} from './sections'

export default async function Page() {
  return (
    <main className="min-h-screen  ">
      <About />
      <AboutBoard />
      <AboutUtility></AboutUtility>
      <AboutAllocation></AboutAllocation>
      <AboutFAQs></AboutFAQs>
      <AstraCommunity />
    </main>
  )
}
