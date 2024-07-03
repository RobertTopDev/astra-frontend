'use client'

import { useState, useEffect, useMemo } from 'react'
import { AstraHeader, AstraLoading } from '@/components'
import {
  Button,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn'
import { useAccount, useNetwork } from 'wagmi'
import {
  useAstraDecimal,
  useAstraStakingScoreAndMultiplier,
  useAstraUserInfo,
  useVerifyMultiplierCrosschain,
} from '@/hooks'
import { formatUnits } from 'viem'
import { AxelarQueryAPI, Environment } from '@axelar-network/axelarjs-sdk'
import { chainConfig, chainToId, idToChain } from '@/config'
import { getCrossChainMultiplier } from '@/util/getCrossChainMultiplier'

const axelarSDK = new AxelarQueryAPI({ environment: Environment.TESTNET })

export default function CrosschainStatus() {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const [gasFee, setGasFee] = useState<string>('')
  const [selectedChain, setSelectedChain] = useState<string>('')
  const [selectedChainMultiplier, setSelectedChainMultiplier] =
    useState<number>(0)
  const [arbitrumMultiplier, setArbitrumMultiplier] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { data: userInfo } = useAstraUserInfo({})

  const { data: stakingScoreAndMultiplier } = useAstraStakingScoreAndMultiplier(
    {
      args: !!address && !!userInfo ? [address, userInfo[0]] : undefined,
      enabled: !!address && !!userInfo,
    }
  )

  const multiplier = useMemo(() => {
    if (stakingScoreAndMultiplier === undefined) return 0
    return Number(formatUnits(stakingScoreAndMultiplier[1], 13))
  }, [stakingScoreAndMultiplier])

  const fetchCrossChainMultiplier = async (
    userAddress: string,
    chainName: string
  ) => {
    const selectedChainId = chainToId[chainName]
    const rpcUrl = chainConfig[selectedChainId].rpcURL
    const contractAddress =
      chainConfig[selectedChainId].CrosschainSaleManagerAddress
    const otherChainMultiplier = await getCrossChainMultiplier(
      rpcUrl,
      contractAddress,
      userAddress
    )
    const formatOtherChainMultiplier = Number(
      formatUnits(otherChainMultiplier, 13)
    )

    return formatOtherChainMultiplier
  }

  const isArbitrumChain = useMemo(() => {
    if (!chain) return false
    const chainName = idToChain[chain.id]
    if (chainName === 'Arbitrum') return true
  }, [chain])

  // Verify Multiplier Cross Chain
  const {
    verifyMultiplierCrosschain,
    error: verifyMultiplierCrsschainError,
    isLoading: verifyMultiplierCrosschainLoading,
  } = useVerifyMultiplierCrosschain({
    enabled: !!address && Number(gasFee) > 0 && !!selectedChain,
    args: [selectedChain, address as `0x${string}`],
    gasFee,
    onSuccessTx: async () => {
      if (address && selectedChain) {
        const result = await fetchCrossChainMultiplier(address, selectedChain)
        setSelectedChainMultiplier(result)
      }
    },
  })

  const onSelectChain = (value: string) => setSelectedChain(value)

  useEffect(() => {
    async function init() {
      if (!selectedChain) return
      setIsLoading(true)
      // get verify multiplier transaction fee from third party
      const axelarResult: any = await axelarSDK.estimateGasFee(
        'arbitrum-sepolia',
        selectedChain,
        BigInt(21000),
        'auto'
      )
      setGasFee(axelarResult.toString())

      // fetch cross chain multiplier from backend
      if (!address) return setIsLoading(false)
      const result = await fetchCrossChainMultiplier(address, selectedChain)
      setSelectedChainMultiplier(result)
      setIsLoading(false)
    }

    init()
  }, [axelarSDK, selectedChain, address])

  useEffect(() => {
    async function init() {
      setIsLoading(true)

      if (!address || isArbitrumChain || !chain) return setIsLoading(false)

      try {
        // fetch current chain info
        const curChain = idToChain[chain.id]
        const result = await fetchCrossChainMultiplier(
          address,
          curChain.toLowerCase()
        )
        setSelectedChainMultiplier(result)

        // fetch arbitrum info
        const arbiResult = await fetchCrossChainMultiplier(
          address,
          chain.id === 421614 ? 'arbitrum-sepolia' : 'arbitrum'
        )
        setArbitrumMultiplier(arbiResult)

        setIsLoading(false)
      } catch (err) {
        console.error(err)
        setIsLoading(false)
      }
    }

    init()
  }, [isArbitrumChain, address, chain])

  return (
    <div className="py-8">
      <div className="text-center">
        <AstraHeader>Cross Chain Staking Status</AstraHeader>
        <h4>Detailed distribution of your score points earned.</h4>
      </div>
      <Card className="w-full relative mt-8 border-0 col-span-1 rounded-3xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl p-16">
        <CardContent className="p-0 items-stretch gap-8">
          <div className="bg-[#B2C4E833] w-full px-6 py-4 flex rounded-lg items-center justify-start">
            <Table>
              <TableHeader className="[&_tr]:border-white :p-2">
                <TableRow className="h-12">
                  <TableHead>
                    {`${
                      (chain && idToChain[chain.id]) ?? 'Arbitrum'
                    } Multiplier`}{' '}
                  </TableHead>
                  <TableHead>Select Chain</TableHead>
                  <TableHead className="capitalize">{`${
                    isArbitrumChain ? selectedChain : 'Arbitrum'
                  } Multiplier`}</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr]:border-0 text-left">
                <TableRow className="h-24">
                  <TableCell>
                    {!isArbitrumChain
                      ? selectedChainMultiplier.toFixed(2)
                      : multiplier.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select
                      disabled={
                        verifyMultiplierCrosschainLoading || !isArbitrumChain
                      }
                      onValueChange={onSelectChain}
                    >
                      <SelectTrigger className="bg-[#FBF8F8] rounded-lg p-4 flex w-full gap-2 h-[36px]">
                        <SelectValue placeholder="Select Chain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Chain</SelectLabel>
                          <SelectItem value="binance">Binance</SelectItem>
                          <SelectItem value="base">Base</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <AstraLoading isLoading={isLoading}>
                      {isArbitrumChain
                        ? selectedChainMultiplier.toFixed(2)
                        : arbitrumMultiplier.toFixed(2)}
                    </AstraLoading>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="astra-blue"
                      className="rounded-lg w-fit"
                      onClick={() => verifyMultiplierCrosschain?.()}
                      isLoading={verifyMultiplierCrosschainLoading || isLoading}
                      disabled={
                        !!verifyMultiplierCrsschainError ||
                        !selectedChain ||
                        selectedChainMultiplier === multiplier ||
                        !isArbitrumChain
                      }
                    >
                      {verifyMultiplierCrosschainLoading || isLoading
                        ? 'Loading...'
                        : isArbitrumChain
                          ? 'Transfer Staking Score'
                          : 'Switch Chain To Arbitrum'}
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
