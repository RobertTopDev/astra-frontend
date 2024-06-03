'use client'

import { useState, useEffect } from 'react'
import { AstraCard, AstraHeader, AstraLink } from '@/components'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
  Textarea,
  Checkbox,
} from '@/components/shadcn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import styles from './update-form.module.scss'
import * as z from 'zod'
import {
  TRequestLaunchpadContractInfo,
  TeamObject,
  DateObject,
  RequestLaunchpadResultValues,
} from '@/types'
import { parseUnits } from 'viem'
import {
  useChainConfig,
  useAllowance,
  useRequestLaunchpad,
  useGetBuyRuleLaunchpad,
  useApprove,
  useGetLaunchpadDetail,
} from '@/hooks'
import { useAccount } from 'wagmi'
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons'
import Loading from '@/app/loading'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/shadcn/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/ui/popover'
import { TimeField } from '@/components/astra/time-field'
import _ from 'lodash'

const createIndexFormSchema = z
  .object({
    saleStartDate: z.date({
      required_error: 'Sale start date is required.',
    }),
    saleEndDate: z.date({
      required_error: 'Sale end date is required',
    }),

    tokenAddress: z.string().min(1, {
      message: 'Token Address is required',
    }),
    tokenAmount: z.string().min(1, {
      message: 'Token Amount is required',
    }),
    tokenPrice: z.string().min(1, {
      message: 'Token Price is required',
    }),
    baseAmount: z.string().min(1, {
      message: 'Base Amount is required',
    }),
    tokenDecimals: z.string().min(1, {
      message: 'Token Decimals are required',
    }),
    projectName: z.string().min(1, {
      message: 'Project Name is required',
    }),
    website: z.string().min(1, {
      message: 'Website is required',
    }),
    pitchdeck: z.string().min(1, {
      message: 'Pitchdeck is required',
    }),
    contactName: z.string().min(1, {
      message: 'Contact Name is required',
    }),
    email: z.string().min(1, {
      message: 'Email is required',
    }),
    projectTwitter: z.string().min(1, {
      message: 'Project Twitter is required',
    }),
    contactTelegram: z.string().min(1, {
      message: 'Contact Telegram is required',
    }),
    projectDescription: z.string().min(1, {
      message: 'Project Description is required',
    }),
    tokenSchedule: z.string().min(1, {
      message: 'Token Schedule is required',
    }),
    totalRaised: z.string().min(1, {
      message: 'Total Raised is required',
    }),
    valuableInvestors: z.string().min(1, {
      message: 'Valuable Investors is required',
    }),
    raiseAmount: z.string().min(1, {
      message: 'Raise Amount is required',
    }),
    totalToken: z.string().min(1, {
      message: 'Total Token Price is required',
    }),
    startDate: z.string().min(1, {
      message: 'Start Date is required',
    }),
    ecosystem: z.string().min(1, {
      message: 'Ecosystem is required',
    }),
    teamDescription: z.string().min(1, {
      message: 'Team Description is required',
    }),
    memberAmount: z.string().min(1, {
      message: 'Member Amount is required',
    }),
    communityDescription: z.string().min(1, {
      message: 'Community Description is required',
    }),
    userSize: z.string().min(1, {
      message: 'User Size is required',
    }),
    investmentRound1: z.boolean(),
    stage1: z.string(),
    raisedAmount1: z.string(),
    valuation1: z.string(),
    investRoundInformation: z.string(),
    otherInformation: z.string(),
    deadlineDate: z.string(),
    otherLinks: z.string(),

    marketing: z.string().min(1, {
      message: 'Marketing is required',
    }),
    privateSale: z.string().min(1, {
      message: 'Private Sale is required',
    }),
    ido: z.string().min(1, {
      message: 'IDO is required',
    }),
    liquidity: z.string().min(1, {
      message: 'Liquidity is required',
    }),
    community: z.string().min(1, {
      message: 'Community is required',
    }),
    advisors: z.string().min(1, {
      message: 'Advisors is required',
    }),
    ecosystem_metrics: z.string().min(1, {
      message: 'Ecosystem is required',
    }),
    kosRound: z.string().min(1, {
      message: 'KOS Round is required',
    }),
    team: z.string().min(1, {
      message: 'Team is required',
    }),
    promo: z.string().min(1, {
      message: 'Promo is required',
    }),
  })
  .refine((value) => value.investmentRound1 === false || value.stage1 !== '', {
    path: ['stage1'],
    message: 'stage is required',
  })
  .refine(
    (value) => value.investmentRound1 === false || value.raisedAmount1 !== '',
    {
      path: ['raisedAmount1'],
      message: 'Raised Amount is required',
    }
  )
  .refine(
    (value) => value.investmentRound1 === false || value.valuation1 !== '',
    {
      path: ['valuation1'],
      message: 'Valuation is required',
    }
  )

