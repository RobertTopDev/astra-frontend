'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AstraCard, AstraHeader } from '@/components'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
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
import styles from './create-form.module.scss'
import * as z from 'zod'
import {
  TeamObject,
  MetricsObject,
  RequestLaunchpadResultValues,
} from '@/types'
import { useAccount, useNetwork } from 'wagmi'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TimeField } from '@/components/astra/time-field'
import _ from 'lodash'
import { requestLuanchpadForDB } from '@/util/requestLaunchpadForDB'
import { useChainConfig } from '@/hooks'
import { isAddress } from 'viem'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { idToChain } from '@/config'

interface Errors {
  totalMetrics?: string
}

const CreateForm = () => {
  const router = useRouter()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { chainConfig } = useChainConfig()
  const [fileError, setFileError] = useState<string>('')
  const [tempImageFile, setTempImageFile] = useState<File>()
  const urlRegex = new RegExp('^(http|https|blob:http|blob:https)://[^ "]+$')

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    event.preventDefault()
    if (event.target.files?.length) {
      const selectedImage = event.target.files[0]
      handleImageUpload(selectedImage)
    }
  }

  const handleImageUpload = async (image: File) => {
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(image.type)) {
      setFileError('Invalid file type. Only JPEG and PNG files are allowed.')
      return
    }
    if (image.size > 10485760) {
      setFileError('File size should be less than 10MB')
      return
    }
    setFileError('')
    if (!image) return
    setTempImageFile(image)
    const fileUrl = URL.createObjectURL(image)
    form.setValue(`projectImage`, fileUrl)
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

  const [team, setTeam] = useState<TeamObject[]>([
    { name: '', position: '', description: '' },
  ])
  const [metrics, setMetrics] = useState<MetricsObject[]>([
    { id: '', label: '', value: 0 },
  ])
  const [vesting, setVesting] = useState<boolean>(false)

  const [errors, setErrors] = useState<Errors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const temp: Record<string, any> = {
    saleStartDate: z.date({
      required_error: 'Sale start date is required.',
    }),
    saleEndDate: z.date({
      required_error: 'Sale end date is required.',
    }),
    tokenAddress: z
      .string()
      .min(1, {
        message: 'Token address is required.',
      })
      .regex(/^[^'"]*$/, {
        message: 'Token address cannot contain single or double quotes.',
      })
      .refine((value) => isAddress(value), {
        message: 'Token address is invalid.',
      }),
    tokenAmount: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Token sale amount must be a valid number.',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Token sale amount is required.',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Token sale amount must be a positive integer.',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    tokenPrice: z.coerce
      .number()
      .nonnegative({
        message: 'Token price is required and must be positive.',
      })
      .refine((value) => value !== 0, {
        message: 'Token price cannot be zero.',
      }),

    minPurchaseAmount: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Minimum user contribution must be a valid number.',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Minimum user contribution is required.',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Minimum user contribution must be a positive integer.',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas
    baseAmount: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Maximum user contribution must be a valid number.',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Maximum user contribution is required.',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Maximum user contribution must be a positive integer.',
        }
      )
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Maximum user contribution must be a positive integer.',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    tokenDecimals: z.coerce
      .number()
      .nonnegative({
        message: 'Token decimals are required and must be positive.',
      })
      .refine((value) => value !== 0, {
        message: 'Token decimals cannot be zero.',
      }),
    tokenSymbol: z.string().min(1, {
      message: 'Token symbol is required.',
    }),
    totalSupply: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Total supply must be a valid number.',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Total supply is required.',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Total supply must be a positive integer.',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    softCap: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Soft cap must be a valid number.',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Soft cap is required.',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Soft cap must be a positive integer.',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    hardCap: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Hard cap must be a valid number.',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Hard cap is required.',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Hard cap must be a positive integer.',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    initialMarketCap: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Initial market cap must be a valid number.',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Initial market cap is required.',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Initial market cap must be a positive integer.',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

    tokenName: z.string().min(1, {
      message: 'Project Name is required.',
    }),
    website: z
      .string()
      .min(1, {
        message: 'Website url is required',
      })
      .url({ message: 'Invalid url.' }),
    projectDeck: z
      .string()
      .refine((value) => value.trim() === '' || isUrl(value), {
        message: 'Invalid URL.',
      }),
    pitchdeck: z
      .string()
      .refine((value) => value.trim() === '' || isUrl(value), {
        message: 'Invalid URL.',
      }),
    email: z
      .string()
      .min(1, {
        message: 'Email address is required.',
      })
      .email({ message: 'Invalid email address.' }),
    projectTwitter: z
      .string()
      .min(1, {
        message: 'Project twitter is required.',
      })
      .url({ message: 'Invalid url.' }),
    github: z.string().refine((value) => value.trim() === '' || isUrl(value), {
      message: 'Invalid URL.',
    }),
    contactTelegram: z
      .string()
      .min(1, { message: 'Contact telegram is required.' })

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
            'Contact telegram must start with "@" or be a valid t.me URL.',
        }
      ),
    contactDiscord: z
      .string()
      .refine((value) => value.trim() === '' || isUrl(value), {
        message: 'Invalid URL.',
      }),
    contactMedium: z
      .string()

      .refine((value) => value.trim() === '' || isUrl(value), {
        message: 'Invalid URL.',
      }),
    projectDescription: z
      .string()
      .min(1, {
        message: 'Project overview is required.',
      })
      .max(300, 'Project overview is too long.'),
    totalToken: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,.]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Total token price must be a valid number.',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Total token price is required.',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Total token price must be a positive number.',
        }
      )
      .transform((value) => parseFloat(value.replace(/,/g, ''))), // Transform the string to an integer without commas

    //Dao Screening
    leadVC: z.string(),
    marketMaker: z.string(),
    investorDetail: z.string(),
    raised: z
      .string()
      .refine((value) => value === '' || /^[0-9,]+$/.test(value), {
        message: 'Total raised amount must be a valid number.',
      })
      .refine(
        (value) => value === '' || !isNaN(Number(value.replace(/,/g, ''))),
        {
          message: 'Total raised amount must be a valid number.',
        }
      )
      .refine((value) => value === '' || Number(value.replace(/,/g, '')) >= 0, {
        message: 'Total raised amount must be a positive integer.',
      })
      .transform((value) =>
        value === '' ? value : parseInt(value.replace(/,/g, ''), 10)
      ),

    tokenType: z.string().min(1, {
      message: 'Please select token category.',
    }),
    baseToken: z.string().min(1, {
      message: 'Please select maximum contribute amount.',
    }),
    projectDescriptionDetail: z.coerce.string(),
    isVesting: z.boolean(),
    projectImage: z
      .string()
      .min(1, {
        message: 'Project image is required.',
      })
      .url({ message: 'Invalid url.' }),
  }

  if (vesting) {
    temp['vest_start'] = z.date({
      required_error: 'Vesting start date is required.',
    })
    temp['vest_cliff'] = z.coerce.number().nonnegative({
      message: 'Cliff is required and must be positive.',
    })
    // .refine((value) => value !== 0, {
    //   message: 'Cliff cannot be zero',
    // })
    temp['vest_duration'] = z.coerce
      .number()
      .nonnegative({
        message: 'Vesting duration is required and must be positive.',
      })
      .refine((value) => value !== 0, {
        message: 'Vesting duration cannot be zero.',
      })
    temp['vest_slice_period_seconds'] = z.coerce
      .number()
      .nonnegative({
        message: 'Vesting frequency is required and must be positive.',
      })
      .refine((value) => value !== 0, {
        message: 'Vesting frequency cannot be zero.',
      })
    temp['vest_initial_unlock'] = z.coerce
      .number()
      .int()
      .nonnegative({
        message: 'Vesting initial unlock is required and must be positive.',
      })
      .refine((value) => value !== 0, {
        message: 'Vesting initial unlock cannot be zero.',
      })
      .refine((value) => value >= 1 && value <= 100, {
        message: 'Vesting initial unlock must be between 1 and 100.',
      })
  }
  for (let i = 0; i < metrics.length; i++) {
    temp[`label${i}`] = z.string().min(1, {
      message: 'Category is required.',
    })
    temp[`value${i}`] = z.coerce.number().gte(0).lte(100, {
      message: 'Metrics allocation must be from 0 to 100.',
    })
  }
  for (let i = 0; i < team.length; i++) {
    temp[`name${i}`] = z.string().min(1, {
      message: 'Member name is required.',
    })
    temp[`position${i}`] = z.string().min(1, {
      message: 'Member position is required.',
    })
    temp[`description${i}`] = z.string().min(1, {
      message: 'Member description is required.',
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
    .refine((data) => data.baseAmount >= data.minPurchaseAmount, {
      message:
        'Maximum user contribution must be greater or equal than minimum user contribution.',
      path: ['baseAmount'],
    })

  const defaultValues: Record<string, any> = {
    tokenAddress: '',
    tokenAmount: '',
    tokenPrice: '',
    minPurchaseAmount: '',
    baseAmount: '',
    tokenDecimals: 18,
    tokenSymbol: '',
    totalSupply: '',
    raised: '',
    softCap: '',
    hardCap: '',
    initialMarketCap: '',
    projectValuation: '',
    projectDescription: '',
    projectDescriptionDetail: '',
    projectImage: '',
    tokenName: '',
    website: '',
    projectDeck: '',
    pitchdeck: '',
    email: '',
    projectTwitter: '',
    github: '',
    contactTelegram: '',
    contactDiscord: '',
    contactMedium: '',
    totalToken: '',
    leadVC: '',
    marketMaker: '',
    investorDetail: '',
    controlledCap: '',
    daoApprovedMetrics: '',
    tokenType: '',
    baseToken: '',
    isVesting: false,
    vest_cliff: '0',
    vest_duration: '0',
    vest_slice_period_seconds: '0',
    vest_initial_unlock: '0',
  }
  metrics.map(
    (item, key) => (
      (defaultValues[`id${key}`] = item.id),
      (defaultValues[`label${key}`] = item.label),
      (defaultValues[`value${key}`] = item.value)
    )
  )
  team.map(
    (item, key) => (
      (defaultValues[`name${key}`] = item.name),
      (defaultValues[`position${key}`] = item.position),
      (defaultValues[`description${key}`] = item.description)
    )
  )

  const form = useForm<z.infer<typeof createIndexFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(createIndexFormSchema),
    reValidateMode: 'onChange',
    defaultValues: defaultValues,
  })
  function isUrl(value: string) {
    // Regular expression to check if the value is a valid URL
    return value.trim() === '' || urlRegex.test(value)
  }

  async function onSubmit(value: z.infer<typeof createIndexFormSchema>) {
    if (isLoading || !address) {
      alert('loading or address is undefined')
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

    const teamValues = []
    for (let i = 0; i < team.length; i++) {
      teamValues.push({
        name: value[`name${i}`].trim().replace(/"/g, '\\"'),
        position: value[`position${i}`].trim().replace(/"/g, '\\"'),
        description: value[`description${i}`].trim().replace(/"/g, '\\"'),
      })
    }
    setTeam(teamValues)
    const metricsValues = []
    for (let i = 0; i < metrics.length; i++) {
      metricsValues.push({
        id: value[`label${i}`].trim().replace(/"/g, '\\"'),
        value: value[`value${i}`],
        label: value[`label${i}`].trim().replace(/"/g, '\\"'),
      })
    }
    setMetrics(metricsValues)

    const result_values: RequestLaunchpadResultValues = {
      data: value,
      team: teamValues,
      metrics: metricsValues,
    }

    const url = await uploadToCloudinary(tempImageFile as File)
    const tempInvestorDetail = JSON.stringify(
      result_values.data.investorDetail
        .split(',')
        .map((investor: string) => investor.trim().replace(/"/g, '\\"'))
    )
    const requestData: any = {
      owner: address as `0x${string}`,
      launchpadAddress: '',
      launchpadTokenAddress: result_values.data.tokenAddress,
      launchpadTokenName: result_values.data.tokenName.trim(),
      launchpadTokenSymbol: result_values.data.tokenSymbol.trim(),
      launchpadTotalSupply: result_values.data.totalSupply,
      launchpadTokenDecimal: Number(result_values.data.tokenDecimals),
      launchpadTokenPrice: Number(result_values.data.tokenPrice),
      launchpadTokenFDV: Number(result_values.data.totalToken),
      totalSaleAmount: Number(result_values.data.tokenAmount),
      saleStartTime: new Date(result_values.data.saleStartDate).getTime(),
      saleEndTime: new Date(result_values.data.saleEndDate).getTime(),
      minPurchaseBaseAmount: Number(result_values.data.minPurchaseAmount),
      maxPurchaseBaseAmount: Number(result_values.data.baseAmount),
      softCap: Number(result_values.data.softCap),
      hardCap: Number(result_values.data.hardCap),
      initialMarketCap: Number(result_values.data.initialMarketCap),
      projectValuation: 0, // should remove
      projectDetail: result_values.data.projectDescription,
      projectDescriptionDetail: result_values.data.projectDescriptionDetail,
      projectImage: url,
      teamInfo: JSON.stringify(result_values.team),
      teamDescription: '',
      metrics: JSON.stringify(result_values.metrics),
      websiteUrl: result_values.data.website,
      github: result_values.data?.github || '',
      projectDeck: result_values.data.projectDeck || '',
      whitepaperUrl: result_values.data.pitchdeck || '',
      twitter: result_values.data.projectTwitter,
      telegram: result_values.data.contactTelegram,
      discord: result_values.data.contactDiscord,
      medium: result_values.data.contactMedium,
      otherUrl: '',
      email: result_values.data.email,
      chain: (chain && idToChain[chain.id]) || 'Arbitrum',
      requestTransaction: '',
      approveTransaction: '',
      leadVC: result_values.data.leadVC.trim() || '',
      marketMaker: result_values.data.marketMaker.trim(),
      investorDetail: tempInvestorDetail,
      raised: result_values.data.raised || '',
      controlledCap: '',
      daoApprovedMetrics: '',
      tokenType: result_values.data.tokenType,
      isVesting: result_values.data.isVesting,
      baseToken: result_values.data.baseToken,
      vest_start: result_values.data.vest_start
        ? new Date(result_values.data.vest_start).getTime()
        : new Date(),
      vest_cliff: Number(result_values.data.vest_cliff) * 86400 || 0,
      vest_duration: Number(result_values.data.vest_duration) * 86400 || 0,
      vest_slice_period_seconds:
        Number(result_values.data.vest_slice_period_seconds) * 86400 || 0,
      vest_initial_unlock: Number(result_values.data.vest_initial_unlock) || 0,
    }
    const response = await requestLuanchpadForDB(requestData)
    if (!response.ok) {
      setIsLoading(false)
      throw new Error(`HTTP error! status: ${response.status}`)
    } else {
      const data = await response.json()
      router.push(`/launchpad/owner/detail/${data.id}`)
    }
    setIsLoading(false)
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
      values[`id${index}`] = ''
      values[`label${index}`] = ''
      values[`value${index}`] = '0'
      form.reset(values)
      setMetrics([...metrics, { id: '', label: '', value: 0 }])
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
      delete values[`id${index - 1}`]
      delete values[`label${index - 1}`]
      delete values[`value${index - 1}`]
      form.reset(values)
      setMetrics((metrics) => [...metrics.slice(0, -1)])
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedImage = acceptedFiles[0]
      handleImageUpload(selectedImage)
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <>
      <AstraHeader className="text-center w-full">
        Token Sale Create Form
      </AstraHeader>
      <AstraCard className="w-full bg-opacity-80">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={clsx(styles['index-form'], 'w-full flex flex-col gap-8')}
          >
            <div className="text-center w-full">
              <FormLabel className="text-2xl text-center">
                Project Details
              </FormLabel>
            </div>
            <FormField
              control={form.control}
              name="tokenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. ASTRA"
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trimStart()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
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
                    <span className="mr-2">Overview *</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Please provide a brief description of your project
                            <br />
                            within 300 characters.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Please write project overview. Maximum 300 characters."
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
                  <FormLabel>Website *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://project.com"
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trim()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectDeck"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Deck</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://docsend.com/view/..."
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trim()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
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
                  <FormLabel>Whitepaper Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://drive.google.com/drive/..."
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trim()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
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
                      autoComplete="off"
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
                  <FormLabel>Twitter Handle *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://twitter.com/"
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trim()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/JohnDoe"
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trim()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
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
                        <TooltipTrigger asChild type="reset">
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
                      autoComplete="off"
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
                  <FormLabel>Discord Handle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://discord.gg/HptzpRVY"
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trim()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactMedium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://Medium.com"
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trim()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          {...getInputProps()}
                          id="dropzone-file"
                          accept="image/png, image/jpeg"
                          type="file"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <label
                          htmlFor="dropzone-file"
                          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                          {!urlRegex.test(field.value || '') && (
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
                                Click to upload &#40; image should be 500x500 px
                                & under 10 MB &#41;
                              </p>
                            </div>
                          )}

                          {urlRegex.test(field.value || '') && (
                            <div className="text-center">
                              <Image
                                width={1000}
                                height={1000}
                                src={field.value}
                                className=" w-full object-contain max-h-16 mx-auto mt-2 mb-3 opacity-70"
                                alt="uploaded image"
                              />
                              <p className=" text-sm font-semibold">
                                Image Uploaded
                              </p>
                              <Button
                                className="px-2 mt-2"
                                variant="astra-red"
                                onClick={(e) => {
                                  e.preventDefault()
                                  form.setValue(`projectImage`, '')
                                }}
                              >
                                Delete Image
                              </Button>
                              <p className=" text-xs text-red-500">
                                {fileError}
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="bg-gray-400"></Separator>
            <div className="text-center w-full mt-6">
              <FormLabel className="text-2xl text-center">
                Token Sale Details
              </FormLabel>
            </div>
            <FormField
              control={form.control}
              name="totalSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">
                    <span className="mr-2">Total Supply *</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild type="reset">
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
                            : (parseInt(inputValue, 10) || 0).toLocaleString(
                                'en-US'
                              )
                        // Update the input value in the form
                        field.onChange(formattedValue)
                      }}
                      autoComplete="off"
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
                      autoComplete="off"
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
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Token decimal represents the number of decimal
                            places <br /> used to define the smallest unit of a
                            launchpad token, <br /> such as 1*10^18 for a value
                            of 18.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 18  (Must be positive)"
                      {...field}
                      onWheel={(event) => event.currentTarget.blur()}
                      autoComplete="off"
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
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger ref={field.ref}>
                        <SelectValue placeholder="Select a launchpad token category." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="metaverse">Metaverse</SelectItem>
                      <SelectItem value="defi">DeFi</SelectItem>
                      <SelectItem value="dex">DEX</SelectItem>
                      <SelectItem value="cex">CEX</SelectItem>
                      <SelectItem value="meme">Meme</SelectItem>
                      <SelectItem value="ai">AI</SelectItem>
                      <SelectItem value="socialNetwork">
                        Social Network
                      </SelectItem>
                      <SelectItem value="depin">DePin</SelectItem>
                      <SelectItem value="rwa">Real World Assets</SelectItem>
                      <SelectItem value="privacy">Privacy</SelectItem>
                      <SelectItem value="bridge">Bridge</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
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
                        <TooltipTrigger asChild type="reset">
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
                      autoComplete="off"
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
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger ref={field.ref}>
                        <SelectValue placeholder="e.g. USDC (Please select base token category)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={chainConfig.USDCContractAddress}>
                        USDC
                      </SelectItem>
                      <SelectItem value={chainConfig.USDTContractAddress}>
                        USDT
                      </SelectItem>
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
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Token sale amount refers to the total quantity of
                            tokens <br /> made available for purchase during a
                            token sale event.
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
                            : (parseInt(inputValue, 10) || 0).toLocaleString(
                                'en-US'
                              )
                        // Update the input value in the form
                        field.onChange(formattedValue)
                      }}
                      autoComplete="off"
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
                      onWheel={(event) => event.currentTarget.blur()}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minPurchaseAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">
                    <span className="mr-2">Minimum User Contribution *</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Minimum User Contribution is the minimum amount that
                            an individual <br /> participant can contribute
                            during a token sale event.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      placeholder="Minimum user contribution  e.g. $10"
                      {...field}
                      onChange={(e) => {
                        // Remove commas from the input value
                        const inputValue = e.target.value.replace(/,/g, '')
                        // Set the formatted value with commas
                        const formattedValue =
                          inputValue === '0-'
                            ? '-'
                            : (parseInt(inputValue, 10) || 0).toLocaleString(
                                'en-US'
                              )
                        // Update the input value in the form
                        field.onChange(formattedValue)
                      }}
                      autoComplete="off"
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
                    <span className="mr-2">Maximum User Contribution *</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Maximum User Contribution is the maximum amount that
                            an individual <br /> participant can contribute
                            during a token sale event.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      placeholder="Maximum user contribution  e.g. $30"
                      {...field}
                      onChange={(e) => {
                        // Remove commas from the input value
                        const inputValue = e.target.value.replace(/,/g, '')
                        // Set the formatted value with commas
                        const formattedValue =
                          inputValue === '0-'
                            ? '-'
                            : (parseInt(inputValue, 10) || 0).toLocaleString(
                                'en-US'
                              )
                        // Update the input value in the form
                        field.onChange(formattedValue)
                      }}
                      autoComplete="off"
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
                    Fully Diluted Market Cap AKA Valuation (IDO Token Price X
                    Total Tokens) *
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
                            : /^[0-9]+\.$/.test(inputValue)
                              ? (parseFloat(inputValue) || 0).toLocaleString(
                                  'en-US'
                                ) + '.'
                              : (parseFloat(inputValue) || 0).toLocaleString(
                                  'en-US'
                                )
                        // Update the input value in the form
                        field.onChange(formattedValue)
                      }}
                      autoComplete="off"
                    />
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
                  <FormLabel className="flex">
                    <span className="mr-2">Sale Start Time *</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Sale start time must be prior than sale end time.
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
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Sale end time must be after than sale start time.
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
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The soft cap is the minimum fundraising goal that a
                            launchpad <br /> project must achieve during its
                            token sale.
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
                            : (parseInt(inputValue, 10) || 0).toLocaleString(
                                'en-US'
                              )
                        // Update the input value in the form
                        field.onChange(formattedValue)
                      }}
                      autoComplete="off"
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
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The hard cap is the maximum fundraising goal that a
                            launchpad <br /> project can achieve during its
                            token sale.
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
                            : (parseInt(inputValue, 10) || 0).toLocaleString(
                                'en-US'
                              )
                        // Update the input value in the form
                        field.onChange(formattedValue)
                      }}
                      autoComplete="off"
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
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Initial market cap is the total market value of a
                            launchpad <br />
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
                            : (parseInt(inputValue, 10) || 0).toLocaleString(
                                'en-US'
                              )
                        // Update the input value in the form
                        field.onChange(formattedValue)
                      }}
                      autoComplete="off"
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
                        values[`vest_cliff`] = '0'
                        values[`vest_duration`] = '0'
                        values[`vest_slice_period_seconds`] = '0'
                        values[`vest_initial_unlock`] = '0'
                        form.reset(values)
                      }}
                    />
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
                            <TooltipTrigger asChild type="reset">
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Vesting start time must be after than sale end
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
                  name="vest_cliff"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">
                        <span className="mr-2">Vesting Cliff *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild type="reset">
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                A vesting cliff is a specific period within a
                                vesting schedule during <br /> which no tokens
                                are awarded, followed by a period where <br /> a
                                certain portion of tokens become available for
                                the holder.
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
                          onWheel={(event) => event.currentTarget.blur()}
                          autoComplete="off"
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
                            <TooltipTrigger asChild type="reset">
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Vesting duration is the length of time over
                                which tokens gradually <br /> become available
                                to the holder after a vesting cliff.
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
                          onWheel={(event) => event.currentTarget.blur()}
                          autoComplete="off"
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
                            <TooltipTrigger asChild type="reset">
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Vesting frequency refers to how often tokens
                                become available <br /> to the holder after the
                                vesting cliff.
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
                          onWheel={(event) => event.currentTarget.blur()}
                          autoComplete="off"
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
                        <span className="mr-2">Vesting Initial Unlock *</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild type="reset">
                              <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Vesting initial unlock refers to the first
                                instance when a portion of tokens <br /> becomes
                                available to the holder after the vesting cliff
                                period.
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
                          onWheel={(event) => event.currentTarget.blur()}
                          autoComplete="off"
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
            <div className="text-center w-full mt-6">
              <FormLabel className="text-2xl text-center">
                Other Details
              </FormLabel>
            </div>
            <FormField
              control={form.control}
              name="leadVC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead VC</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Acura Capital"
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trimStart()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
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
                  <FormLabel>Market Maker</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Kairon Labs"
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trimStart()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="investorDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">
                    <span className="mr-2">Investor List</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Write down the investor list, separated by commas.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Jhon, Jane, James"
                      {...field}
                      onChange={(e) => {
                        const temp = e
                        temp.target.value = temp.target.value.trimStart()
                        field.onChange(temp)
                      }}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="raised"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">
                    <span className="mr-2">Total Raised Amount</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild type="reset">
                          <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Please write down the total amount <br /> you have
                            raised so far.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      type="string"
                      placeholder="e.g. 1000"
                      {...field}
                      onChange={(e) => {
                        // Remove commas from the input value
                        const inputValue = e.target.value.replace(/,/g, '')
                        // Set the formatted value with commas
                        const formattedValue =
                          inputValue === '0-'
                            ? '-'
                            : (parseInt(inputValue, 10) || 0).toLocaleString(
                                'en-US'
                              )
                        // Update the input value in the form
                        field.onChange(formattedValue)
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
                    <FormLabel className="text-2xl text-center">Team</FormLabel>
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
                            temp.target.value = temp.target.value.trimStart()
                            field.onChange(temp)
                          }}
                          autoComplete="off"
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
                          {...field}
                          onChange={(e) => {
                            const temp = e
                            temp.target.value = temp.target.value.trimStart()
                            field.onChange(temp)
                          }}
                          autoComplete="off"
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
                            temp.target.value = temp.target.value.trimStart()
                            field.onChange(temp)
                          }}
                          autoComplete="off"
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
                            temp.target.value = temp.target.value.trimStart()
                            field.onChange(temp)
                          }}
                          autoComplete="off"
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
                          {...field}
                          onWheel={(event) => event.currentTarget.blur()}
                          autoComplete="off"
                          onChange={(e) => {
                            const temp = e
                            const str = temp.target.value
                            if (str !== '0')
                              temp.target.value = str.replace(/^0+/, '') || '0'
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
            <div className="flex items-center justify-center">
              <Button variant="astra-blue" type="submit" isLoading={isLoading}>
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
