import { AstraHeader, AstraLink } from '@/components'
import { Button } from '@/components/shadcn'
import Image from 'next/image'

export default async function AmbassadorsPage() {
  return (
    <main className="min-h-screen">
      <div className="container flex flex-col relative items-center gap-12 pb-20">
        <AstraHeader>BECOME AN AMBASSADOR</AstraHeader>
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-6 flex items-center justify-center h-full">
            <div className=" text-justify text-lg">
              We are constantly looking for people who share our passion and
              vision to elevate investing in crypto. If you can help us reach a
              wider audience, feel free to become our brand ambassador by
              filling out the form below!&nbsp;
            </div>
          </div>
          <div className="col-span-6">
            <div className="w-full relative aspect-video px-6 flex justify-center">
              <div className="w-[80%] relative h-full">
                <Image
                  src="/images/astra-mentors-01.png"
                  alt="Astra Banner"
                  fill
                  className="relative z-20"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-6">
            <div className="w-full relative aspect-video px-6 flex justify-center">
              <div className="w-[80%] h-full relative mx-auto">
                <Image
                  src="/images/astra-mentors-02.png"
                  alt="Astra Banner"
                  fill
                  className="relative z-20"
                />
              </div>
            </div>
          </div>
          <div className="col-span-6 flex flex-col items-center justify-center h-full gap-6">
            <div className="w-full text-left text-3xl font-medium">
              Ambassadors can expect the following:
            </div>
            <ul className=" text-justify text-lg list-disc list-inside">
              <li>
                Compensation paid in $ASTRADAO tokens for good performance
              </li>
              <li>You can create an Index in your name for FREE</li>
              <li>
                Ambassadors only Telegram channel to communicate and collab with
                other content creators
              </li>
              <li>
                You get to be involved in the future of the Astra DAO community
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center">
          <AstraLink link="https://docs.google.com/forms/d/e/1FAIpQLSfivzV1OMnxqO7x4gmWZtg1zuboBCejaCRjirawATIxgIvtsA/viewform">
            <Button variant="astra-blue">Apply Now</Button>
          </AstraLink>
        </div>
      </div>
    </main>
  )
}
