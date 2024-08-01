import { AstraLoading } from '@/components'
import {
  chainToId,
  mainChainToId,
  tokenDecimal,
  chainConfig as defaultChainConfig,
} from '@/config'
import { useGetTotalRaisedAmount } from '@/hooks'
import { TLaunchpadDetailInfo } from '@/types'
import { useMemo } from 'react'
import { formatUnits } from 'viem'

type Props = {
  index: TLaunchpadDetailInfo
}

export const TotalRaised = ({ index }: Props) => {
  const baseTokenDecimals = useMemo(() => {
    return tokenDecimal[index?.BASE_TOKEN as string]
  }, [index])
  const convertChainName = useMemo(() => {
    return process.env.NEXT_PUBLIC_NETWORK === 'testnet' &&
      index?.CHAIN === 'Arbitrum'
      ? 'arbitrum-sepolia'
      : index?.CHAIN?.toLowerCase() ?? 'binance'
  }, [index])
  const selectedChainId = useMemo(() => {
    return process.env.NEXT_PUBLIC_NETWORK === 'testnet'
      ? chainToId[convertChainName]
      : mainChainToId[convertChainName]
  }, [convertChainName])
  const rpcUrl = defaultChainConfig[selectedChainId].rpcURL

  const { data: raisedAmount, isLoading: raisedAmountLoading } =
    useGetTotalRaisedAmount({
      rpcUrl,
      launchpadAddress:
        index.LAUNCHPAD_ADDRESS &&
        index.LAUNCHPAD_ADDRESS !== '0x0000000000000000000000000000000000000000'
          ? index.LAUNCHPAD_ADDRESS
          : '',
    })
  const curRaisedAmount = useMemo(() => {
    const tokenAmount = formatUnits(
      BigInt(raisedAmount || '0'),
      baseTokenDecimals ?? 18
    )
    return Number(tokenAmount).toFixed(2)
  }, [raisedAmount])

  return (
    <AstraLoading isLoading={raisedAmountLoading && raisedAmount != undefined}>
      <div className="w-fit">
        $
        {raisedAmount == undefined
          ? 0
          : Number(curRaisedAmount).toLocaleString('en-US')}{' '}
      </div>
    </AstraLoading>
  )
}
