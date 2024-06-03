import { AstraHeader, AstraCard } from '@/components'

export default function MoreStep() {
  return (
    <div className="flex flex-col items-stretch py-8">
      <div className="flex justify-center">
        <AstraHeader>More Than a Launchpad</AstraHeader>
      </div>
      <div className="w-full grid grid-cols-12 lg:gap-16 gap-y-32 mt-20">
        <AstraCard
          className="lg:col-span-4 col-span-full w-fit min-w-0 bg-[#B2C4E833] border-none"
          image="/svgs/invest.svg"
          alt="Invest in an Index"
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <div className="text-[4rem]">1</div>
              <div className="text-2xl">Invest in an Index</div>
            </div>
            <div className="font-normal text-lg text-justify">
              Find winning indices and buy, vesting, liquidity lock, and other
              token solutions.
            </div>
          </div>
        </AstraCard>
        <AstraCard
          className="lg:col-span-4 col-span-full w-fit min-w-0 bg-[#B2C4E833] border-none"
          image="/svgs/circle-astra.svg"
          alt="Stake Astra"
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <div className="text-[4rem]">2</div>
              <div className="text-2xl">Stake Astra</div>
            </div>
            <div className="font-normal text-lg text-justify">
              Maximize yield by staking ASTRADAO
            </div>
          </div>
        </AstraCard>
        <AstraCard
          className="lg:col-span-4 col-span-full w-fit min-w-0 bg-[#B2C4E833] border-none"
          image="/svgs/governance.svg"
          alt="Governance"
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <div className="text-[4rem]">3</div>
              <div className="text-2xl">Governance </div>
            </div>
            <div className="font-normal text-lg text-justify whitespace-normal">
              Join the Astra DAO and participate in ecosystem governance.
            </div>
          </div>
        </AstraCard>
      </div>
    </div>
  )
}
