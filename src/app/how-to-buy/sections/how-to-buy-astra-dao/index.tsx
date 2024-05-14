'use client'
import { AstraCard, AstraHeader, AstraLink } from '@/components'
import { useChainConfig } from '@/hooks'
import { shorten } from '@/util'
import React from 'react'

const HowToBuyAstraDao = () => {
  const { chainConfig, chain } = useChainConfig()
  return (
    <div className="relative z-20 container w-full py-20">
      <div className="relative sm:mt-0 mt-10 w-full flex flex-col gap-32 justify-center items-center">
        <AstraHeader>HOW TO BUY ASTRADAO</AstraHeader>
        <div className="w-full grid grid-cols-12 lg:gap-16 gap-y-32">
          <AstraCard
            className="lg:col-span-4 col-span-full w-fit min-w-0"
            image="/svgs/create-wallet.svg"
            alt="Create Wallet"
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <div className="text-[4rem]">1</div>
                <div className="text-2xl">Create a Digital Wallet</div>
              </div>
              <div className="font-normal text-lg text-justify">
                Create a digital wallet like&nbsp;
                <AstraLink link="https://metamask.io">MetaMask</AstraLink> using
                either a desktop computer or an iOS/Android mobile device. That
                will allow you to buy, sell, send, and receive ASTRADAO.
              </div>
            </div>
          </AstraCard>
          <AstraCard
            className="lg:col-span-4 col-span-full min-w-0"
            image="/svgs/add-eth.svg"
            alt="Create Wallet"
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <div className="text-[4rem]">2</div>
                <div className="text-2xl">Add ETH to Your Wallet</div>
              </div>
              <div className="font-normal text-lg text-justify">
                You can buy Ethereum (ETH) directly on some wallets like&nbsp;
                <AstraLink link="https://metamask.io">MetaMask</AstraLink> or
                transfer it to your wallet from Ethereum-based centralized or
                decentralized exchanges (DEXs) like&nbsp;
                <AstraLink link="https://app.uniswap.org/#/swap?inputCurrency=0x7486620D5c4505f315E4E3b4Da102afBFAcE753C&outputCurrency=0x68A27491Efe143D86cA2EA65B21Cc45997447E4e">
                  Uniswap
                </AstraLink>
                &nbsp; and&nbsp;
                <AstraLink link="https://app.sushi.com/swap?inputCurrency=0x7486620D5c4505f315E4E3b4Da102afBFAcE753C&outputCurrency=0x68A27491Efe143D86cA2EA65B21Cc45997447E4e">
                  Sushiswap
                </AstraLink>
                .
                <br /> <br /> Pro tip: Be sure to use the Arbitrum network when
                transferring ETH.&nbsp;
              </div>
            </div>
          </AstraCard>
          <AstraCard
            className="lg:col-span-4 col-span-full min-w-0"
            image="/svgs/swap-eth-to-astra.svg"
            imageClassName="w-[7rem]"
            alt="Create Wallet"
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <div className="text-[4rem]">3</div>
                <div className="text-2xl">Swap ETH for ASTRADAO </div>
              </div>
              <div className="font-normal text-lg text-justify whitespace-normal">
                Start swapping as soon as you get your ETH! Click ‘Select a
                token’ and enter:&nbsp;
              </div>
              <ul className="list-disc pl-[3rem] whitespace-normal text-lg">
                <li>
                  ASTRADAO’s contract address&nbsp;
                  {/* TODO: add link to multi chains */}
                  <AstraLink
                    link={`${chain?.blockExplorers?.default.url}/address/${chainConfig.AstraContractAddress}`}
                  >
                    {shorten(`${chainConfig.AstraContractAddress}`)}
                  </AstraLink>
                </li>
                <li>
                  Token symbol <span className="text-astra-gold">ASTRADAO</span>
                </li>
                <li>
                  Decimals of precision&nbsp;
                  <span className="text-astra-gold">18</span>
                </li>
              </ul>
            </div>
          </AstraCard>
        </div>
      </div>
    </div>
  )
}

export { HowToBuyAstraDao }
