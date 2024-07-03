import { CreateForm } from './sections/create-form'

export default async function CreateIndex() {
  return (
    <main className="min-h-screen  ">
      <div className="container flex flex-col items-center gap-6 justify-center w-full h-full pb-20 xl:w-1/2">
        <CreateForm />
      </div>
    </main>
  )
}
