'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import styles from './update-modal.module.scss'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Separator,
} from '@/components/shadcn'
import clsx from 'clsx'
import {
  MetricsObject,
  SaleRoundDetailObject,
  TLaunchpadDetailInfo,
} from '@/types'
import { updateLaunchpadForDB } from '@/util/updateLaunchpadForDB'
import _ from 'lodash'
import TokenDistributeChart, { PieChart } from '../../../chart/'
import { convertUSD } from '@/util'

interface Props {
  data: TLaunchpadDetailInfo | undefined
  refetchData?: () => Promise<void>
}
interface Errors {
  totalMetrics?: string
}

export default function Metrics({ data, refetchData }: Props) {
  const pathname = usePathname()

  const metricsInfoArray = JSON.parse(
    data?.METRICS.replace(/\n/g, '\\n') || '[]'
  )
  const saleRoundDetailInfo = data?.SALE_ROUND_DETAIL
    ? data?.SALE_ROUND_DETAIL.split('<>')
    : []
  const saleRoundDetailInfoArray = saleRoundDetailInfo.map((item) => {
    const pairs = item.split(':')
    const obj: SaleRoundDetailObject = {
      saleType: pairs[3],
      price: parseFloat(pairs[0]),
      raised: parseFloat(pairs[1]),
      lockup: pairs[2],
    }
    return obj
  })

  const [errors, setErrors] = useState<Errors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  const [metrics, setMetrics] = useState<MetricsObject[]>([
    { id: '', label: '', value: 0 },
  ])
  const [saleRoundDetail, setSaleRoundDetail] = useState<
    SaleRoundDetailObject[]
  >([])

  const temp: Record<string, any> = {}
  for (let i = 0; i < metrics.length; i++) {
    temp[`label${i}`] = z.string().min(1, {
      message: 'Category is required.',
    })
    temp[`value${i}`] = z.coerce.number().gte(0).lte(100, {
      message: 'Metrics allocation must be from 0 to 100.',
    })
  }
  for (let i = 0; i < saleRoundDetail.length; i++) {
    temp[`saleType${i}`] = z
      .string()
      .min(1, {
        message: 'Sale type is required.',
      })
      .regex(/^[^<>:]*$/, {
        message: 'Sale type cannot contain less than, greater than, or colon.',
      })
    temp[`price${i}`] = z.coerce.number().gte(0)
    temp[`raised${i}`] = z.coerce.number().gte(0)
    temp[`lockup${i}`] = z
      .string()
      .min(1, {
        message: 'Lockup is required.',
      })
      .regex(/^[^<>:]*$/, {
        message: 'Lockup cannot contain less than, greater than, or colon.',
      })
  }
  const metricsSchema = z.object(temp)

  const metricsDefaultValues: Record<string, any> = {}
  metricsInfoArray.map(
    (item: MetricsObject, key: number) => (
      (metricsDefaultValues[`id${key}`] = item.id.trim()),
      (metricsDefaultValues[`label${key}`] = item.label.trim()),
      (metricsDefaultValues[`value${key}`] = item.value)
    )
  )
  saleRoundDetailInfoArray.map(
    (item, key) => (
      (metricsDefaultValues[`price${key}`] = item.price),
      (metricsDefaultValues[`raised${key}`] = item.raised),
      (metricsDefaultValues[`lockup${key}`] = item.lockup),
      (metricsDefaultValues[`saleType${key}`] = item.saleType)
    )
  )

  const form = useForm<z.infer<typeof metricsSchema>>({
    resolver: zodResolver(metricsSchema),
    delayError: 300,
    reValidateMode: 'onChange',
    defaultValues: metricsDefaultValues,
  })

  useEffect(() => {
    setMetrics(metricsInfoArray)
  }, [data?.METRICS])
  useEffect(() => {
    setSaleRoundDetail(saleRoundDetailInfoArray)
  }, [data?.SALE_ROUND_DETAIL])

  const convertMetricsObjectToString = (metrics: MetricsObject[]) => {
    return metrics
      .map((member: MetricsObject) => {
        return `${member.label}:${member.value}`
      })
      .join(',')
  }
  const convertSaleRoundDetailObjectToString = (
    saleRoundDetail: SaleRoundDetailObject[]
  ) => {
    return saleRoundDetail
      .map((member: SaleRoundDetailObject) => {
        return `${member.price}:${member.raised}:${member.lockup}:${member.saleType}`
      })
      .join('<>')
  }

  async function onSubmit(value: z.infer<typeof metricsSchema>) {
    if (isLoading) {
      alert('Loading')
      return
    }
    let metricsSum = 0
    for (let i = 0; i < metrics.length; i++) {
      metricsSum += value[`value${i}`]
    }
    const temp_errors: Errors = {}
    if (metricsSum !== 100) {
      temp_errors.totalMetrics = `Total Metrics allocation is ${metricsSum}. Must be 100`
      setErrors(temp_errors)
      return
    }
    setIsLoading(true)

    const valueArray: MetricsObject[] = []
    const saleValueArray = []
    for (let i = 0; i < metrics.length; i++) {
      valueArray.push({
        id: value[`label${i}`].replace(/"/g, '\\"').trim(),
        value: value[`value${i}`],
        label: value[`label${i}`].replace(/"/g, '\\"').trim(),
      })
      form.setValue(`label${i}`, value[`label${i}`].trim())
    }
    setMetrics(valueArray)
    for (let i = 0; i < saleRoundDetail.length; i++) {
      saleValueArray.push({
        price: value[`price${i}`],
        raised: value[`raised${i}`],
        lockup: value[`lockup${i}`].replace(/"/g, '\\"').trim(),
        saleType: value[`saleType${i}`].replace(/"/g, '\\"').trim(),
      })
      form.setValue(`price${i}`, value[`price${i}`])
      form.setValue(`raised${i}`, value[`raised${i}`])
      form.setValue(`lockup${i}`, value[`lockup${i}`])
      form.setValue(`saleType${i}`, value[`saleType${i}`])
    }
    setSaleRoundDetail(saleValueArray)

    const requestData = {
      owner: data?.OWNER as `0x${string}`,
      launchpadIndex:
        data?.LAUNCHPAD_INDEX != null ? Number(data?.LAUNCHPAD_INDEX) : null,
      launchpadAddress: data?.LAUNCHPAD_ADDRESS,
      launchpadTokenAddress: data?.LAUNCHPAD_TOKEN_ADDRESS,
      launchpadTokenName: data?.LAUNCHPAD_TOKEN_NAME,
      launchpadTokenSymbol: data?.LAUNCHPAD_TOKEN_SYMBOL,
      launchpadTotalSupply: data?.LAUNCHPAD_TOKEN_TOTAL_SUPPLY, // update
      launchpadTokenDecimal: data?.LAUNCHPAD_TOKEN_DECIMAL,
      launchpadTokenPrice: data?.LAUNCHPAD_TOKEN_PRICE,
      launchpadTokenFDV: data?.LAUNCHPAD_TOKEN_FDV, // update
      totalSaleAmount: data?.TOTAL_SALE_AMOUNT,
      saleStartTime: data?.SALE_START_TIME,
      saleEndTime: data?.SALE_END_TIME,
      minPurchaseBaseAmount: data?.MIN_PURCHASE_BASE_AMOUNT || 0,
      maxPurchaseBaseAmount: data?.MAX_PURCHASE_BASE_AMOUNT,
      softCap: data?.SOFT_CAP, // update
      hardCap: data?.HARD_CAP, // update
      initialMarketCap: data?.INITIAL_MARKET_CAP, // update
      projectValuation: data?.PROJECT_VALUATION, // update
      projectDetail: data?.PROJECT_DETAIL,
      projectDescriptionDetail: data?.PROJECT_DESCRIPTION_DETAIL,
      projectImage: data?.PROJECT_IMAGE,
      leadVCImage: data?.LEAD_VC_IMAGE,
      marketMakerImage: data?.MARKET_MAKER_IMAGE,
      github: data?.GITHUB || '',
      projectDeck: data?.PROJECT_DECK || '',
      medium: data?.MEDIUM || '',
      raised: data?.RAISED || 0,
      // teamInfo: data?.TEAM_INFO,
      teamDescription: data?.TEAM_DESCRIPTION || '',
      metrics: JSON.stringify(valueArray),
      saleRoundDetail:
        saleValueArray.length > 0
          ? convertSaleRoundDetailObjectToString(saleValueArray)
          : '',
      websiteUrl: data?.WEBSITE_URL,
      whitepaperUrl: data?.WHITEPAPER_URL,
      twitter: data?.TWITTER,
      telegram: data?.TELEGRAM,
      discord: data?.DISCORD,
      otherUrl: data?.OTHER_URL,
      email: data?.EMAIL,
      // investorDetail: data?.INVESTOR_DETAIL || '',
      chain: data?.CHAIN,
      requestTransaction: data?.REQUEST_TRANSACTION,
      approveTransaction: data?.APPROVE_TRANSACTION,
      status: data?.STATUS,
      leadVC: data?.LEAD_VC,
      marketMaker: data?.MARKET_MAKER,
      controlledCap: data?.CONTROLLED_CAP,
      daoApprovedMetrics: data?.DAO_APPROVED_METRICS,
      baseToken: data?.BASE_TOKEN,
      tokenType: data?.TOKEN_TYPE,
      isVesting: data?.IS_VESTING,
      vest_start: data?.VEST_START,
      vest_cliff: data?.VEST_CLIFF,
      vest_duration: data?.VEST_DURATION,
      vest_slice_period_seconds: data?.VEST_SLICE_PERIOD_SECONDS,
      vest_initial_unlock: data?.VEST_INITIAL_UNLOCK,
    }
    await updateLaunchpadForDB(requestData, data?.ID + '')
    if (refetchData) {
      refetchData()
    }
    setIsLoading(false)
    setOpen(false)
  }
  const xSymbol = _.map(metrics, 'value')
  const ySymbol = _.map(metrics, 'label')
  const handleAddInput = (str: string) => {
    if (str === 'team') {
      const index = metrics.length
      const values = form.getValues()
      values[`id${index}`] = ''
      values[`label${index}`] = ''
      values[`value${index}`] = ''
      form.reset(values)
      setMetrics([...metrics, { id: '', label: '', value: 0 }])
    } else {
      const index = saleRoundDetail.length
      const values = form.getValues()
      values[`price${index}`] = ''
      values[`raised${index}`] = ''
      values[`lockup${index}`] = ''
      values[`saleType${index}`] = ''
      form.reset(values)
      setSaleRoundDetail([
        ...saleRoundDetail,
        { price: 0, raised: 0, lockup: '', saleType: '' },
      ])
    }
  }
  const handleDeleteInput = (str: string) => {
    if (str === 'team') {
      const index = metrics.length
      const values = form.getValues()
      delete values[`id${index - 1}`]
      delete values[`label${index - 1}`]
      delete values[`value${index - 1}`]
      form.reset(values)
      setMetrics((metrics) => [...metrics.slice(0, -1)])
    } else {
      const index = metrics.length
      const values = form.getValues()
      delete values[`price${index - 1}`]
      delete values[`raised${index - 1}`]
      delete values[`lockup${index - 1}`]
      delete values[`saleType${index - 1}`]
      form.reset(values)
      setSaleRoundDetail((saleRoundDetail) => [...saleRoundDetail.slice(0, -1)])
    }
  }
  const isAdmin = pathname.includes('owner') || pathname.includes('admin')

  return (
    <div>
      {isAdmin ? (
        <div className="mt-2 w-full text-right">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="px-16"
                variant="astra-blue"
                disabled={data?.STATUS === 'approved'}
              >
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[80vh] bg-whiterounded-3xl shadow  bg-[#15192b] text-white  overflow-y-auto overflow-x-auto ">
              <DialogHeader>
                <DialogTitle>Metrics Data Edit</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={clsx(
                    styles['index-form'],
                    'w-full flex flex-col gap-8'
                  )}
                >
                  {metrics.map((input, index) => (
                    <div key={index}>
                      <Separator className="bg-gray-400"></Separator>
                      {index == 0 ? (
                        <div className="text-center w-full mt-6">
                          <FormLabel className="text-2xl text-center">
                            Token Ownership Allocation
                          </FormLabel>
                        </div>
                      ) : (
                        ''
                      )}

                      <FormField
                        control={form.control}
                        name={`label${index}`}
                        render={({ field }) => (
                          <FormItem className="my-8">
                            <FormLabel>Category *</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                placeholder="e.g. Marketing"
                                {...field}
                                onChange={(e) => {
                                  const temp = e
                                  temp.target.value =
                                    temp.target.value.trimStart()
                                  field.onChange(temp)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`value${index}`}
                        render={({ field }) => (
                          <FormItem className="my-8">
                            <FormLabel>Allocation (%) *</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                type="number"
                                placeholder="e.g. 50(%) (Must be positive number between 0 - 100)"
                                {...field}
                                onWheel={(event) => event.currentTarget.blur()}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-3 items-center justify-center">
                    <Button
                      variant="astra-blue"
                      onClick={() => handleAddInput('team')}
                    >
                      Add
                    </Button>
                    <Button
                      variant="astra-blue"
                      style={{ backgroundColor: 'tomato', border: 'none' }}
                      onClick={() => handleDeleteInput('team')}
                      disabled={metrics.length === 1}
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="text-red-500">
                    {errors ? errors.totalMetrics : ''}
                  </div>

                  <Separator className="bg-gray-400"></Separator>

                  <FormLabel className="text-2xl text-center">
                    Sale Round Detail
                  </FormLabel>
                  {saleRoundDetail.map((input, index) => (
                    <div key={index}>
                      {index === 0 ? (
                        <></>
                      ) : (
                        <Separator className="bg-gray-400"></Separator>
                      )}
                      <FormField
                        control={form.control}
                        name={`saleType${index}`}
                        render={({ field }) => (
                          <FormItem className="my-8">
                            <FormLabel>Sale Type *</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                type="string"
                                placeholder="e.g. Private Sale"
                                {...field}
                                onChange={(e) => {
                                  const temp = e
                                  temp.target.value =
                                    temp.target.value.trimStart()
                                  field.onChange(temp)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`price${index}`}
                        render={({ field }) => (
                          <FormItem className="my-8">
                            <FormLabel>Price *</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                type="number"
                                placeholder="e.g. $0.1 (Must be positive number)"
                                {...field}
                                onWheel={(event) => event.currentTarget.blur()}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`raised${index}`}
                        render={({ field }) => (
                          <FormItem className="my-8">
                            <FormLabel>Fund Raised *</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                type="number"
                                placeholder="e.g. 50(%) (Must be positive number between 0 - 100)"
                                {...field}
                                onWheel={(event) => event.currentTarget.blur()}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lockup${index}`}
                        render={({ field }) => (
                          <FormItem className="my-8">
                            <FormLabel>Lock Up</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                placeholder="e.g. 15% at TGE, 1 month cliff and 1.5 years vesting with daily unlocks"
                                {...field}
                                onChange={(e) => {
                                  const temp = e
                                  temp.target.value =
                                    temp.target.value.trimStart()
                                  field.onChange(temp)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-3 items-center justify-center">
                    <Button
                      variant="astra-blue"
                      onClick={() => handleAddInput('partner')}
                    >
                      Add
                    </Button>
                    <Button
                      variant="astra-blue"
                      style={{ backgroundColor: 'tomato', border: 'none' }}
                      onClick={() => handleDeleteInput('partner')}
                      disabled={saleRoundDetail.length === 0}
                    >
                      Delete
                    </Button>
                  </div>
                  {/* <div className="text-red-500">
                    {errors ? errors.totalMetrics : ''}
                  </div> */}

                  <Separator className="bg-gray-400"></Separator>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="astra-blue"
                      isLoading={isLoading}
                      type="submit"
                    >
                      Update
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="astra-blue">
                        Close
                      </Button>
                    </DialogClose>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <></>
      )}

      <p className="text-3xl text-center">Token Ownership Allocation</p>
      {/* {xSymbol.length > 0 ? (
        <div className="token-distribution-chart my-0 mx-auto w-[700px] rounded-3xl p-[0.8px] bg-gradient-to-b from-transparent to-gray-200 shadow-xl mb-12">
          <div className="bg-[#515475] lg:p-18 p-8 rounded-[calc(1.5rem-1px)]">
        <div className="w-[600px] h-[600px] my-0 mx-auto">
          <TokenDistributeChart
            isTitle={true}
            xSymbol={xSymbol}
            ySymbol={ySymbol}
          />
        </div>
      ) : (
        <p className="text-center mt-5">Data provided by project</p>
        </div>
        </div>
        <></>
      )} */}

      <div className="w-[1000px] h-[600px] my-0 mx-auto">
        {/* <TokenDistributeChart
            isTitle={true}
            xSymbol={xSymbol}
            ySymbol={ySymbol}
          /> */}

        <PieChart data={metricsInfoArray} />
      </div>

      {saleRoundDetail.length > 0 ? (
        <div className="sales-round-details lg:p-16 p-4 rounded-3xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl color-white">
          <div className="caption-top pb-8 text-2xl font-bold text-center w-full">
            Sale Round Detail
          </div>
          <div className="mobile:overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead className="text-xl">
                <tr className="border-t-[1px] border-b-[1px] border-white border-opacity-20">
                  <th className="px-4 py-6">Type</th>
                  <th className="px-4 py-6">Price</th>
                  <th className="px-4 py-6">Fundraised</th>
                  <th className="px-4 py-6">Lock-up</th>
                </tr>
              </thead>
              <tbody className="text-lg">
                {saleRoundDetail.map((item, index) => (
                  <tr key={index}>
                    <td className="p-4 pt-6">{item.saleType}</td>
                    <td className="p-4 pt-6">{convertUSD(item.price)}</td>
                    <td className="p-4 pt-6">{convertUSD(item.raised)}</td>
                    <td className="p-4 pt-6">{item.lockup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