export type CreateIndexFormValues = z.infer<typeof createIndexFormSchema>

type TPage = {
  params: {
    launchpad_index: string
  }
}
export default function Page({ params }: TPage) {
  const { launchpad_index } = params
  const { data: launchpadDetail, isLoading } =
    useGetLaunchpadDetail(launchpad_index)

  const metrics_info = launchpadDetail
    ? stringToObject(launchpadDetail.METRICS)
    : ({} as { [key: string]: string })

  const [team, setTeam] = useState<TeamObject[]>([
    { name: '', position: '', description: '' },
  ])

  function stringToObject(input: string): { [key: string]: string } {
    const keyValuePairs = input.split(',')
    const result: { [key: string]: string } = {}

    for (const pair of keyValuePairs) {
      const [key, value] = pair.split(':')
      result[key] = value
    }

    return result
  }
  const form = useForm<CreateIndexFormValues>({
    mode: 'onBlur',
    resolver: zodResolver(createIndexFormSchema),
    reValidateMode: 'onBlur',
    values: {
      saleStartDate: launchpadDetail
        ? new Date(launchpadDetail.SALE_START_TIME)
        : new Date(),
      saleEndDate: launchpadDetail
        ? new Date(launchpadDetail.SALE_END_TIME)
        : new Date(),
      tokenAddress: launchpadDetail
        ? launchpadDetail.LAUNCHPAD_TOKEN_ADDRESS
        : '',
      tokenAmount: launchpadDetail?.TOTAL_SALE_AMOUNT.toString() || '',
      tokenPrice: launchpadDetail?.LAUNCHPAD_TOKEN_PRICE.toString() || '',
      baseAmount: launchpadDetail?.MAX_PURCHASE_BASE_AMOUNT.toString() || '',
      tokenDecimals: launchpadDetail?.LAUNCHPAD_TOKEN_DECIMAL.toString() || '',
      projectName: '',
      website: launchpadDetail?.WEBSITE_URL.toString() || '',
      pitchdeck: launchpadDetail?.WHITEPAPER_URL.toString() || '',
      projectDescription: launchpadDetail?.PROJECT_DETAIL.toString() || '',
      contactName: '',
      email: launchpadDetail?.EMAIL.toString() || '',
      projectTwitter: launchpadDetail?.TWITTER.toString() || '',
      contactTelegram: launchpadDetail?.TELEGRAM.toString() || '',
      tokenSchedule: '',
      totalRaised: '',
      valuableInvestors: '',
      raiseAmount: '',
      totalToken: '',

      startDate: '',
      ecosystem: '',
      teamDescription: '',
      memberAmount: '',
      communityDescription: '',
      userSize: '',
      investmentRound1: false,
      stage1: '',
      raisedAmount1: '',
      valuation1: '',
      investRoundInformation: '',
      otherInformation: '',
      deadlineDate: '',
      otherLinks: launchpadDetail?.OTHER_URL.toString() || '',

      marketing: !_.isEmpty(metrics_info) ? metrics_info.Marketing : '',
      privateSale: !_.isEmpty(metrics_info) ? metrics_info['Private Sale'] : '',
      ido: !_.isEmpty(metrics_info) ? metrics_info.IDO : '',
      liquidity: !_.isEmpty(metrics_info) ? metrics_info.Liquidity : '',
      community: !_.isEmpty(metrics_info) ? metrics_info.Community : '',
      advisors: !_.isEmpty(metrics_info) ? metrics_info.Advisors : '',
      ecosystem_metrics: !_.isEmpty(metrics_info) ? metrics_info.Ecosystem : '',
      kosRound: !_.isEmpty(metrics_info) ? metrics_info['KOS Round'] : '',
      team: !_.isEmpty(metrics_info) ? metrics_info.Team : '',
      promo: !_.isEmpty(metrics_info) ? metrics_info.Promo : '',
    },
  })

  function onSubmit(value: z.infer<typeof createIndexFormSchema>) {
    const metrics_keys = [
      'marketing',
      'privateSale',
      'ido',
      'liquidity',
      'community',
      'advisors',
      'ecosystem_metrics',
      'kosRound',
      'team',
      'promo',
    ]
    const result_values: RequestLaunchpadResultValues = {
      data: {},
      team: team,
      metrics: {},
    }

    for (const key in value) {
      if (metrics_keys.includes(key)) {
        result_values.metrics[key] = (value as any)[key]
      } else {
        result_values.data[key] = (value as any)[key]
      }
    }
  }

  const handleAddInput = () => {
    setTeam([...team, { name: '', position: '', description: '' }])
  }
  const handleInputChange = (index: number, value: string, str: string) => {
    const updatedTeam = [...team]
    updatedTeam[index] = { ...updatedTeam[index], [str]: value }
    setTeam(updatedTeam)
  }
  const handleDeleteInpout = () => {
    const deletedTeam: TeamObject[] = [...team]
    deletedTeam.pop()
    setTeam(deletedTeam)
  }

  useEffect(() => {
    if (!launchpadDetail) return
    const team_info = launchpadDetail.TEAM_INFO.split('?')
    const temp_team = []
    for (let i = 0; i < team_info.length / 3; i++) {
      const temp: TeamObject = { name: '', position: '', description: '' }
      let pair = team_info[3 * i].split('=')
      temp['name'] = pair[1]
      pair = team_info[3 * i + 1].split('=')
      temp['position'] = pair[1]
      pair = team_info[3 * i + 2].split('=')
      temp['description'] = pair[1]
      temp_team[i] = temp
      setTeam(temp_team)
    }
  }, [launchpadDetail])

  return (
    <main className="min-h-screen  ">
      <div className="container flex flex-col items-center gap-6 justify-center w-full h-full pb-20 xl:w-1/2">
        <AstraHeader className="text-center w-full">
          IDO Application Update Form
        </AstraHeader>
        <AstraCard className="w-full bg-opacity-80">
          {isLoading ? (
            <Loading />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={clsx(
                  styles['index-form'],
                  'w-full flex flex-col gap-8'
                )}
              >
                <FormField
                  control={form.control}
                  name="tokenAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bitcoin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="saleStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Start Time *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                ' pl-3 text-left font-normal  rounded-full  flex w-full  bg-white text-black items-center focus-within:ring-0 focus-within:ring-offset-1 focus-within:outline-none ring-offset-astra-blue ring-astra-blue',
                                !field.value && 'text-muted-foreground'
                              )}
                              style={{ borderColor: '#00e7ff' }}
                            >
                              {field.value ? (
                                format(field.value, 'PPpp')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            // disabled={(date: any) =>
                            //   date > new Date() || date < new Date('1900-01-01')
                            // }
                            initialFocus
                          />
                          <TimeField
                            // value={state.timeValue}
                            onChange={(event) => {
                              const timeTemp: Date = field.value
                              timeTemp.setHours(event.hour, event.minute)
                              field.onChange(timeTemp)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="saleEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale End Time *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                ' pl-3 text-left font-normal  rounded-full  flex w-full  bg-white text-black items-center focus-within:ring-0 focus-within:ring-offset-1 focus-within:outline-none ring-offset-astra-blue ring-astra-blue',
                                !field.value && 'text-muted-foreground'
                              )}
                              style={{ borderColor: '#00e7ff' }}
                            >
                              {field.value ? (
                                format(field.value, 'PPpp')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            // disabled={(date: any) =>
                            //   date > new Date() || date < new Date('1900-01-01')
                            // }
                            initialFocus
                          />
                          <TimeField
                            // value={state.timeValue}
                            onChange={(event) => {
                              const timeTemp: Date = field.value
                              timeTemp.setHours(event.hour, event.minute)
                              field.onChange(timeTemp)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Amount *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. Bitcoin"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. Bitcoin"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="baseAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Amount *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. Bitcoin"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenDecimals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Decimals *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. Bitcoin"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="bg-gray-400"></Separator>
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bitcoin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project URL *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://project.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pitchdeck"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Whitepaper Link *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://drive.google.com/drive/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Name & Surname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. abc@abc.xyz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectTwitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter handle *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactTelegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram Handle *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. @johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="bg-gray-400"></Separator>

                <FormField
                  control={form.control}
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the project, including the scope of the project and an explanation of how mature the project is."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Token Information - Please provide the links to your
                        token metrics, release schedule, token distribution and
                        use of proceeds spreadsheets. *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://drive.google.com/drive/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalRaised"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        How much have you already raised? (hard commitments) *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="$1,000,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valuableInvestors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Details *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. ABC Capital in Seed with $50k, XYZ Capital in Strategic with $50k"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="raiseAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        How much are you looking to raise with LaunchPad? *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="$500,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Fully Diluted Market Cap AKA Valuation (IDO Token Price
                        X Total Tokens) *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="$30,000,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
              control={form.control}
              name="isFlexible"
              render={() => (
                <FormItem>
                  <FormLabel>Are you flexible with the amounts? *</FormLabel>
                  <br />
                  {isFlexible.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="isFlexible"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            /> */}
                {/* <FormField
              control={form.control}
              name="isFlexible"
              render={() => (
                <FormItem>
                  <FormLabel>Are you flexible with the amounts? *</FormLabel>
                  <br />
                  {isFlexible.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="isFlexible"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            /> */}

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When would you like to launch? *</FormLabel>
                      <FormControl>
                        <Input placeholder="Target Listing Date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ecosystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ecosystem *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the project ecosystem. Explain where the project is hosted, the token to be issued and the grants received."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the story of how the team came together with the relevant experience. LinkedIn links are appreciated."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount of team members *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 10 full-time, 5 part-time, hiring 2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="communityDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe Current Community *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Provide details of what the current community consist of. e.g. 30,000 Twitter followers and 20,000 telegram members."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size of Existing Users *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details of what the current community and user base consist of. e.g. Project currently has 4000 testnet users or project live with $100k TVL from 1000 wallets."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentRound1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Round 1</FormLabel>
                      <br />
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        ></Checkbox>
                      </FormControl>
                      {field.value && (
                        <>
                          <FormField
                            control={form.control}
                            name="stage1"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>1 - Round stage *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Seed" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="raisedAmount1"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  1 - What was the amount raised? *
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. $300,000"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="valuation1"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  1 - What was the post-money valuation? *
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. $1,000,000"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investRoundInformation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Provide any information about previous investment
                        rounds.
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide information about agreements that are in place between investment rounds. "
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherInformation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide any information that helps us understand any expectations that you have."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deadlineDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        When do you want to conduct the sale?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="When uncertain provide deadline date."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherLinks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other links</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://drive.google.com/drive/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* if possible, insert form value */}
                {team.map((input, index) => (
                  <div key={index}>
                    <Separator className="bg-gray-400"></Separator>
                    {index == 0 ? (
                      <div className="text-center w-full mt-6">
                        <FormLabel className="text-2xl text-center">
                          Team Information
                        </FormLabel>
                      </div>
                    ) : (
                      ''
                    )}
                    <FormItem className="my-8">
                      <FormLabel>Team Member Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ayush"
                          value={input['name']}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value, 'name')
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem className="my-8">
                      <FormLabel>Team Member Position *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full stack developer"
                          value={input['position']}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value, 'position')
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem className="mt-8">
                      <FormLabel>Team Member Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="He is a smart contract developer."
                          rows={3}
                          value={input['description']}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              e.target.value,
                              'description'
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                ))}
                <div className="flex flex-wrap gap-3 items-center justify-center">
                  <Button variant="astra-blue" onClick={handleAddInput}>
                    Add
                  </Button>
                  <Button
                    variant="astra-blue"
                    style={{ backgroundColor: 'tomato', border: 'none' }}
                    onClick={handleDeleteInpout}
                  >
                    Delete
                  </Button>
                </div>

                <Separator className="bg-gray-400 "></Separator>
                {/* <div className="text-center w-full mt-6">
                <FormLabel className="text-2xl text-center">
                  Metrics Information
                </FormLabel>
              </div> */}

                <FormField
                  control={form.control}
                  name="marketing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marketing</FormLabel>
                      <FormControl>
                        <Input placeholder="marketing for chart" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="privateSale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Private Sale</FormLabel>
                      <FormControl>
                        <Input placeholder="Private Sale" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IDO</FormLabel>
                      <FormControl>
                        <Input placeholder="IDO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="liquidity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Liquidity</FormLabel>
                      <FormControl>
                        <Input placeholder="liquidity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="community"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community</FormLabel>
                      <FormControl>
                        <Input placeholder="Community" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="advisors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advisors</FormLabel>
                      <FormControl>
                        <Input placeholder="Advisors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ecosystem_metrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ecosystem</FormLabel>
                      <FormControl>
                        <Input placeholder="Ecosystem" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kosRound"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>KOS Round</FormLabel>
                      <FormControl>
                        <Input placeholder="KOS Round" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <FormControl>
                        <Input placeholder="Team" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="promo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promo</FormLabel>
                      <FormControl>
                        <Input placeholder="Promo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="bg-gray-400"></Separator>

                <Button variant="astra-blue" type="submit">
                  Submit Information
                </Button>
              </form>
            </Form>
          )}
        </AstraCard>
      </div>
    </main>
  )
}
