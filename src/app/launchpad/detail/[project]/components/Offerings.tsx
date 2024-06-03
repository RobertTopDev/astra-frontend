import { InfoCircledIcon } from '@radix-ui/react-icons'
import { useRouter, usePathname } from 'next/navigation'

export default function Offering() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-4">
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex justify-between">
          Astra stakers offering starts in:
          <InfoCircledIcon />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-2xl">Coming Soon</div>
          <div
            className="text-black text-center rounded-xl cursor-pointer px-8 py-2 bg-gradient-to-r from-[#00E7FF] to-[#28E7FD] border-astra-blue bg-opacity-15"
            onClick={() =>
              router.push(`/launchpad/buy/${pathname.split('/')[3]}`)
            }
          >
            Participate
          </div>
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex justify-between">
          Pucca Family Ecosystem Public rounds ends in:
          <InfoCircledIcon />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-2xl">TBA</div>
          <div
            className="text-black text-center rounded-xl cursor-pointer px-8 py-2 bg-gradient-to-r from-[#00E7FF] to-[#28E7FD] border-astra-blue bg-opacity-15"
            onClick={() => router.push('/launchpad/buy/1')}
          >
            Participate
          </div>
        </div>
      </div>
    </div>
  )
}
