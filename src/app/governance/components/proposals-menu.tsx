'use client'
import { AstraCard, AstraStar } from '@/components'
import { cn } from '@/lib'
import { useMemo } from 'react'
import Image from 'next/image'
import { Separator } from '@/components/shadcn'
import { TargetIcon, ViewGridIcon } from '@radix-ui/react-icons'
import styles from './proposals-menu.module.scss'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  useAstraDecimal,
  useAstraMultiplierDecimal,
  useAstraStakingScoreAndMultiplier,
  useAstraUserInfo,
} from '@/hooks'
import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import { numberFormatter } from '@/util'

type TProposalsMenuProps = { className?: string }

const ProposalsMenu = ({ className }: TProposalsMenuProps) => {
  const currentRoute = usePathname()
  const { address } = useAccount()

  const { data: userInfo } = useAstraUserInfo({})
  const { data: astraStakingScoreAndMultiplier } =
    useAstraStakingScoreAndMultiplier({
      args: !!address && !!userInfo ? [address, userInfo[0]] : undefined,
      enabled: !!address && !!userInfo,
    })
  const { data: astraMultiplierDecimal } = useAstraMultiplierDecimal({})
  const { data: astraDecimal } = useAstraDecimal()

  const numberOfVotes = useMemo(() => {
    if (
      astraDecimal === undefined ||
      astraStakingScoreAndMultiplier === undefined
      // astraStakingScoreAndMultiplier[0] === 0
    ) {
      return 0
    }
    return formatUnits(astraStakingScoreAndMultiplier[0], astraDecimal)
  }, [astraDecimal, astraStakingScoreAndMultiplier])

  const rewardMultiplier = useMemo(() => {
    if (
      astraStakingScoreAndMultiplier === undefined ||
      astraMultiplierDecimal === undefined
    )
      return 1
    try {
      return (
        Number(astraStakingScoreAndMultiplier[1]) /
        Number(astraMultiplierDecimal)
      )
    } catch (err) {
      console.error({ err })
      return 1
    }
  }, [astraMultiplierDecimal, astraStakingScoreAndMultiplier])

  return (
    <AstraCard className={cn('relative', className)}>
      <div className="flex flex-col gap-4 relative w-full">
        <AstraStar className="absolute top-0 left-0" />
        <AstraStar className="absolute top-[20%] left-[5%]" />
        <AstraStar className="absolute top-[10%] right-0" />
        <AstraStar className="absolute top-[40%] right-[10%]" />
        <div className="w-full aspect-square">
          <div className="w-full h-full relative">
            <Image
              src="/svgs/circle-astra.svg"
              alt="Astra Circle"
              fill
              className="z-20 p-8"
            />
          </div>
        </div>
        <Separator className="bg-astra-blue" />
        <div className="">
          <ul className="flex flex-col">
            <Link href="/governance/proposals">
              <li
                className={clsx(
                  styles['proposal-link'],
                  !currentRoute.includes('create')
                    ? styles['proposal-link-active']
                    : ''
                )}
              >
                <div>
                  <ViewGridIcon></ViewGridIcon>
                </div>
                <div>PROPOSALS</div>
              </li>
            </Link>
            <Link href="/governance/proposals/create">
              <li
                className={clsx(
                  styles['proposal-link'],
                  currentRoute.includes('create')
                    ? styles['proposal-link-active']
                    : ''
                )}
              >
                <div>
                  <TargetIcon></TargetIcon>
                </div>
                <div>NEW PROPOSAL</div>
              </li>
            </Link>
          </ul>
        </div>
        <div className="flex justify-between">
          <div>Voting Power</div>
          <div className="font-bold">{numberFormatter(rewardMultiplier)}</div>
        </div>
        <div className="flex justify-between">
          <div>Staking Score</div>
          <div className="font-bold">{numberFormatter(numberOfVotes)}</div>
        </div>
      </div>
    </AstraCard>
  )
}

export { ProposalsMenu }
