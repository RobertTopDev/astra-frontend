'use client'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

type Token =
  | {
      decimals: string
      id: `0x${string}`
      lastPriceUSD: string
      name: string
      symbol: string
      _totalSupply: string
      _totalValueLockedUSD: string
    }
  | undefined

type TUseTokenDetailProps = {
  contractAddress?: `0x${string}`
} & UseQueryOptions<{ data: { token: Token } }, unknown, Token>

const useTokenDetail = ({ contractAddress }: TUseTokenDetailProps) => {
  return useQuery<{ data: { token: Token } }, unknown, Token>(
    ['token-detail', contractAddress],
    async () => {
      const query = `{
            token(id: "${contractAddress}"){
              id
              name
              decimals
              symbol
              _totalSupply
              _totalValueLockedUSD
              lastPriceUSD
            }
          }`
      const res = await fetch(
        'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum',
        {
          method: 'POST',
          body: JSON.stringify({ query }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        return { data: { token: undefined } }
      }

      return res.json() as Promise<{ data: { token: Token } }>
    },
    {
      select: (data) => data.data.token,
    }
  )
}

export { useTokenDetail }
