import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/shadcn'

export default function NotFound() {
  return (
    <main className="min-h-screen h-full w-full items-center justify-center flex flex-col gap-6 transform -translate-y-[7rem]">
      <div className="w-[512px] h-[420px] flex relative">
        <Image
          src="/images/404-not-found.png"
          alt="Astra 404 Not Found"
          fill
          className="relative z-20 transform"
        />
      </div>
      <h2 className="text-3xl font-bold">404 - Page Not Found</h2>
      <p className="w-full max-w-[580px] text-center">
        We looked everywhere but couldn&apos;t find the page you were looking
        for. Are you sure the URL is correct?
      </p>
      <div className="flex flex-col items-center gap-2">
        <Link href="/">
          <Button variant="astra-blue">Back to Home</Button>
        </Link>
      </div>
    </main>
  )
}
