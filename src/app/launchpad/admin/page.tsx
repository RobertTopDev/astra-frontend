import Image from 'next/image'
import LiveUpcoming from './components/LiveUpcoming'

export default function Page() {
  return (
    <div className="container py-16 max-w-full xl:max-w-[1200px] 2xl:max-w-[1400px]">
      <header className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div className="flex flex-col items-stretch w-[55%] max-md:w-full max-md:ml-0">
          <div className="flex flex-col items-stretch my-auto px-5 max-md:max-w-full max-md:mt-10">
            <h1 className="text-white text-2xl font-medium tracking-[2.5px] uppercase max-md:max-w-full">
              AstraDao Launchpad For Admin
            </h1>
            <p className="text-white text-base leading-6 tracking-wide mt-8 max-md:max-w-full">
              Providing exceptional projects and fostering confidence in the
              Decentralized launchpad space.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-stretch w-[45%] ml-5 max-md:w-full max-md:ml-0">
          <Image
            loading="lazy"
            src="/svgs/launchpad/astra-stars.svg"
            alt="launchpad"
            className="aspect-[1.47] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-10"
            width={500}
            height={500}
          />
        </div>
      </header>
      <div className="border white w-full"></div>
      <LiveUpcoming status="requested" />
    </div>
  )
}
