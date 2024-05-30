import { Card, CardHeader } from '@/components/shadcn/ui/card'
import Image from 'next/image'
import { TeamObject } from '@/types'
import Link from 'next/link'

interface Props {
  data: TeamObject
}
export default function TeamCard({ data }: Props) {
  return (
    <div className="stroke-[1px] stroke-white stroke-opacity-0 overflow-hidden relative flex items-stretch m-auto w-full h-full">
      <Card className="relative rounded-3xl bg-[#B2C4E833] p-px border-none w-full h-full">
        <CardHeader>
          <div className="relative self-stretch flex items-stretch justify-center gap-3.5 mt-6 flex-wrap">
            <div
              className="relative"
              style={{ width: '100px', maxHeight: '100px' }}
            >
              <Image
                src={
                  data?.avatar === 'undefined'
                    ? '/images/partner.png'
                    : data?.avatar || '/images/partner.png'
                }
                alt="Astra Logo"
                width={140}
                height={140}
              />
            </div>
            <div className="self-center flex grow basis-[0%] flex-col items-stretch my-auto gap-2">
              <div className="text-white text-xl text-center font-black tracking-[2px]">
                {data.position}
              </div>
              <div className="flex gap-4 mt-2 justify-center">
                {data?.linkedin && (
                  <Link href={data?.linkedin} aria-label="View">
                    <div
                      className="whitespace-nowrap flex bg-white justify-center items-center p-2 rounded"
                      style={{
                        // borderRadius: '50%',
                        height: '40px',
                        width: '40px',
                      }}
                    >
                      <Image
                        src="/svgs/linkedin_blue.svg"
                        alt="Astra Logo"
                        width={25}
                        height={25}
                      />
                    </div>
                  </Link>
                )}
                {data?.twitter && (
                  <Link href={data?.twitter} aria-label="View">
                    <div
                      className="whitespace-nowrap flex bg-white justify-center items-center p-2 rounded"
                      style={{
                        // borderRadius: '50%',
                        height: '40px',
                        width: '40px',
                      }}
                    >
                      <Image
                        src="/svgs/twitter_logo.svg"
                        alt="Astra Logo"
                        width={25}
                        height={25}
                      />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="relative flex w-full flex-col items-stretch p-6">
          <div className="text-white text-xl font-black">{data.name}</div>
          <pre className="text-white text-sm mt-4 text-wrap">{data.description}</pre>
        </div>
      </Card>
    </div>
  )
}
