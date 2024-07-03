import { Button } from '@/components/shadcn'
import React from 'react'
import Image from 'next/image'
import { AstraLink, AstraShootingStar, AstraStar } from '@/components'

const HowToBuyInfo = () => {
  return (
    <>
      <div className="z-20 container py-20 mx-auto w-full overflow-x-clip">
        <div className="grid grid-cols-12">
          <div className="lg:col-span-6 col-span-full">
            <div className="w-full h-full relative">
              <AstraShootingStar
                isRight
                className="top-[20%] left-[35%]"
                style={{ animationDuration: '3s' }}
              />
              <AstraShootingStar
                isRight
                className="top-[60%] left-[40%]"
                style={{ animationDuration: '2s' }}
              />
              <AstraShootingStar
                isRight
                className="top-[30%] left-[30%]"
                style={{ animationDuration: '2s' }}
              />
              <AstraShootingStar
                isRight
                className="top-[50%] left-[20%]"
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
                className="relative z-20"
              />
            </div>
          </div>
          <div className="flex flex-col gap-12 lg:col-span-6 col-span-full relative z-20">
            <div className="text-lg text-justify">
              ASTRADAO is available through any Ethereum-based decentralized
              exchanges (DEXs) like&nbsp;
              <AstraLink link="https://app.uniswap.org/#/swap?inputCurrency=0x7486620D5c4505f315E4E3b4Da102afBFAcE753C&outputCurrency=0x68A27491Efe143D86cA2EA65B21Cc45997447E4e">
                Uniswap
              </AstraLink>
              ,&nbsp;
              <AstraLink link="https://app.sushi.com/swap?inputCurrency=0x7486620D5c4505f315E4E3b4Da102afBFAcE753C&outputCurrency=0x68A27491Efe143D86cA2EA65B21Cc45997447E4e">
                Sushiswap
              </AstraLink>
              ,&nbsp;centralized exchange&nbsp;
              <AstraLink link="https://www.mexc.com/exchange/ASTRADAO_USDT?_from=search_spot_trade">
                MEXC
              </AstraLink>
              , as well as decentralized exchange aggregators like&nbsp;
              <AstraLink link="https://app.1inch.io/">1inch Exchange</AstraLink>
              . <br /> <br /> We recommend the use of&nbsp;
              <AstraLink link="https://app.1inch.io/">1inch</AstraLink> because
              it finds the best prices across several DEXs. However, do your
              research to ensure it’s safe and secure!&nbsp;
            </div>
            <div>
              <AstraLink link="https://app.uniswap.org/#/swap?inputCurrency=0x7486620D5c4505f315E4E3b4Da102afBFAcE753C&outputCurrency=0x68A27491Efe143D86cA2EA65B21Cc45997447E4e">
                <Button className="px-16" variant="astra-blue">
                  BUY ASTRADAO
                </Button>
              </AstraLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { HowToBuyInfo }
