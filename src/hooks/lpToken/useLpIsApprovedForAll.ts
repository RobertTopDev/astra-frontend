'use client'
import { nftAbi } from '@/abis/nft-abi'
import { useAccount, useContractRead, UseContractReadConfig } from 'wagmi'
import { useChainConfig } from '..'

type TUseLpIsApprovedForAllProps = UseContractReadConfig<
  typeof nftAbi,
  'isApprovedForAll'
>

export const useLpIsApprovedForAll = ({
  ...props
}: TUseLpIsApprovedForAllProps) => {
  const { chainConfig } = useChainConfig()
  const { address } = useAccount()

  return useContractRead({
    address: chainConfig.uniswapNFTAddress,
    ...props,
    abi: nftAbi,
    functionName: 'isApprovedForAll',
    args: [address!, chainConfig.ChefContractAddress],
    enabled: !!address,
  })
}
