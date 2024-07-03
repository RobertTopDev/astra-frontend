import { IndicesCardsSection } from './sections/indices-cards-section'
import { IndicesTableSection } from './sections/indices-table-section'

export default async function Indices() {
  return (
    <main className="min-h-screen  ">
      <IndicesCardsSection />
      <IndicesTableSection />
    </main>
  )
}
