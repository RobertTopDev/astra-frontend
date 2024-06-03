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
import styles from './create-form.module.scss'
import * as z from 'zod'
import {
  TRequestLaunchpadContractInfo,
  TeamObject,
  RequestLaunchpadResultValues,
} from '@/types'
import { parseUnits } from 'viem'
import {
  useChainConfig,
  useAllowance,
  useRequestLaunchpad,
  useGetBuyRuleLaunchpad,
  useApprove,
} from '@/hooks'
import { useAccount } from 'wagmi'
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons'

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

// const isFlexible = [
//   {
//     id: 'answer 1',
//     label: 'answer 1',
//   },
//   {
//     id: 'answer 2',
//     label: 'answer 2',
//   },
// ] as const

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
    // isFlexible: z
    //   .array(z.string())
    //   .refine((value) => value.some((item) => item), {
    //     message: ' You must select one',
    //   }),
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
    // indexSymbol: z.string({ required_error: 'Index symbol is required' }),

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

const CreateForm = () => {
  const [contractData, setContractData] =
    useState<TRequestLaunchpadContractInfo>({
      tokenAddress: '' as `0x${string}`,
      saleStartTime: 0,
      saleEndTime: 0,
      tokenAmount: '',
      tokenPrice: '',
      baseAmount: '',
      tokenDecimals: '',
    })
  const [databaseData, setDatabaseData] =
    useState<RequestLaunchpadResultValues>()
  const [team, setTeam] = useState<TeamObject[]>([
    { name: '', position: '', description: '' },
  ])

  const [isTokenApproved, setIsTokenApproved] = useState<boolean>(false)
  const [isRequested, setIsRequested] = useState<boolean>(false)

  const { address } = useAccount()
  const { chainConfig } = useChainConfig()

  const form = useForm<CreateIndexFormValues>({
    mode: 'onBlur',
    resolver: zodResolver(createIndexFormSchema),
    reValidateMode: 'onBlur',
    // delayError: 750,
    defaultValues: {
      tokenAddress: contractData.tokenAddress,
      tokenAmount: contractData.tokenAmount,
      tokenPrice: contractData.tokenPrice,
      baseAmount: contractData.baseAmount,
      tokenDecimals: contractData.tokenDecimals,
      // isFlexible: ['answer 1'],
      investRoundInformation: '',
      otherInformation: '',
      deadlineDate: '',
      otherLinks: '',
      investmentRound1: false,
      stage1: '',
      raisedAmount1: '',
      valuation1: '',
      projectName: '',
      website: '',
      pitchdeck: '',
      contactName: '',
      email: '',
      projectTwitter: '',
      contactTelegram: '',
      tokenSchedule: '',
      totalRaised: '',
      raiseAmount: '',
      totalToken: '',
      startDate: '',
      memberAmount: '',
      marketing: '',
      privateSale: '',
      ido: '',
      liquidity: '',
      community: '',
      advisors: '',
      ecosystem_metrics: '',
      kosRound: '',
      team: '',
      promo: '',
    },
  })

  // get launchpad token allowance to launchpad address
  const { data: tokenAllowance, isLoading: tokenAllowanceLoading } =
    useAllowance({
      address: contractData.tokenAddress,
      args: [
        address as `0x${string}`,
        chainConfig.LaunchpadFactoryContractAddress,
      ],
      enabled:
        !!address &&
        !!contractData.tokenAddress &&
        !!chainConfig.LaunchpadFactoryContractAddress,
    })

  // const { data: buyRuleStatus, isLoading: buyRuleStatusLoading } =
  //   useGetBuyRuleLaunchpad() // [0]: whitelisted result

  // request launchpad after approve
  const { requestLaunchpad } = useRequestLaunchpad({
    enabled:
      !!contractData.tokenAddress &&
      !!contractData.saleStartTime &&
      !!contractData.saleEndTime &&
      !!contractData.tokenPrice &&
      !!contractData.tokenAmount &&
      !!contractData.baseAmount &&
      !!contractData.tokenDecimals &&
      databaseData !== undefined &&
      team.length > 0,
    args: [
      contractData.tokenAddress as `0x${string}`,
      BigInt(contractData.saleStartTime),
      BigInt(contractData.saleEndTime),
      parseUnits(
        contractData.tokenPrice || '0',
        13 // multiplier
      ),
      BigInt(
        parseUnits(
          contractData.tokenAmount || '0',
          Number(contractData.tokenDecimals)
        )
      ),
      BigInt(parseUnits(contractData.baseAmount || '0', 6)), // USDC decimal
    ],
    databaseData: databaseData ?? undefined,
    onSuccessTx: () => {
      setIsRequested(true)
      // reset form
    },
  })
  // APPROVE
  const { approve } = useApprove({
    address: contractData.tokenAddress as `0x${string}`,
    minAmount: contractData.tokenDecimals
      ? parseUnits(
          databaseData?.data.tokenAmount ?? '0',
          Number(contractData.tokenDecimals)
        )
      : 0,
    enabled:
      !!contractData.tokenAddress &&
      Number(databaseData?.data.tokenAmount) > 0 &&
      Number(contractData?.tokenDecimals) > 0 &&
      tokenAllowance !== undefined &&
      contractData.tokenDecimals !== undefined &&
      !!requestLaunchpad,
    spender: chainConfig.LaunchpadFactoryContractAddress as `0x${string}`,
    onSuccessTx: () => {
      setIsTokenApproved(true)
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
    const startTime =
      new Date(result_values.data.saleStartDate).getTime() / 1000
    const endTime = new Date(result_values.data.saleEndDate).getTime() / 1000
    // set database data
    setDatabaseData({
      ...databaseData,
      ...result_values,
    })
    // set contract data
    setContractData({
      ...contractData,
      tokenAddress: value.tokenAddress as `0x${string}`,
      tokenPrice: value.tokenPrice,
      tokenAmount: value.tokenAmount,
      baseAmount: value.baseAmount,
      tokenDecimals: value.tokenDecimals,
      saleStartTime: startTime,
      saleEndTime: endTime,
    })
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
    if (
      ((tokenAllowance !== undefined &&
        tokenAllowance <
          parseUnits(
            contractData.tokenAmount.toString() || '0',
            Number(contractData.tokenDecimals)
          )) ||
        isTokenApproved) &&
      isRequested
    )
      return

    if (
      !!contractData &&
      !!databaseData &&
      approve &&
      tokenAllowance !== undefined
    ) {
      if (
        tokenAllowance <
          parseUnits(
            contractData.tokenAmount.toString() || '0',
            Number(contractData.tokenDecimals)
          ) &&
        !isTokenApproved
      )
        approve()
      else requestLaunchpad && requestLaunchpad()
    }
  }, [contractData, databaseData, approve, requestLaunchpad, tokenAllowance])

  return (
    <>
      <AstraHeader className="text-center w-full">
        IDO Application Create Form
      </AstraHeader>
      <AstraCard className="w-full bg-opacity-80">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={clsx(styles['index-form'], 'w-full flex flex-col gap-8')}
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
                    Token Information - Please provide the links to your token
                    metrics, release schedule, token distribution and use of
                    proceeds spreadsheets. *
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
                    Fully Diluted Market Cap AKA Valuation (IDO Token Price X
                    Total Tokens) *
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
                              <Input placeholder="e.g. $300,000" {...field} />
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
                              <Input placeholder="e.g. $1,000,000" {...field} />
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
                    Provide any information about previous investment rounds.
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
                  <FormLabel>When do you want to conduct the sale?</FormLabel>
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
            {/* <FormField
              control={form.control}
              name="isFlexible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Have you engaged with Centralised Exchanges?
                  </FormLabel>
                  <br />
                  <FormControl>
                    <Checkbox
                      onClick={() => {
                        setInvestmentRound4(true)
                      }}
                    ></Checkbox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFlexible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Have you engaged with Market Makers?</FormLabel>
                  <br />
                  <FormControl>
                    <Checkbox
                      onClick={() => {
                        setInvestmentRound4(true)
                      }}
                    ></Checkbox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFlexible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Have you engaged with Marketing Agencies?
                  </FormLabel>
                  <br />
                  <FormControl>
                    <Checkbox
                      onClick={() => {
                        setInvestmentRound4(true)
                      }}
                    ></Checkbox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
                        handleInputChange(index, e.target.value, 'description')
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
            <div className="text-center w-full mt-6">
              <FormLabel className="text-2xl text-center">
                Metrics Information
              </FormLabel>
            </div>

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
            <div className="status-bar flex flex-col gap-4">
              <div className="flex gap-4 rounded-xl items-center p-3 bg-[#454561] justify-between">
                <div>Token approved.</div>
                {tokenAllowance === undefined ||
                (tokenAllowance !== undefined &&
                  tokenAllowance <
                    parseUnits(
                      contractData.tokenAmount.toString() || '0',
                      Number(contractData.tokenDecimals)
                    ) &&
                  !isTokenApproved) ? (
                  <ResetIcon className="w-8 h-8" />
                ) : (
                  <CheckIcon className="w-8 h-8 text-astra-blue" />
                )}
              </div>
              <div className="flex gap-4 rounded-xl items-center p-3 bg-[#454561] justify-between">
                <div>Launchpad requested.</div>
                {isRequested ? (
                  <CheckIcon className="w-8 h-8 text-astra-blue" />
                ) : (
                  <ResetIcon className="w-8 h-8" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              {/* {buyRuleStatus && buyRuleStatus[0].result ? (
                <Button variant="astra-blue" type="submit">
                  Submit Information
                </Button>
              ) : (
                <AstraLink link="/launchpad/kyc">
                  <Button variant="astra-blue">Join Whitelist</Button>
                </AstraLink>
              )} */}
              <Button
                variant="astra-blue"
                type="submit"
                disabled={
                  ((tokenAllowance !== undefined &&
                    tokenAllowance <
                      parseUnits(
                        contractData.tokenAmount.toString() || '0',
                        Number(contractData.tokenDecimals)
                      )) ||
                    isTokenApproved) &&
                  isRequested
                }
              >
                Submit Information
              </Button>
            </div>
          </form>
        </Form>
      </AstraCard>
    </>
  )
}
export { CreateForm }
