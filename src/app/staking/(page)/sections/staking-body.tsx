import { ChevronRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

const StakingBody = () => {
  return (
    <div className="grid grid-cols-12 gap-12">
      <div className="col-span-6 flex flex-col gap-12 h-full">
        <div className="text-2xl">LEARN HOW TO EARN BONUS ASTRADAO</div>
        <div className="video-container h-full">
          <iframe
            allowFullScreen
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/ImmIKQSHDDM"
          ></iframe>
        </div>
      </div>
      <div className="col-span-6 flex flex-col gap-12">
        <div className="text-2xl">THINGS YOU CAN DO TO EARN BONUS ASTRADAO</div>
        <div className="flex flex-col gap-6 w-full">
          <Link href="/staking/astra">
            <div className="relative cursor-pointer px-12 py-6 w-full flex flex-col bg-gray-400/50 hover:bg-gray-400/30 rounded-lg">
              <div className="text-xl">Stake ASTRADAO</div>
              <div>Stake for longer periods and earn</div>
              <ChevronRightIcon className="w-[2.5rem] h-[2.5rem] absolute right-[48px] top-1/2 transform -translate-y-1/2" />
            </div>
          </Link>
          <Link href="/staking/itoken">
            <div className="relative cursor-pointer px-12 py-6 w-full flex flex-col bg-gray-400/50 hover:bg-gray-400/30 rounded-lg">
              <div className="text-xl">Stake iToken for ASTRADAO</div>
              <div>Gain governance rights and earn</div>
              <ChevronRightIcon className="w-[2.5rem] h-[2.5rem] absolute right-[48px] top-1/2 transform -translate-y-1/2" />
            </div>
          </Link>
          <Link href="/staking/liquidity-mining">
            <div className="relative cursor-pointer px-12 py-6 w-full flex flex-col bg-gray-400/50 hover:bg-gray-400/30 rounded-lg">
              <div className="text-xl">Liquidity Mining</div>
              <div>Provide liquidity and earn</div>
              <ChevronRightIcon className="w-[2.5rem] h-[2.5rem] absolute right-[48px] top-1/2 transform -translate-y-1/2" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export { StakingBody }
