import { chainConfig } from '@/config'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import {
  arbitrum,
  polygonMumbai,
  arbitrumSepolia,
  bscTestnet,
  base,
  Chain,
} from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

const chainList: Chain[] =
  process.env.NEXT_PUBLIC_NETWORK === 'testnet'
    ? [arbitrumSepolia, bscTestnet, polygonMumbai]
    : [arbitrum, base]

const { chains, publicClient, webSocketPublicClient } = configureChains(
  chainList,
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        webSocket: chainConfig[chain.id].chainStackWS,
        http: chainConfig[chain.id].chainStackHTTPS,
      }),
    }),
    publicProvider(),
  ],
  { pollingInterval: 10_000, rank: true }
)

const { connectors } = getDefaultWallets({
  appName: 'Astra DAO',
  chains,
  projectId: '7f8cb052248fb68ed79a97d91e38f795',
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }
