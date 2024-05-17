'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { AstraCard, AstraHeader, AstraLink } from '@/components'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  Input,
  Separator,
  Textarea,
  Checkbox,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/shadcn'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import styles from './update-form.module.scss'
import * as z from 'zod'
import {
  TRequestLaunchpadContractInfo,
  TeamObject,
  MetricsObject,
  RequestLaunchpadResultValues,
} from '@/types'
import { parseUnits } from 'viem'
import {
  useChainConfig,
  useAllowance,
  useRequestLaunchpad,
  useGetBuyRuleLaunchpad,
  useApprove,
  useGetLaunchpadDetailById,
} from '@/hooks'
import { useAccount } from 'wagmi'
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons'
import Loading from '@/app/loading'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TimeField } from '@/components/astra/time-field'
import _ from 'lodash'
import { isAddress } from 'viem'
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { IoCloudUploadOutline } from 'react-icons/io5'

interface Errors {
  totalMetrics?: string
}
type TPage = {
  params: {
    launchpad_id: string
  }
}

export default function Page({ params }: TPage) {
  const router = useRouter()

  const { launchpad_id } = params
  const {
    data: launchpadDetail,
    isLoading,
    isError,
    refetchData: refetchLaunchpadDetail,
  } = useGetLaunchpadDetailById(launchpad_id)
  if (isError) redirect('/launchpad')

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const selectedImage = event.target.files[0]
      handleImageUpload(selectedImage)
    }
  }

  const handleImageUpload = async (image: File) => {
    if (!image) return
    setUploading(true)
    const url = await uploadToCloudinary(image)
    form.setValue(`projectImage`, url)
    setUploading(false)
  }

  const reactQuillRef = useRef<ReactQuill>(null)
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUD_PRESET as string
    )
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/upload`,
      { method: 'POST', body: formData }
    )
    const data = await res.json()
    const url = data.url

    return url
  }
  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0]
        const url = await uploadToCloudinary(file)
        const quill = reactQuillRef.current
        if (quill) {
          const range = quill.getEditorSelection()
          range && quill.getEditor().insertEmbed(range.index, 'image', url)
        }
      }
    }
  }, [])
  const urlRegex = new RegExp('^(ftp|http|https)://[^ "]+$')
  const [uploading, setUploading] = useState<boolean>(false)

  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        [{ align: [] }],
        [{ color: [] }],
        ['code-block'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'align',
    'color',
    'code-block',
  ]

  const uploadImage = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        setUploading(true)
        const file = input.files[0]
        const url = await uploadToCloudinary(file)
        form.setValue(`projectImage`, url)
        setUploading(false)
      }
    }
  }, [])

  const { chainConfig } = useChainConfig()
  const { address } = useAccount()
  const [defaultValues, setDefaultValues] = useState<Record<string, any>>({
    saleStartDate: new Date(),
    saleEndDate: new Date(),
    tokenAddress: '',
    tokenAmount: '',
    tokenPrice: '',
    baseAmount: '',
    tokenDecimals: 18,
    tokenSymbol: '',
    totalSupply: '',
    softCap: '',
    hardCap: '',
    initialMarketCap: '',
    projectValuation: '',
    tokenName: '',
    website: '',
    pitchdeck: '',
    projectDescription: '',
    projectDescriptionDetail: '',
    teamDescription: '',
    projectImage: '',
    saleRoundDetail: '',
    email: '',
    projectTwitter: '',
    contactTelegram: '',
    contactDiscord: '',
    totalToken: '',
    leadVC: '',
    marketMaker: '',
    controlledCap: '',
    daoApprovedMetrics: '',
    tokenType: '',
    baseToken: '',
    isVesting: false,
    vest_start: new Date(),
    vest_cliff: '',
    vest_duration: '',
    vest_slice_period_seconds: '',
    vest_initial_unlock: '',
  })

  const [contractData, setContractData] =
    useState<TRequestLaunchpadContractInfo>({
      tokenAddress: '' as `0x${string}`,
      tokenDecimals: '',
      saleStartTime: 0,
      saleEndTime: 0,
      tokenPrice: '',
      baseToken: '' as `0x${string}`,
      tokenAmount: '',
      baseAmount: '',
      isVesting: false,
    })
  const [errors, setErrors] = useState<Errors>({})
  const [isUploadLoading, setIsUploadLoading] = useState<boolean>(false)

  const [databaseData, setDatabaseData] =
    useState<RequestLaunchpadResultValues>()
  const [team, setTeam] = useState<TeamObject[]>([
    { name: '', position: '', description: '' },
  ])
  const [metrics, setMetrics] = useState<MetricsObject[]>([
    { label: '', value: 0 },
  ])
  const [vesting, setVesting] = useState<boolean>(defaultValues.isVesting)

  const metricsInfo =
    launchpadDetail?.METRICS && launchpadDetail?.METRICS !== 'none'
      ? launchpadDetail?.METRICS.split(',')
      : []
  const metricsInfoArray = metricsInfo.map((item) => {
    const pairs = item.split(':')
    const obj: MetricsObject = { label: pairs[0], value: parseFloat(pairs[1]) }
    return obj
  })
  const teamInfo =
    launchpadDetail?.TEAM_INFO && launchpadDetail?.TEAM_INFO !== 'none'
      ? launchpadDetail?.TEAM_INFO.split(',')
      : []
  const teamInfoArray = teamInfo.map((item) => {
    const pairs = item.split('?')
    const obj = pairs.reduce((acc: any, currentPair) => {
      const [key, value] = currentPair.split('=')
      acc[key] = value
      return acc
    }, {})
    return obj
  })

  const temp: Record<string, any> = {
    saleStartDate: z.date({
      required_error: 'Sale start date is required.',
    }),
    saleEndDate: z.date({
      required_error: 'Sale end date is required',
    }),
    tokenAddress: z
      .string()
      .min(1, {
        message: 'Token Address is required',
      })
      .refine((value) => isAddress(value), {
        message: 'Token Address is invalid',
      }),
    tokenAmount: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Token Sale Amount must be a valid number',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Token Sale Amount is required',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Token Sale Amount must be a positive integer',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    tokenPrice: z.coerce
      .number()
      .nonnegative({
        message: 'Token Price is required and must be positive',
      })
      .refine((value) => value !== 0, {
        message: 'Token Price cannot be zero',
      }),
    baseAmount: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Maximum user contribution must be a valid number',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Maximum user contribution is required',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Maximum user contribution must be a positive integer',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    tokenDecimals: z.coerce
      .number()
      .nonnegative({
        message: 'Token Decimals are required and must be positive',
      })
      .refine((value) => value !== 0, {
        message: 'Token Decimals cannot be zero',
      }),
    tokenSymbol: z.string().min(1, {
      message: 'Token Symbol is required',
    }),
    totalSupply: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Total Supply must be a valid number',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Total Supply is required',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Total Supply must be a positive integer',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    softCap: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'SoftCap must be a valid number',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'SoftCap is required',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'SoftCap must be a positive integer',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    hardCap: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'hardCap must be a valid number',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'hardCap is required',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'hardCap must be a positive integer',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    initialMarketCap: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Initial MarketCap must be a valid number',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Initial MarketCap is required',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Initial MarketCap must be a positive integer',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    tokenName: z.string().min(1, {
      message: 'Project Name is required',
    }),
    website: z
      .string()
      .min(1, {
        message: 'Website url is required',
      })
      .url({ message: 'Invalid url' }),
    pitchdeck: z
      .string()
      .min(1, {
        message: 'Pitchdeck url is required',
      })
      .url({ message: 'Invalid url' }),
    email: z
      .string()
      .min(1, {
        message: 'Email is required',
      })
      .email({ message: 'Invalid email address' }),
    projectTwitter: z
      .string()
      .min(1, {
        message: 'Project Twitter is required',
      })
      .url({ message: 'Invalid url' }),
    contactTelegram: z
      .string()
      .min(1, { message: 'Contact Telegram is required' })
      .refine(
        (value) => {
          // Check if the value starts with "@" (username format)
          if (value.startsWith('@')) {
            return true
          }

          // Check if the value is a valid t.me URL
          try {
            const url = new URL(value)
            return url.hostname === 't.me'
          } catch (error) {
            return false
          }
        },
        {
          message:
            'Contact Telegram must start with "@" or be a valid t.me URL',
        }
      ),
    contactDiscord: z
      .string()
      .refine((value) => value.trim() === '' || isUrl(value), {
        message: 'Invalid URL',
      }),
    projectDescription: z
      .string()
      .min(1, {
        message: 'Project Description is required',
      })
      .max(300, 'Project Description is too long'),
    totalToken: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Total Token Price must be a valid number',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Total Token Price is required',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Total Token Price must be a positive integer',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    //Dao Screening
    leadVC: z.string().min(1, {
      message: 'Lead VC information is required',
    }),
    marketMaker: z.string().min(1, {
      message: 'Market Maker information is required',
    }),
    tokenType: z.string({
      required_error: 'Please select token category.',
    }),
    baseToken: z.string().min(1, {
      message: 'Please select maximum contribute amount.',
    }),
    projectDescriptionDetail: z.coerce.string(),
    isVesting: z.boolean(),
    projectImage: z
      .string()
      .min(1, {
        message: 'Project image is required',
      })
      .url({ message: 'Invalid url' }),
  }
  if (vesting) {
    temp['vest_start'] = z.date({
      required_error: 'Vesting start date is required.',
    })
    temp['vest_cliff'] = z.coerce
      .number()
      .nonnegative({
        message: 'Cliff is required and must be positive',
      })
      .refine((value) => value !== 0, {
        message: 'Cliff cannot be zero',
      })
    temp['vest_duration'] = z.coerce
      .number()
      .nonnegative({
        message: 'Vesting duration is required and must be positive',
      })
      .refine((value) => value !== 0, {
        message: 'Vesting duration cannot be zero',
      })
    temp['vest_slice_period_seconds'] = z.coerce
      .number()
      .nonnegative({
        message: 'Vesting frequency is required and must be positive',
      })
      .refine((value) => value !== 0, {
        message: 'Vesting frequency cannot be zero',
      })
    temp['vest_initial_unlock'] = z.coerce
      .number()
      .int()
      .nonnegative({
        message: 'Vesting initial unlock is required and must be positive',
      })
      .refine((value) => value !== 0, {
        message: 'Vesting initial unlock cannot be zero',
      })
      .refine((value) => value >= 1 && value <= 100, {
        message: 'Vesting initial unlock must be between 1 and 100',
      })
  }
  for (let i = 0; i < metrics.length; i++) {
    temp[`label${i}`] = z
      .string()
      .min(1, {
        message: 'Category is required.',
      })
      .refine((val) => !(val.includes('?') || val.includes('=')), {
        message: 'Label can not contain special characters such as ? or =',
      })
    temp[`value${i}`] = z.coerce.number().gte(0).lte(100, {
      message: 'Metrics allocation must be from 0 to 100',
    })
  }
  for (let i = 0; i < team.length; i++) {
    temp[`name${i}`] = z
      .string()
      .min(1, {
        message: 'Member name is required.',
      })
      .refine((val) => !(val.includes('?') || val.includes('=')), {
        message: 'Name can not contain special characters such as ? or =',
      })
    temp[`position${i}`] = z
      .string()
      .min(1, {
        message: 'Member position is required',
      })
      .refine((val) => !(val.includes('?') || val.includes('=')), {
        message: 'Position can not contain special characters such as ? or =',
      })
    temp[`description${i}`] = z
      .string()
      .min(1, {
        message: 'Member description is required',
      })
      .refine((val) => !(val.includes('?') || val.includes('=')), {
        message:
          'Description can not contain special characters such as ? or =',
      })
  }
  const createIndexFormSchema = z
    .object(temp)
    .refine(
      (data) => {
        const { saleStartDate, saleEndDate } = data
        return saleStartDate < saleEndDate
      },
      {
        message: 'Sale end date must be after sale start date.',
        path: ['saleEndDate'],
      }
    )
    .refine(
      (data) => {
        if (!vesting) return true
        const { vest_start, saleEndDate } = data
        return vest_start > saleEndDate
      },
      {
        message: 'Vesting start date must be after sale end date.',
        path: ['vest_start'],
      }
    )
  const tempDefaultValues = defaultValues
  teamInfoArray.map((item, key) => {
    tempDefaultValues[`name${key}`] = item.name
    tempDefaultValues[`position${key}`] = item.position
    tempDefaultValues[`description${key}`] = item.description
  })
  metricsInfoArray.map((item, key) => {
    tempDefaultValues[`label${key}`] = item.label
    tempDefaultValues[`value${key}`] = item.value
  })

  const form = useForm<z.infer<typeof createIndexFormSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(createIndexFormSchema),
    reValidateMode: 'onBlur',
    values: tempDefaultValues,
  })

  // get launchpad token allowance to launchpad address
  const { data: tokenAllowance, refetch: tokenAllowanceRefetch } = useAllowance(
    {
      address:
        contractData.tokenAddress || launchpadDetail?.LAUNCHPAD_TOKEN_ADDRESS,
      args: [
        address as `0x${string}`,
        chainConfig.LaunchpadFactoryContractAddress,
      ],
      enabled: !!address && !!chainConfig.LaunchpadFactoryContractAddress,
    }
  )
  const isTokenApproved1 = useMemo(() => {
    if (!launchpadDetail) return false
    const safeTokenAllowance = tokenAllowance || BigInt(0)
    const tokenDecimals =
      Number(contractData.tokenDecimals) ||
      Number(launchpadDetail?.LAUNCHPAD_TOKEN_DECIMAL)
    const requiredAmount = parseUnits(
      contractData.tokenAmount.toString() ||
        launchpadDetail.TOTAL_SALE_AMOUNT.toString(),
      tokenDecimals
    )
    return safeTokenAllowance >= requiredAmount
  }, [
    tokenAllowance,
    contractData.tokenAmount,
    contractData.tokenDecimals,
    launchpadDetail,
  ])
  const isLaunchpadRequested = useMemo(() => {
    return launchpadDetail?.LAUNCHPAD_INDEX ? true : false
  }, [launchpadDetail])
  const { data: buyRuleStatus } = useGetBuyRuleLaunchpad() // [0]: whitelisted result

  // request launchpad after approve
  const {
    requestLaunchpad,
    isError: requestLaunchpadError,
    isLoading: requestLaunchpadLoading,
  } = useRequestLaunchpad({
    enabled:
      !!contractData.tokenAddress &&
      !!contractData.saleStartTime &&
      !!contractData.saleEndTime &&
      !!contractData.tokenPrice &&
      !!contractData.tokenAmount &&
      !!contractData.baseAmount &&
      !!contractData.baseToken &&
      !!contractData.tokenDecimals &&
      databaseData !== undefined &&
      team.length > 0,
    args: [
      contractData.tokenAddress as `0x${string}`,
      BigInt(parseInt(contractData.saleStartTime.toString())),
      BigInt(parseInt(contractData.saleEndTime.toString())),
      BigInt(
        parseUnits(
          contractData.tokenPrice || '',
          13 // multiplier
        )
      ),
      contractData.baseToken as `0x${string}`,
      BigInt(
        parseUnits(
          contractData.tokenAmount || '',
          Number(contractData.tokenDecimals)
        )
      ),
      BigInt(parseUnits(contractData.baseAmount || '', 6)), // USDC decimal
      contractData.isVesting,
    ],
    databaseData: databaseData ?? undefined,
    onSuccessTx: () => {
      refetchLaunchpadDetail()
      router.push(`/launchpad/owner/detail/${launchpad_id}`)
    },
  })
  // APPROVE
  const {
    approve,
    error: approveError,
    isLoading: approveLoading,
  } = useApprove({
    address: contractData.tokenAddress as `0x${string}`,
    minAmount: contractData.tokenDecimals
      ? parseUnits(
          contractData.tokenAmount.toString(),
          Number(contractData.tokenDecimals)
        )
      : 0,
    enabled:
      !!contractData.tokenAddress &&
      Number(contractData?.tokenAmount) > 0 &&
      Number(contractData?.tokenDecimals) > 0 &&
      tokenAllowance !== undefined &&
      contractData.tokenDecimals !== undefined &&
      !!requestLaunchpad,
    spender: chainConfig.LaunchpadFactoryContractAddress as `0x${string}`,
    onSuccessTx: () => {
      tokenAllowanceRefetch()
    },
  })

  function onSubmit(value: z.infer<typeof createIndexFormSchema>) {
    console.log('submit', value)
    return

    if (isUploadLoading || !address) {
      alert('loading or address is undefined')
      return
    }
    const teamValues = []
    for (let i = 0; i < team.length; i++) {
      teamValues.push({
        name: value[`name${i}`].trim(),
        position: value[`position${i}`].trim(),
        description: value[`description${i}`].trim(),
      })
    }
    setTeam(teamValues)
    const metricsValues = []
    for (let i = 0; i < metrics.length; i++) {
      metricsValues.push({
        value: value[`value${i}`],
        label: value[`label${i}`].trim(),
      })
    }
    setMetrics(metricsValues)
    let baseTokenTemp = ''
    if (value.baseToken === 'USDC')
      baseTokenTemp = chainConfig.USDCContractAddress
    if (value.baseToken === 'USDT')
      baseTokenTemp = chainConfig.USDTContractAddress
    const value_temp = value
    value_temp.tokenName = value_temp.tokenName.trim()
    value_temp.tokenSymbol = value_temp.tokenSymbol.trim()
    value_temp.leadVC = value_temp.leadVC.trim()
    value_temp.marketMaker = value_temp.marketMaker.trim()
    value_temp.controlledCap = ''
    value_temp.daoApprovedMetrics = ''
    value_temp.projectValuation = 0
    value_temp.vest_cliff = Number(value_temp.vest_cliff) * 86400
    value_temp.vest_duration = Number(value_temp.vest_duration) * 86400
    value_temp.vest_slice_period_seconds =
      Number(value_temp.vest_slice_period_seconds) * 86400
    value_temp.baseToken = baseTokenTemp
    value_temp.teamDescription = launchpadDetail?.TEAM_DESCRIPTION || ''
    value_temp.projectImage = launchpadDetail?.PROJECT_IMAGE || ''
    value_temp.saleRoundDetail = launchpadDetail?.SALE_ROUND_DETAIL || ''

    const result_values: RequestLaunchpadResultValues = {
      data: value_temp,
      team: teamValues,
      metrics: metricsValues,
    }
    setIsUploadLoading(true)

    //validation
    let isValid = true
    const temp_errors: Errors = {}

    //metrics value sum = 100 validation
    const metrics_sum = _.sumBy(metrics, 'value')
    if (metrics_sum !== 100) {
      isValid = false
      temp_errors.totalMetrics = `Total Metrics allocation is ${metrics_sum}. Must be 100`
    }
    setErrors(temp_errors)
    if (!isValid) {
      setIsUploadLoading(false)
      return
    }
    // sale start and end time
    const startTime =
      new Date(result_values.data.saleStartDate).getTime() / 1000
    const endTime = new Date(result_values.data.saleEndDate).getTime() / 1000
    // set database data
    setDatabaseData({
      ...databaseData,
      ...result_values,
      launchpadId: launchpad_id,
    })
    // set contract data
    setContractData({
      ...contractData,
      tokenAddress: value.tokenAddress as `0x${string}`,
      tokenPrice: value.tokenPrice.toString(),
      tokenAmount: value.tokenAmount.toString(),
      baseAmount: value.baseAmount.toString(),
      baseToken: baseTokenTemp as `0x${string}`,
      tokenDecimals: value.tokenDecimals.toString(),
      saleStartTime: startTime,
      saleEndTime: endTime,
      isVesting: value.isVesting,
    })
    setIsUploadLoading(false)
  }

  const handleAddInput = (str: string) => {
    if (str === 'team') {
      const index = team.length
      const values = form.getValues()
      values[`name${index}`] = ''
      values[`position${index}`] = ''
      values[`description${index}`] = ''
      form.reset(values)
      setTeam([...team, { name: '', position: '', description: '' }])
    } else {
      const index = metrics.length
      const values = form.getValues()
      values[`label${index}`] = ''
      values[`value${index}`] = ''
      form.reset(values)
      setMetrics([...metrics, { label: '', value: 0 }])
    }
  }
  const handleDeleteInput = (str: string) => {
    if (str === 'team') {
      const index = team.length
      const values = form.getValues()
      delete values[`name${index - 1}`]
      delete values[`position${index - 1}`]
      delete values[`description${index - 1}`]
      form.reset(values)
      setTeam((teams) => [...teams.slice(0, -1)])
    } else {
      const index = metrics.length
      const values = form.getValues()
      delete values[`label${index - 1}`]
      delete values[`value${index - 1}`]
      form.reset(values)
      setMetrics((metrics) => [...metrics.slice(0, -1)])
    }
  }
  function isUrl(value: string) {
    // Regular expression to check if the value is a valid URL
    const urlRegex = new RegExp('^(http|https)://[^ "]+$')

    return value.trim() === '' || urlRegex.test(value)
  }

  useEffect(() => {
    teamInfoArray.map((item, key) => {
      form.setValue(`name${key}`, item.name)
      form.setValue(`position${key}`, item.position)
      form.setValue(`description${key}`, item.description)
    })
    setTeam(teamInfoArray)
  }, [launchpadDetail?.TEAM_INFO])
  useEffect(() => {
    metricsInfoArray.map((item, key) => {
      form.setValue(`label${key}`, item.label)
      form.setValue(`value${key}`, item.value)
    })
    setMetrics(metricsInfoArray)
  }, [launchpadDetail?.METRICS])
  useEffect(() => {
    if (
      (isTokenApproved1 && isLaunchpadRequested) ||
      requestLaunchpadError ||
      approveError ||
      requestLaunchpadLoading ||
      approveLoading
    )
      return

    if (!isTokenApproved1 && approve) approve()
    else if (isTokenApproved1 && requestLaunchpad) requestLaunchpad()
  }, [contractData, databaseData, requestLaunchpad, approve, isTokenApproved1])
  useEffect(() => {
    const baseTokenTemp =
      launchpadDetail?.BASE_TOKEN === chainConfig.USDCContractAddress
        ? 'USDC'
        : 'USDT'
    const temp: Record<string, any> = {
      ...defaultValues,
      saleStartDate: launchpadDetail
        ? new Date(launchpadDetail.SALE_START_TIME + 'Z')
        : new Date(),
      saleEndDate: launchpadDetail
        ? new Date(launchpadDetail.SALE_END_TIME + 'Z')
        : new Date(),
      tokenAddress: launchpadDetail
        ? launchpadDetail.LAUNCHPAD_TOKEN_ADDRESS
        : '',
      tokenAmount: launchpadDetail
        ? launchpadDetail.TOTAL_SALE_AMOUNT.toLocaleString('en-US')
        : '',
      tokenPrice: launchpadDetail ? launchpadDetail.LAUNCHPAD_TOKEN_PRICE : '',
      baseAmount: launchpadDetail
        ? launchpadDetail.MAX_PURCHASE_BASE_AMOUNT.toLocaleString('en-US')
        : 0,
      tokenDecimals: launchpadDetail
        ? launchpadDetail.LAUNCHPAD_TOKEN_DECIMAL
        : 18,
      tokenSymbol: launchpadDetail
        ? launchpadDetail.LAUNCHPAD_TOKEN_SYMBOL.toString()
        : '',
      totalSupply: launchpadDetail
        ? launchpadDetail.LAUNCHPAD_TOKEN_TOTAL_SUPPLY.toLocaleString('en-US')
        : '',
      softCap: launchpadDetail
        ? launchpadDetail.SOFT_CAP.toLocaleString('en-US')
        : '',
      hardCap: launchpadDetail
        ? launchpadDetail.HARD_CAP.toLocaleString('en-US')
        : '',
      initialMarketCap: launchpadDetail
        ? launchpadDetail.INITIAL_MARKET_CAP.toLocaleString('en-US')
        : '',
      projectValuation: launchpadDetail
        ? launchpadDetail.PROJECT_VALUATION.toLocaleString('en-US')
        : '',
      tokenName: launchpadDetail
        ? launchpadDetail.LAUNCHPAD_TOKEN_NAME.toString()
        : '',
      website: launchpadDetail ? launchpadDetail.WEBSITE_URL.toString() : '',
      pitchdeck: launchpadDetail
        ? launchpadDetail.WHITEPAPER_URL.toString()
        : '',
      projectDescription: launchpadDetail
        ? launchpadDetail?.PROJECT_DETAIL.toString()
        : '',
      projectDescriptionDetail: launchpadDetail
        ? launchpadDetail?.PROJECT_DESCRIPTION_DETAIL.toString()
        : '',
      projectImage: launchpadDetail
        ? launchpadDetail?.PROJECT_IMAGE.toString()
        : '',
      teamDescription: launchpadDetail?.TEAM_DESCRIPTION || '',
      saleRoundDetail: launchpadDetail?.SALE_ROUND_DETAIL || '',
      email: launchpadDetail ? launchpadDetail.EMAIL.toString() : '',
      projectTwitter: launchpadDetail ? launchpadDetail.TWITTER.toString() : '',
      contactTelegram: launchpadDetail
        ? launchpadDetail.TELEGRAM.toString()
        : '',
      contactDiscord: launchpadDetail ? launchpadDetail.DISCORD.toString() : '',
      totalToken: launchpadDetail
        ? launchpadDetail.LAUNCHPAD_TOKEN_FDV.toLocaleString('en-US')
        : '',
      leadVC: launchpadDetail?.LEAD_VC || '',
      marketMaker: launchpadDetail?.MARKET_MAKER || '',
      controlledCap: launchpadDetail?.CONTROLLED_CAP || '',
      daoApprovedMetrics: launchpadDetail?.DAO_APPROVED_METRICS || '',
      tokenType: launchpadDetail?.TOKEN_TYPE || '',
      baseToken: baseTokenTemp,
      isVesting: launchpadDetail ? launchpadDetail.IS_VESTING : false,

      vest_start: launchpadDetail?.VEST_START
        ? new Date(launchpadDetail?.VEST_START + 'Z')
        : new Date(),
      vest_cliff: Number(launchpadDetail?.VEST_CLIFF) / 86400 || '',
      vest_duration: Number(launchpadDetail?.VEST_DURATION) / 86400 || '',
      vest_slice_period_seconds:
        Number(launchpadDetail?.VEST_SLICE_PERIOD_SECONDS) / 86400 || '',
      vest_initial_unlock: launchpadDetail?.VEST_INITIAL_UNLOCK || '',
    }
    setVesting(launchpadDetail?.IS_VESTING || false)
    setDefaultValues(temp)
  }, [launchpadDetail])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedImage = acceptedFiles[0]
      handleImageUpload(selectedImage)
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <main className="min-h-screen  ">
      <div className="container flex flex-col items-center gap-6 justify-center w-full h-full pb-20 xl:w-1/2">
        <AstraHeader className="text-center w-full">
          Launchpad Update Form
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
                  name="tokenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. ASTRA"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trimStart()
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
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Project Overview *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Please provide a short description of your
                                project. <br /> within a maximum of 300
                                characters.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please write project overview. Minimum 300 characters."
                          rows={3}
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trimStart()
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project URL *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://project.com"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trim()
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
                  name="pitchdeck"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Whitepaper Link *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://drive.google.com/drive/..."
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trim()
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. abc@abc.xyz"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trim()
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
                  name="projectTwitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter handle *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trim()
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
                  name="contactTelegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Telegram Handle *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Please insert your project telegram username
                                (@johndoe) or
                                <br />
                                or telegram URL (https://t.me/johndoe).
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. @johndoe or https://t.me/johndoe"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trim()
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
                  name="contactDiscord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discord Handle *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://discord.com"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trim()
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
                  name="projectImage"
                  render={({ field }) => (
                    <FormItem className="my-8">
                      <FormLabel>Project Image *</FormLabel>
                      <div className="text-center">
                        <FormControl>
                          <div
                            {...getRootProps()}
                            className=" flex items-center justify-center w-full"
                            ref={field.ref}
                          >
                            <label
                              htmlFor="dropzone-file"
                              className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                              {uploading && (
                                <div className=" text-center max-w-md  ">
                                  {/* <RadialProgress progress={progress} /> */}
                                  <p className=" text-sm font-semibold">
                                    Uploading Picture
                                  </p>
                                  <p className=" text-xs text-gray-400">
                                    Do not refresh or perform any other action
                                    while the picture is being upload
                                  </p>
                                </div>
                              )}

                              {!uploading && _.isEmpty(field.value) && (
                                <div className=" text-center">
                                  <div className=" border p-2 rounded-md max-w-min mx-auto">
                                    <IoCloudUploadOutline size="1.6em" />
                                  </div>

                                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">
                                      Drag an image
                                    </span>
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-400">
                                    Click to upload &#40; image should be
                                    500x500 px & under 10 MB &#41;
                                  </p>
                                </div>
                              )}

                              {field.value && !uploading && (
                                <div className="text-center">
                                  <Image
                                    width={1000}
                                    height={1000}
                                    src={field.value}
                                    className=" w-full object-contain max-h-16 mx-auto mt-2 mb-3 opacity-70"
                                    alt="uploaded image"
                                  />
                                  <p className=" text-sm font-semibold">
                                    Picture Uploaded
                                  </p>
                                  <p className=" text-xs text-gray-400">
                                    Click submit to upload the picture
                                  </p>
                                </div>
                              )}
                            </label>

                            <Input
                              {...getInputProps()}
                              id="dropzone-file"
                              accept="image/png, image/jpeg"
                              type="file"
                              className="hidden"
                              disabled={uploading || field.value !== null}
                              onChange={handleImageChange}
                            />
                          </div>
                        </FormControl>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectDescriptionDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <div style={{ color: 'black' }}>
                          <ReactQuill
                            ref={reactQuillRef}
                            value={field.value}
                            onChange={field.onChange}
                            modules={quillModules}
                            formats={quillFormats}
                            className="w-full h-[70%] mt-10 bg-white"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="projectValuation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Project Valuation *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Project valuation is total value of the project
                                <br /> at the time of its launch.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          placeholder="e.g. $50000 (Must be positive)"
                          {...field}
                          onChange={(e) => {
                            // Remove commas from the input value
                            const inputValue = e.target.value.replace(/,/g, '')
                            // Set the formatted value with commas
                            const formattedValue =
                              inputValue === '0-'
                                ? '-'
                                : (
                                    parseInt(inputValue, 10) || 0
                                  ).toLocaleString('en-US')
                            // Update the input value in the form
                            field.onChange(formattedValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <Separator className="bg-gray-400"></Separator>
                <FormField
                  control={form.control}
                  name="totalSupply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Total Supply *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Total supply refers to the predetermined maximum
                                number <br /> of tokens that will ever exist for
                                this project.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          placeholder="e.g. 10000000  (Must be positive integer)"
                          {...field}
                          onChange={(e) => {
                            // Remove commas from the input value
                            const inputValue = e.target.value.replace(/,/g, '')
                            // Set the formatted value with commas
                            const formattedValue =
                              inputValue === '0-'
                                ? '-'
                                : (
                                    parseInt(inputValue, 10) || 0
                                  ).toLocaleString('en-US')
                            // Update the input value in the form
                            field.onChange(formattedValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenSymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Symbol *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. ASTRA"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trimStart()
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
                  name="tokenDecimals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Token Decimals *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Token decimal represents the number of decimal
                                places <br /> used to define the smallest unit
                                of a launchpad token, <br /> such as 1*10^18 for
                                a value of 18.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 20  (Must be positive)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger ref={field.ref}>
                            <SelectValue placeholder="Select a launchpad token category." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="metaverse">Metaverse</SelectItem>
                          <SelectItem value="defi">DeFi</SelectItem>
                          <SelectItem value="socialNetwork">
                            Social Network
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Token Address *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                The token address must adhere to the format of
                                starting <br /> with '0x' and being precisely 42
                                characters in length.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 0xDF356S8F76SD87SDFS78FSDSDF8SD8SDFFSD8f01"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trim()
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
                  name="baseToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Token *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger ref={field.ref}>
                            <SelectValue placeholder="e.g. USDC (Please select base token category)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Token Sale Amount *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Token sale amount refers to the total quantity
                                of tokens <br /> made available for purchase
                                during a token sale event.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          placeholder="e.g. 1000 (Must be positive integer)"
                          {...field}
                          onChange={(e) => {
                            // Remove commas from the input value
                            const inputValue = e.target.value.replace(/,/g, '')
                            // Set the formatted value with commas
                            const formattedValue =
                              inputValue === '0-'
                                ? '-'
                                : (
                                    parseInt(inputValue, 10) || 0
                                  ).toLocaleString('en-US')
                            // Update the input value in the form
                            field.onChange(formattedValue)
                          }}
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
                          placeholder="e.g. $10 (Must be positive)"
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
                      <FormLabel className="flex">
                        <span className="mr-2">
                          Maximum user contribution *
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Maximum user contribution is the highest amount
                                of cryptocurrency <br /> that an individual
                                participant can contribute during a token sale
                                event.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          placeholder="Maximum user contribution($)  e.g. $30"
                          {...field}
                          onChange={(e) => {
                            // Remove commas from the input value
                            const inputValue = e.target.value.replace(/,/g, '')
                            // Set the formatted value with commas
                            const formattedValue =
                              inputValue === '0-'
                                ? '-'
                                : (
                                    parseInt(inputValue, 10) || 0
                                  ).toLocaleString('en-US')
                            // Update the input value in the form
                            field.onChange(formattedValue)
                          }}
                        />
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
                        <Input
                          type="string"
                          placeholder="e.g. $30,000,000 (Must be positive)"
                          {...field}
                          onChange={(e) => {
                            // Remove commas from the input value
                            const inputValue = e.target.value.replace(/,/g, '')
                            // Set the formatted value with commas
                            const formattedValue =
                              inputValue === '0-'
                                ? '-'
                                : (
                                    parseInt(inputValue, 10) || 0
                                  ).toLocaleString('en-US')
                            // Update the input value in the form
                            field.onChange(formattedValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="bg-gray-400"></Separator>

                <FormField
                  control={form.control}
                  name="saleStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Sale Start Time *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Sale start time must be prior than sale end
                                time.
                                <br />
                                Input your local time zone.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild ref={field.ref}>
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
                              const timeTemp: Date = field.value || new Date()
                              timeTemp.setHours(event.hour)
                              timeTemp.setMinutes(event.minute)
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
                      <FormLabel className="flex">
                        <span className="mr-2">Sale End Time *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Sale end time must be after than sale start
                                time.
                                <br />
                                Input your local time zone.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild ref={field.ref}>
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
                              const timeTemp: Date = field.value || new Date()
                              timeTemp.setHours(event.hour)
                              timeTemp.setMinutes(event.minute)
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
                  name="softCap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Soft Cap *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                The soft cap is the minimum fundraising goal
                                that a launchpad <br /> project must achieve
                                during its token sale.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          placeholder="e.g. $100  (Must be positive)"
                          {...field}
                          onChange={(e) => {
                            // Remove commas from the input value
                            const inputValue = e.target.value.replace(/,/g, '')
                            // Set the formatted value with commas
                            const formattedValue =
                              inputValue === '0-'
                                ? '-'
                                : (
                                    parseInt(inputValue, 10) || 0
                                  ).toLocaleString('en-US')
                            // Update the input value in the form
                            field.onChange(formattedValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hardCap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Hard Cap *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                The hard cap is the maximum fundraising goal
                                that a launchpad <br /> project can achieve
                                during its token sale.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          placeholder="e.g. $10000 (Must be positive)"
                          {...field}
                          onChange={(e) => {
                            // Remove commas from the input value
                            const inputValue = e.target.value.replace(/,/g, '')
                            // Set the formatted value with commas
                            const formattedValue =
                              inputValue === '0-'
                                ? '-'
                                : (
                                    parseInt(inputValue, 10) || 0
                                  ).toLocaleString('en-US')
                            // Update the input value in the form
                            field.onChange(formattedValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="initialMarketCap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Initial Market Cap *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Initial market cap is the total market value of
                                a launchpad <br />
                                project upon its entry into the market.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          placeholder="e.g. $50000 (Must be positive)"
                          {...field}
                          onChange={(e) => {
                            // Remove commas from the input value
                            const inputValue = e.target.value.replace(/,/g, '')
                            // Set the formatted value with commas
                            const formattedValue =
                              inputValue === '0-'
                                ? '-'
                                : (
                                    parseInt(inputValue, 10) || 0
                                  ).toLocaleString('en-US')
                            // Update the input value in the form
                            field.onChange(formattedValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isVesting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is Vesting?</FormLabel>
                      <br />
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked)
                            setVesting(checked)
                            const values = form.getValues()
                            values[`vest_start`] = null
                            values[`vest_cliff`] = ''
                            values[`vest_duration`] = ''
                            values[`vest_slice_period_seconds`] = ''
                            values[`vest_initial_unlock`] = ''
                            form.reset(values)
                          }}
                        ></Checkbox>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {vesting === true ? (
                  <>
                    <FormField
                      control={form.control}
                      name="vest_start"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex">
                            <span className="mr-2">Vesting Start Time *</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Vesting start time must be after than sale
                                    end time.
                                    <br />
                                    Input your local time zone.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild ref={field.ref}>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                                  const timeTemp: Date =
                                    field.value || new Date()
                                  timeTemp.setHours(event.hour)
                                  timeTemp.setMinutes(event.minute)
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
                      name="vest_cliff"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex">
                            <span className="mr-2">Vesting Cliff *</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    A vesting cliff is a specific period within
                                    a vesting schedule during <br /> which no
                                    tokens are awarded, followed by a period
                                    where <br /> a certain portion of tokens
                                    become available for the holder.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 1(day) (Must be positive)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Please input as Day unit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vest_duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex">
                            <span className="mr-2">Vesting Duration *</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Vesting duration is the length of time over
                                    which tokens gradually <br /> become
                                    available to the holder after a vesting
                                    cliff.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 365(days) (Must be positive)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Please input as Day unit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vest_slice_period_seconds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex">
                            <span className="mr-2">
                              Vesting Frequency (The rate of token release) *
                            </span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Vesting frequency refers to how often tokens
                                    become available <br /> to the holder after
                                    the vesting cliff.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 1(day) (Must be positive)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Please input as Day unit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vest_initial_unlock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex">
                            <span className="mr-2">
                              Vesting Initial Unlock *
                            </span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Vesting initial unlock refers to the first
                                    instance when a portion of tokens <br />{' '}
                                    becomes available to the holder after the
                                    vesting cliff period.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 10(%) (Must be positive integer between 1 - 100)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Please input only integer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <></>
                )}
                <Separator className="bg-gray-400"></Separator>

                <FormField
                  control={form.control}
                  name="leadVC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead VC *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Acura Capital"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trimStart()
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
                  name="marketMaker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Maker *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Kairon Labs"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trimStart()
                            field.onChange(temp)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="controlledCap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Controlled Cap</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Controlled Cap"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trimStart()
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
                  name="daoApprovedMetrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DAO Approved Metrics</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="DAO Approved Metrics"
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trimStart()
                            field.onChange(temp)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

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

                    <FormField
                      control={form.control}
                      name={`name${index}`}
                      render={({ field }) => (
                        <FormItem className="my-8">
                          <FormLabel>Team Member Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ayush"
                              // value={input['label']}
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
                      name={`position${index}`}
                      render={({ field }) => (
                        <FormItem className="my-8">
                          <FormLabel>Team Member Position *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Full stack developer"
                              // onChange={(e) =>
                              //   handleInputChange(index, e.target.value, 'value')
                              // }
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
                      name={`description${index}`}
                      render={({ field }) => (
                        <FormItem className="my-8">
                          <FormLabel>Team Member Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="He is a smart contract developer."
                              rows={3}
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
                    onClick={() => handleAddInput('team')}
                  >
                    Add
                  </Button>
                  <Button
                    variant="astra-blue"
                    style={{ backgroundColor: 'tomato', border: 'none' }}
                    onClick={() => handleDeleteInput('team')}
                    disabled={team.length === 1}
                  >
                    Delete
                  </Button>
                </div>
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
                              type="number"
                              placeholder="e.g. 50 (%) (Must be positive number between 0 - 100)"
                              // onChange={(e) =>
                              //   handleInputChange(index, e.target.value, 'value')
                              // }
                              {...field}
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
                    onClick={() => handleAddInput('metrics')}
                  >
                    Add
                  </Button>
                  <Button
                    variant="astra-blue"
                    style={{ backgroundColor: 'tomato', border: 'none' }}
                    onClick={() => handleDeleteInput('metrics')}
                    disabled={metrics.length === 1}
                  >
                    Delete
                  </Button>
                </div>

                <div className="text-red-500">
                  {errors ? errors.totalMetrics : ''}
                </div>
                <Separator className="bg-gray-400"></Separator>
                <div className="status-bar flex flex-col gap-4">
                  <div className="flex gap-4 rounded-xl items-center p-3 bg-[#454561] justify-between">
                    <div>KYC verified.</div>
                    {buyRuleStatus && buyRuleStatus[0].result ? (
                      <CheckIcon className="w-8 h-8 text-astra-blue" />
                    ) : (
                      <ResetIcon className="w-8 h-8" />
                    )}
                  </div>
                  <div className="flex gap-4 rounded-xl items-center p-3 bg-[#454561] justify-between">
                    <div>Token approved.</div>
                    {!isTokenApproved1 ? (
                      <ResetIcon className="w-8 h-8" />
                    ) : (
                      <CheckIcon className="w-8 h-8 text-astra-blue" />
                    )}
                  </div>
                  <div className="flex gap-4 rounded-xl items-center p-3 bg-[#454561] justify-between">
                    <div>Launchpad requested.</div>
                    {isLaunchpadRequested ? (
                      <CheckIcon className="w-8 h-8 text-astra-blue" />
                    ) : (
                      <ResetIcon className="w-8 h-8" />
                    )}
                  </div>
                </div>
                {buyRuleStatus && buyRuleStatus[0].result ? (
                  <Button
                    variant="astra-blue"
                    isLoading={requestLaunchpadLoading || approveLoading}
                    disabled={
                      (!!isTokenApproved1 && isLaunchpadRequested) ||
                      !!requestLaunchpadError ||
                      !!approveError ||
                      requestLaunchpadLoading ||
                      approveLoading
                    }
                    type="submit"
                  >
                    Update Information & Request Launchpad
                  </Button>
                ) : (
                  <AstraLink link="/launchpad/kyc">
                    <Button variant="astra-blue" className="w-full">
                      Join Whitelist (Verify KYC)
                    </Button>
                  </AstraLink>
                )}
              </form>
            </Form>
          )}
        </AstraCard>
      </div>
    </main>
  )
}
