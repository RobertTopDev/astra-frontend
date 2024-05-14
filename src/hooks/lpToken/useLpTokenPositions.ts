'use client'
import { erc20ABI, useAccount, usePublicClient } from 'wagmi'
import { useChainConfig } from '..'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { TLpPosition, TLpToken } from '@/types'
import { nftAbi } from '@/abis/nft-abi'

type TUseLpTokenPositionsProps = { selectedPair?: TLpToken } & UseQueryOptions<
  TLpPosition[],
  unknown,
  TLpPosition[]
>

export const useLpTokenPositions = ({
  selectedPair,
  ...props
}: TUseLpTokenPositionsProps) => {
  // const { chain = defaultChain } = useNetwork()
  const { chainConfig, chain } = useChainConfig()
  const { address } = useAccount()

  const publicClient = usePublicClient()

  return useQuery<TLpPosition[], unknown, TLpPosition[]>(
    ['lp-positions', chain.id, selectedPair?.poolId, address],
    async () => {
      const positions: TLpPosition[] = []
      if (address === undefined || selectedPair === undefined) return positions
      const totalNfts = await publicClient.readContract({
        address: selectedPair.contractAddress,
        abi: nftAbi,
        functionName: 'balanceOf',
        args: [address],
      })
      const checkedTokens: bigint[] = []
      let index = 0
      for (; index < Number(totalNfts); index++) {
        let tokenId: bigint
        try {
          tokenId = await publicClient.readContract({
            address: chainConfig.uniswapNFTAddress,
            abi: nftAbi,
            functionName: 'tokenOfOwnerByIndex',
            args: [address, BigInt(index)],
          })
        } catch (e) {
          break
        }
        if (checkedTokens.includes(tokenId)) continue
        checkedTokens.push(tokenId)
        const positionDetails = await publicClient.readContract({
          address: chainConfig.uniswapNFTAddress,
          abi: nftAbi,
          functionName: 'positions',
          args: [tokenId],
        })
        const token0Info = await publicClient.readContract({
          address: positionDetails[2],
          abi: erc20ABI,
          functionName: 'name',
        })
        const token1Info = await publicClient.readContract({
          address: positionDetails[3],
          abi: erc20ABI,
          functionName: 'name',
        })
        if (positionDetails[7] === BigInt(0)) continue
        positions.push({
          index,
          positionDetails,
          token0Info,
          token1Info,
          tokenId: Number(tokenId),
          liquidity: Number(positionDetails[7]),
          img2: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
        })
      }
      return positions
    },
    { ...props, enabled: !!selectedPair && !!address }
  )
}
