'use client'
import { itokenStakingABI } from '@/abis'
import { chainConfig, defaultChain } from '@/config'
import {
  useNetwork,
  useAccount,
  useContractRead,
  UseContractReadConfig,
} from 'wagmi'

type TUserITokenClaimableProps = UseContractReadConfig<
  typeof itokenStakingABI,
  'pendingAstra'
>

export const useITokenAstraClaimable = ({
  ...props
}: TUserITokenClaimableProps) => {
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()

  return useContractRead({
    ...props,
    address: chainConfig[chain!.id].iTokenStakingContractAddress,
    abi: itokenStakingABI,
    functionName: 'pendingAstra',
    args: [address!],
    enabled: !!address,
  })
}
