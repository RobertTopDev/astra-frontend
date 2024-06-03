import { Card, CardHeader } from '@/components/shadcn/ui/card'
import Image from 'next/image'

interface Props {
  data: {
    name: string
    desc: string
    position: string
  }
}
export default function TeamCard({ data }: Props) {
  return (
    <div className="stroke-[1px] stroke-white stroke-opacity-0 overflow-hidden relative flex max-w-[400px] items-stretch w-fit m-auto">
      <Card className="relative rounded-3xl bg-[#B2C4E833] p-px border-none">
        <CardHeader>
          <div className="relative self-stretch flex items-stretch justify-between gap-3.5 mt-6">
            <div className="relative">
              <Image
                src="/images/partner.png"
                alt="Astra Logo"
                width={140}
                height={140}
              />
            </div>
            <div className="self-center flex grow basis-[0%] flex-col items-stretch my-auto">
              <div className="text-white text-xl font-black tracking-[2px]">
                {data.position}
              </div>
              <div className="flex gap-4 mt-2">
                <a href="#" aria-label="View">
                  <div className="whitespace-nowrap bg-white justify-center items-stretch px-2 py-1 rounded">
                    <Image
                      src="/svgs/coinex.svg"
                      alt="Astra Logo"
                      width={125}
                      height={125}
                    />
                  </div>
                </a>
                <a href="#" aria-label="View">
                  <div className="whitespace-nowrap bg-white justify-center items-stretch px-2 py-1 rounded">
                    <Image
                      src="/svgs/huobi.svg"
                      alt="Astra Logo"
                      width={125}
                      height={125}
                    />
                  </div>
                </a>
                <a href="#" aria-label="View">
                  <div className="whitespace-nowrap bg-white justify-center items-stretch px-2 py-1 rounded">
                    <Image
                      src="/svgs/linkedin.svg"
                      alt="Astra Logo"
                      width={125}
                      height={125}
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="relative flex w-full flex-col items-stretch p-6">
          <div className="text-white text-xl font-black">{data.name}</div>
          <div className="text-white text-sm mt-4">{data.desc}</div>
        </div>
      </Card>
    </div>
  )
}
