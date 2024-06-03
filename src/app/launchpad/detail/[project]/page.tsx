import Overview from './components/Overview'
import Content from './components/Content'

type TPage = {
  params: {
    project: string
  }
}

export default async function Page({ params }: TPage) {
  return (
    <div className="container py-16 max-w-full xl:max-w-[1200px] 2xl:max-w-[1400px]">
      <div className="mt-8">
        <Overview />
      </div>
      <div className="mt-12">
        <Content index={params.project} />
      </div>
    </div>
  )
}
