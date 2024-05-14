'use client'

import { indicesPaymentAbi } from '@/abis'
import { AstraHeader, AstraLink, AstraLoading } from '@/components'
import { chainConfig, defaultChain } from '@/config'
import { useAstraDecimal, useAstraUSDPrice } from '@/hooks'
import React from 'react'
import { formatUnits } from 'viem'
import { useContractRead, useNetwork } from 'wagmi'

const CreateHeader = () => {
  const { chain = defaultChain } = useNetwork()
  const { data: astraAmount, isLoading: loadingAmount } = useContractRead({
    address: chainConfig[chain!.id].IndicesPaymentContractAddress,
    abi: indicesPaymentAbi,
    functionName: 'astraAmount',
  })
  const { data: astraDecimal } = useAstraDecimal()
  const { data: astraUSDPrice, isLoading: astraUSDPriceLoading } =
    useAstraUSDPrice({})

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <AstraHeader>CREATE NEW INDICES</AstraHeader>
      <div className="text-center font-medium tracking-wide">
        Create your index by choosing tokens using the “select a token” button.
        Add a rebalance time, minimum TVL, a name, and the description of your
        index. You are required to pay&nbsp;
        <AstraLoading isLoading={loadingAmount || astraUSDPriceLoading}>
          {!!astraAmount &&
            !!astraDecimal &&
            Number(
              formatUnits(astraAmount?.valueOf(), astraDecimal?.valueOf())
            ).toLocaleString('en-US')}
        </AstraLoading>
        &nbsp; ASTRADAO (
        <AstraLoading isLoading={loadingAmount || astraUSDPriceLoading}>
          {!!astraAmount &&
            !!astraDecimal &&
            !!astraUSDPrice &&
            '$' +
              (
                Number(
                  formatUnits(astraAmount?.valueOf(), astraDecimal?.valueOf())
                ) * astraUSDPrice
              ).toPrecision(5)}
        </AstraLoading>
        ) to complete the index creation process. For an index to be eligible
        for iToken Staking rewards, a governance proposal has to be created and
        passed. Once you create your index, you or any index participant can go
        to the Governance page and&nbsp;
        <AstraLink link="/governance/proposals/create" isPage>
          create a proposal
        </AstraLink>
        &nbsp; to enable staking rewards.
      </div>
    </div>
  )
}

export { CreateHeader }
