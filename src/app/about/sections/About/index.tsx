import { AstraHeader, AstraShootingStar, AstraStar } from '@/components'
import React from 'react'
import Image from 'next/image'

const About = () => {
  return (
    <div className="relative z-20 container w-full py-20">
      <div className="relative sm:mt-0 mt-10 w-full flex flex-col gap-32 justify-center items-center">
        <AstraHeader>About ASTRA DAO</AstraHeader>
        <div className="grid grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6 col-span-full text-justify text-lg">
            Astra DAO is an automated crypto asset allocator, built on Arbitrum
            to provide advanced investment strategies to retail participants.
            The innovative model creates a win-win incentive for index
            investors, creators, and token holders. Astra DAO simplifies passive
            investing for retail participants by providing an array of Crypto
            Indices. Astra DAO aims to help crypto investors compete with
            quantitative investment funds by finding winning investments and
            trades.
          </div>
          <div className="lg:col-span-6 col-span-full">
            <div className="w-full h-full relative">
              <AstraShootingStar
                className="top-[20%] right-[35%]"
                style={{ animationDuration: '3s' }}
              />
              <AstraShootingStar
                className="top-[60%] right-[40%]"
                style={{ animationDuration: '2s' }}
              />
              <AstraShootingStar
                className="top-[30%] right-[30%]"
                style={{ animationDuration: '2s' }}
              />
              <AstraShootingStar
                className="top-[50%] right-[20%]"
                style={{ animationDuration: '4s' }}
              />
              <AstraStar
                className="delay-[2000] right-[25%] top-[40%]"
                style={{ animationDuration: '3s' }}
              />
              <AstraStar
                className="delay-[3000] right-[30%] top-[30%]"
                style={{ animationDuration: '3s' }}
              />
              <AstraStar
                className="delay-[5000] left-[25%] top-[40%]"
                style={{ animationDuration: '3s' }}
              />
              <AstraStar
                className="delay-[4000] left-[32%] top-[30%]"
                style={{ animationDuration: '3s' }}
              />
              <AstraStar
                className="delay-[1000] left-[30%] top-[25%]"
                style={{ animationDuration: '3s' }}
              />
              <Image
                src="/svgs/how-to-buy-astra-banner.svg"
                alt="Astra Banner"
                fill
                className="relative z-20 transform scale-x-[-1]"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6 col-span-full">
            <div className="w-full h-full relative">
              <div className="aspect-video w-full">
                <Image
                  src="/svgs/reward-img.svg"
                  alt="Astra Banner"
                  fill
                  className="relative z-20"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 col-span-full text-justify text-lg flex flex-col justify-center items-center h-full">
            <AstraHeader>THE DAO</AstraHeader>
            <div>
              Astra DAO exists to enable a decentralized ecosystem to foster
              growth and development. The Astra DAO Community Grants Program is
              a decentralized process for the Astra DAO to fund community
              members interested in furthering Astra DAO&apos;s goals and
              vision. Community members with worthwhile activities that can
              foster the community are welcome to submit proposals for
              funding.&nbsp;
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { About }
