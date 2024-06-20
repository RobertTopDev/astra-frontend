import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import {
  Progress,
  Card,
  CardHeader,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn'
import {
  ClockIcon,
  HeartIcon,
  BellIcon,
  LockClosedIcon,
  DotFilledIcon,
} from '@radix-ui/react-icons'
import { MiniIdenticon } from '@/components/mini-identicon'
import { TLaunchpadDetailInfo } from '@/types'
import {
  useAllowance,
  useApproveLaunchpad,
  useChainConfig,
  useLaunchpadFactoryInfo,
  useLaunchpadInfo,
  useDeployVestingContract,
  useSetVestingToLaunchpad,
  useDecimals,
} from '@/hooks'
import { formatUnits, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { clsx } from 'clsx'
import { deleteLaunchpadForDB } from '@/util/deleteLaunchpadForDB'
import { convertToCSV } from '@/util/convertToCSV'
import { convertToInternationalCurrencySystem } from '@/util'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/shadcn/ui/button'

type Props = {
  status: string
  launchpadData?: TLaunchpadDetailInfo
  handle?: any
  deleteInUI?: (id: string) => void
}
export default function LiveUpcomingCard({
  status,
  launchpadData,
  handle,
  deleteInUI = () => {},
}: Props) {
  const [loading, setLoading] = useState(false)
  const [remainingTime, setRemainingTime] = useState('00:00:00')
  const [saleStartsIn, setSaleStartsIn] = useState('00:00:00')
  const [vestAddress, setVestAddress] = useState<string>('')
  const { chainConfig } = useChainConfig()
  const { address } = useAccount()

  const tokenArray = [
    {
      symbol: 'USDT',
      address: chainConfig.USDTContractAddress,
    },
    {
      symbol: 'USDC',
      address: chainConfig.USDCContractAddress,
    },
    {
      symbol: 'ETH',
      address: chainConfig.WETHContractAddress,
    },
  ]
  const baseTokenSymbol = tokenArray
    .filter((token) => token.address === launchpadData?.BASE_TOKEN)
    .map((token) => token.symbol)

  // base token decimals
  const { data: baseTokenDecimals, isLoading: baseTokenDecimalsLoading } =
    useDecimals({
      address: launchpadData?.BASE_TOKEN as `0x${string}`,
      enabled: !!launchpadData,
    })

  const launchpadIndexString = launchpadData?.LAUNCHPAD_INDEX
    ? launchpadData.LAUNCHPAD_INDEX.toString()
    : ''
  const { data: factoryData } = useLaunchpadFactoryInfo({
    lIndex: launchpadIndexString,
  })
  const launchpadAddress = useMemo(
    () => factoryData?.[11] ?? launchpadData?.LAUNCHPAD_ADDRESS,
    [factoryData]
  )

  const { data: launchpadContractData } = useLaunchpadInfo({
    launchpad: launchpadAddress as `0x${string}`,
  })

  // get launchpad token allowance to launchpad address
  const { data: tokenAllowance } = useAllowance({
    address: launchpadData?.LAUNCHPAD_TOKEN_ADDRESS as `0x${string}`,
    args: [
      launchpadData?.OWNER as `0x${string}`,
      chainConfig.LaunchpadFactoryContractAddress,
    ],
    enabled:
      !!launchpadData?.OWNER &&
      !!launchpadData?.LAUNCHPAD_TOKEN_ADDRESS &&
      !!chainConfig.LaunchpadFactoryContractAddress,
  })

  const isTokenApproved = useMemo(() => {
    const safeTokenAllowance = tokenAllowance ?? BigInt(0)
    const totalSaleAmount = launchpadData?.TOTAL_SALE_AMOUNT.toString() ?? '0'
    const tokenDecimals = launchpadData?.LAUNCHPAD_TOKEN_DECIMAL ?? 18
    const requiredAmount = parseUnits(totalSaleAmount, tokenDecimals)

    return safeTokenAllowance >= requiredAmount
  }, [
    tokenAllowance,
    launchpadData?.TOTAL_SALE_AMOUNT,
    launchpadData?.LAUNCHPAD_TOKEN_DECIMAL,
  ])

  // approve the requested launchpad for admin
  const {
    approveLaunchpad,
    error: approveLaunchpadError,
    isLoading: approveLaunchpadLoading,
  } = useApproveLaunchpad({
    enabled: isTokenApproved && launchpadData?.LAUNCHPAD_INDEX != null,
    args: [BigInt(launchpadData?.LAUNCHPAD_INDEX ?? 0)],
    onSuccessTx: () => {
      window.location.reload()
    },
  })

  // set vesting address to launchpad contract hook for creator
  const { configureVestAddress, isLoading: setVestAddressLoading } =
    useSetVestingToLaunchpad({
      enabled: !!address && !!launchpadAddress && !!vestAddress,
      args: [launchpadAddress as `0x${string}`, vestAddress as `0x${string}`],
      onSuccessTx: () => {
        setVestAddress('')
        window.location.reload()
      },
    })

  const {
    VEST_START = '',
    VEST_CLIFF,
    VEST_DURATION,
    VEST_SLICE_PERIOD_SECONDS,
    VEST_INITIAL_UNLOCK,
  } = launchpadData ?? {}
  const vestStartSeconds = VEST_START
    ? Math.floor(new Date(VEST_START).getTime() / 1000)
    : 0
  const { deployVestingContract, isLoading } = useDeployVestingContract({
    enabled:
      !!address &&
      !!launchpadData &&
      !!launchpadAddress &&
      !!vestStartSeconds &&
      !!VEST_CLIFF &&
      !!VEST_DURATION &&
      !!VEST_SLICE_PERIOD_SECONDS &&
      !!VEST_INITIAL_UNLOCK,
    args: [
      launchpadData?.LAUNCHPAD_TOKEN_ADDRESS as `0x${string}`,
      launchpadAddress as `0x${string}`,
      BigInt(120),
      launchpadData?.OWNER as `0x${string}`,
      [
        BigInt(vestStartSeconds),
        BigInt(VEST_CLIFF ?? 0), // Fix: Provide a default value of 0 if VEST_CLIFF is undefined
        BigInt(VEST_DURATION ?? 0),
        BigInt(VEST_SLICE_PERIOD_SECONDS ?? 0),
        BigInt(VEST_INITIAL_UNLOCK ?? 0),
      ],
    ],
    onSuccessTx(data) {
      const vestingAddress = data.contractAddress
      setVestAddress(vestingAddress as `0x${string}`)
    },
  })

  const curRaisedAmount = useMemo(() => {
    const tokenAmount = launchpadContractData?.[7]?.result
      ? formatUnits(launchpadContractData[7].result, baseTokenDecimals ?? 18)
      : 0
    return Number(tokenAmount).toFixed(2)
  }, [launchpadContractData])
  const percentageRaised = useMemo(() => {
    const totalSaleAmount = launchpadData?.HARD_CAP
    if (!totalSaleAmount) {
      return 0 // Return 0% if there's no total sale amount
    }
    const percentage = (Number(curRaisedAmount) / totalSaleAmount) * 100

    return percentage
  }, [curRaisedAmount, launchpadData?.TOTAL_SALE_AMOUNT])
  const launchpadStatus = useMemo(() => {
    if (!launchpadData) return 'upcoming'
    else if (
      new Date(launchpadData.SALE_START_TIME + 'Z').getTime() >
      new Date().getTime()
    )
      return 'upcoming'
    else if (
      new Date(launchpadData?.SALE_START_TIME + 'Z').getTime() <=
        new Date().getTime() &&
      new Date(launchpadData.SALE_END_TIME + 'Z').getTime() >=
        new Date().getTime()
    )
      if (launchpadData?.STATUS === 'requested') return 'requested'
      else return 'in progress'
    else return 'ended'
  }, [launchpadData])

  const onExport = () => {
    convertToCSV(launchpadData)
  }
  const onDelete = async (id: string | undefined) => {
    if (!id) return
    setLoading(true)
    await deleteLaunchpadForDB(id)
    deleteInUI(id)
    setLoading(false)
  }
  const adminButton = () => {
    if (launchpadData?.STATUS === 'requested')
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="!px-6 !py-3"
              variant="astra-blue"
              disabled={
                !isTokenApproved || launchpadData?.LAUNCHPAD_INDEX == null
              }
            >
              Approve
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure to approve this requested launchpad?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Smart contract will be called to
                approve the requested launchpad.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => approveLaunchpad?.()}>
                {approveLaunchpadLoading || setVestAddressLoading
                  ? 'Loading'
                  : 'Approve'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    else if (
      launchpadData?.STATUS === 'approved' &&
      !launchpadData.VESTING_DEPLOYED &&
      launchpadData?.IS_VESTING
    )
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="!px-6 !py-3"
              variant="astra-blue"
              disabled={
                !launchpadData?.ID ||
                !deployVestingContract ||
                launchpadData.VESTING_DEPLOYED
              }
            >
              Vesting
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure to click this Vesting button?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Vesting smart contract will be
                deployed and set to the launchpad.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deployVestingContract?.()}>
                {isLoading ? 'Loading' : 'Vesting'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    else <></>
  }
  const pad = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  useEffect(() => {
    let intervalEndId: NodeJS.Timeout
    let intervalStartId: NodeJS.Timeout
    if (launchpadData?.SALE_END_TIME) {
      const updateRemainingTime = () => {
        const endTime = new Date(launchpadData.SALE_END_TIME + 'Z')
        const currentTime = new Date()

        const difference = differenceInSeconds(endTime, currentTime)

        if (difference > 0) {
          const hours = Math.floor(difference / (60 * 60))
          const minutes = Math.floor((difference % (60 * 60)) / 60)
          const seconds = difference % 60
          setRemainingTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
        } else {
          clearInterval(intervalEndId)
          setRemainingTime('00:00:00')
          return
        }
      }

      const updateSaleStartsIn = () => {
        const startTime = new Date(launchpadData.SALE_START_TIME + 'Z')
        const currentTime = new Date()

        const difference = differenceInSeconds(startTime, currentTime)

        if (difference > 0) {
          const hours = Math.floor(difference / (60 * 60))
          const minutes = Math.floor((difference % (60 * 60)) / 60)
          const seconds = difference % 60
          setSaleStartsIn(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
        } else {
          clearInterval(intervalStartId)
          setSaleStartsIn('00:00:00')
          return
        }
      }

      updateRemainingTime()
      updateSaleStartsIn()

      intervalEndId = setInterval(updateRemainingTime, 1000)
      intervalStartId = setInterval(updateSaleStartsIn, 1000)
    }
  }, [launchpadData])
  useEffect(() => {
    if (vestAddress && configureVestAddress) configureVestAddress()
  }, [vestAddress, configureVestAddress])

  return (
    <div className="stroke-[1px] stroke-white stroke-opacity-0 overflow-hidden relative flex max-w-[400px] md:max-w-[500px] items-stretch w-full m-auto">
      <Card className="relative rounded-3xl w-full bg-[#B2C4E833] p-px border-none">
        <CardHeader className="rounded-3xl bg-[#000000] bg-opacity-30">
          <div className="flex justify-between items-center pb-2">
            <div
              className={clsx(
                'text-center flex text-xs font-medium whitespace-nowrap justify-center items-stretch px-3 py-2 rounded-3xl capitalize',
                (launchpadStatus === 'in progress' ||
                  launchpadStatus === 'requested') &&
                  'text-astra-dark-green bg-astra-green',
                launchpadStatus === 'ended' && 'text-[#6b7280] bg-[#f9fafb]',
                launchpadStatus === 'upcoming' &&
                  'text-astra-dark-orange bg-astra-orange'
              )}
            >
              {(launchpadStatus === 'in progress' ||
                launchpadStatus === 'requested') && (
                <DotFilledIcon className="stroke-astra-dark-green" />
              )}
              {launchpadStatus === 'ended' && (
                <DotFilledIcon className="stroke-[#6b7280]" />
              )}
              {launchpadStatus === 'upcoming' && (
                <LockClosedIcon className="stroke-[#7573BC]" />
              )}
              {launchpadStatus}
            </div>
            <div className="flex gap-2">
              <div className="text-xs bg-[#fff] rounded-xl text-[#fff] bg-opacity-15 px-3 py-1">
                {launchpadData?.CHAIN}
              </div>
              <div className="text-xs bg-astra-blue rounded-xl text-astra-blue bg-opacity-15 px-3 py-1">
                Audit
              </div>
              {launchpadData?.STATUS === 'approved' ? (
                <div className="text-xs bg-[#10B93F40] rounded-xl text-[#10B93F] bg-opacity-25 px-3 py-1">
                  KYC
                </div>
              ) : (
                <></>
              )}
              {launchpadData?.IS_VESTING ? (
                <div className="text-xs bg-astra-orange rounded-xl text-astra-dark-orange px-3 py-1">
                  Vesting
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="relative self-stretch flex items-stretch justify-between gap-3.5 mt-6">
            <div className="relative h-14 w-14">
              <MiniIdenticon seed="ddd" image={launchpadData?.PROJECT_IMAGE} />
            </div>
            <div
              className="self-center flex grow basis-[0%] flex-col items-stretch my-auto "
              style={{ width: 'calc(100% - 70px)' }}
            >
              <div
                className="text-white text-xl font-black tracking-[2px]"
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {launchpadData?.LAUNCHPAD_TOKEN_NAME}
              </div>
              <div className="text-white text-sm mt-3.5">
                {1 + ' ' + launchpadData?.LAUNCHPAD_TOKEN_SYMBOL} ={' '}
                {launchpadData?.LAUNCHPAD_TOKEN_PRICE + ` ${baseTokenSymbol}`}
              </div>
            </div>
          </div>
        </CardHeader>
        <div className="relative flex w-full flex-col items-stretch p-6">
          <div className="text-white text-sm font-black">
            Soft Cap - Hard Cap
          </div>
          <div
            className="text-astra-blue text-xl tracking-[2px] mt-2"
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {convertToInternationalCurrencySystem(launchpadData?.SOFT_CAP || 0)}{' '}
            {baseTokenSymbol} -{' '}
            {convertToInternationalCurrencySystem(launchpadData?.HARD_CAP || 0)}{' '}
            {baseTokenSymbol}
          </div>
          <div className="text-white text-sm mt-6">
            Progress ({percentageRaised}
            %)
          </div>

          <Progress value={percentageRaised} className="mt-2" />

          <div
            className="flex items-stretch justify-between mt-2.5"
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <div className="text-white text-sm font-black">
              {Number(curRaisedAmount).toLocaleString('en-US')}{' '}
              {baseTokenSymbol}
            </div>
            <div className="text-white text-right text-sm font-black">
              {Number(launchpadData?.HARD_CAP).toLocaleString('en-US') ?? 0}{' '}
              {baseTokenSymbol}
            </div>
          </div>

          <div className="bg-white shrink-0 h-px mt-5 bg-opacity-30" />

          <div className="flex w-full flex-wrap items-stretch justify-between mt-6">
            <div
              className="flex flex-col items-stretch"
              style={{ minWidth: '140px' }}
            >
              <div className="text-white text-sm font-medium">
                {saleStartsIn === '00:00:00'
                  ? remainingTime === '00:00:00'
                    ? 'Sale Ended At'
                    : 'Sale Ends In'
                  : 'Sale Starts In'}
                :
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="text-astra-blue">
                  <ClockIcon className="stroke-astra-blue" />
                </div>
                <div className="text-white text-md font-semibold tracking-widest grow whitespace-nowrap">
                  {saleStartsIn === '00:00:00'
                    ? remainingTime === '00:00:00'
                      ? launchpadData?.SALE_END_TIME.toString()
                          .split(':')
                          .slice(0, -1)
                          .join(':')
                      : remainingTime
                    : saleStartsIn}
                </div>
              </div>
            </div>
            <div className="gap-2 flex items-center">
              {/* <div>
                <div
                  className={clsx(
                    'bg-white justify-center items-stretch p-3 rounded-3xl  cursor-pointer  hover:bg-astra-blue',
                    launchpadStatus !== 'in progress' && 'invisible'
                  )}
                >
                  <BellIcon className="stroke-[#7573BC]" />
                </div>
              </div> */}
              <div>
                <div
                  className={`
                ${
                  launchpadData?.ID &&
                  JSON.parse(localStorage.getItem('priority') || '[]').includes(
                    launchpadData?.ID
                  )
                    ? 'bg-astra-blue'
                    : 'bg-white'
                } 
               justify-center items-stretch p-3 rounded-3xl cursor-pointer hover:bg-astra-blue`}
                  onClick={() => handle(launchpadData?.ID)}
                >
                  <HeartIcon className="stroke-[#7573BC]" />
                </div>
              </div>
              {launchpadStatus === 'ended' ? (
                <Link href={`/launchpad/buy/${launchpadData?.ID}`}>
                  <div className="text-black text-center text-xs font-medium whitespace-nowrap bg-astra-blue justify-center items-stretch py-3 rounded-3xl px-6">
                    View
                  </div>
                </Link>
              ) : (
                <Link
                  href={`/launchpad/${
                    status === 'admin'
                      ? 'admin/'
                      : status === 'owner'
                        ? 'owner/'
                        : ''
                  }detail/${launchpadData?.ID}`}
                >
                  <div className="text-black text-center text-xs font-medium whitespace-nowrap bg-astra-blue justify-center items-stretch py-3 rounded-3xl px-6">
                    View
                  </div>
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 mt-1 justify-evenly">
            {status === 'admin' ? (
              <>
                {adminButton()}
                <Button
                  className="!px-6 !py-3"
                  variant="astra-blue"
                  onClick={onExport}
                >
                  Export
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="!px-6 !py-3"
                      variant="astra-red"
                      isLoading={loading}
                      disabled={launchpadData?.STATUS === 'approved'}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your project and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        className={cn(
                          buttonVariants({ variant: 'astra-blue' })
                        )}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className={cn(buttonVariants({ variant: 'astra-red' }))}
                        onClick={() => onDelete(launchpadData?.ID)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Card>

      {status === 'coming-soon' && launchpadStatus === 'upcoming' && (
        <div className="bg-black rounded-3xl bg-opacity-70 z-20 absolute w-full h-full flex justify-center items-center">
          <p className="text-xl text-center">Coming Soon</p>
        </div>
      )}
    </div>
  )
}
