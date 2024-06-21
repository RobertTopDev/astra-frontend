'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState, useRef, useMemo } from 'react'
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
  FormDescription,
  Separator,
  Textarea,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/shadcn'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { ProjectObject, TLaunchpadDetailInfo } from '@/types'
import _ from 'lodash'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TimeField } from '@/components/astra/time-field'
import { updateLaunchpadForDB } from '@/util/updateLaunchpadForDB'
import { useChainConfig } from '@/hooks'
import { isAddress } from 'viem'
import ReactQuill from 'react-quill'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { useNetwork } from 'wagmi'
import { idToChain } from '@/config'

interface Props {
  data: TLaunchpadDetailInfo
  refetchData?: () => Promise<void>
}
interface ImageFiles {
  projectImage?: File
  leadVCImage?: File
  marketMakerImage?: File
}

export default function ProjectDetail({ data, refetchData }: Props) {
  const DynamicTextEditor = useMemo(() => {
    return dynamic(() => import('@/components/Editor'), {
      loading: () => <p>loading...</p>,
      ssr: true,
    })
  }, [])

  const SunEditor = useMemo(() => {
    return dynamic(() => import('@/components/SunEditor'), {
      loading: () => <p>loading...</p>,
      ssr: true,
    })
  }, [])

  const EditorRef = useRef()

  const { chain } = useNetwork()
  const pathname = usePathname()
  const urlRegex = new RegExp('^(http|https|blob:http|blob:https)://[^ "]+$')
  const { chainConfig } = useChainConfig()
  const [open, setOpen] = useState(false)

  const [tempImageFile, setTempImageFile] = useState<ImageFiles>({})
  const [fileError, setFileError] = useState<string>('')

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldId: string
  ) => {
    if (event.target.files?.length) {
      const selectedImage = event.target.files[0]
      handleImageUpload(selectedImage, fieldId)
    }
  }

  const handleImageUpload = async (image: File, fieldId: string) => {
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
    type FormImageFieldNames =
      | 'projectImage'
      | 'leadVCImage'
      | 'marketMakerImage'

    setTempImageFile({ ...tempImageFile, [fieldId]: image })
    const fileUrl = URL.createObjectURL(image)
    form.setValue(fieldId as FormImageFieldNames, fileUrl)
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

//   function onImageUploadBefore(files , info , core ,uploadHandler){

//     // Upload image to Server

//     const src = UploadToServer(files[0]);

//     // result
//     const response = {
//         // The response must have a "result" array.
//         "result": [
//             {
//                 "url": src,
//                 "name": files[0].name,
//                 "size": files[0].size
//             },
//     ]}
    
//     uploadHandler(response);
// }
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [vesting, setVesting] = useState<boolean>(data?.IS_VESTING || false)
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

    // projectValuation: z
    //   .string() // Accept input as string
    //   .refine((value) => /^[0-9,]+$/.test(value), {
    //     // Ensure input contains only numbers and commas
    //     message: 'Project Valuation must be a valid number',
    //   })
    //   .refine((value) => value !== '', {
    //     // Ensure input is not empty
    //     message: 'Project Valuation is required',
    //   })
    //   .refine(
    //     (value) => {
    //       // Remove commas and check if the resulting string represents a valid number
    //       const numValue = Number(value.replace(/,/g, ''))
    //       return !isNaN(numValue) && numValue > 0
    //     },
    //     {
    //       message: 'Project Valuation must be a positive integer',
    //     }
    //   )
    //   .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

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
      .min(1, {
        message: 'Project deck url is required.',
      })
      .url({ message: 'Invalid url.' }),
    pitchdeck: z
      .string()
      .min(1, {
        message: 'Whitepaper URL is required.',
      })
      .url({ message: 'Invalid url.' }),
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
    github: z
      .string()
      .min(1, {
        message: 'Github link is required',
      })
      .url({ message: 'Invalid url.' }),
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
    leadVC: z.string().min(1, {
      message: 'Lead VC information is required.',
    }),
    marketMaker: z.string().min(1, {
      message: 'Market maker information is required.',
    }),
    investorDetail: z.string().min(1, {
      message: 'Investor list is required.',
    }),
    raised: z
      .string() // Accept input as string
      .refine((value) => /^[0-9,]+$/.test(value), {
        // Ensure input contains only numbers and commas
        message: 'Total raised amount must be a valid number.',
      })
      .refine((value) => value !== '', {
        // Ensure input is not empty
        message: 'Total raised amount is required.',
      })
      .refine(
        (value) => {
          // Remove commas and check if the resulting string represents a valid number
          const numValue = Number(value.replace(/,/g, ''))
          return !isNaN(numValue) && numValue > 0
        },
        {
          message: 'Total raised amount must be a positive integer.',
        }
      )
      .transform((value) => parseInt(value.replace(/,/g, ''), 10)), // Transform the string to an integer without commas

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
    leadVCImage: z
      .string()
      .min(1, {
        message: 'Lead VC image is required',
      })
      .url({ message: 'Invalid url.' }),
    marketMakerImage: z
      .string()
      .min(1, {
        message: 'Market maker image is required',
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
  const projectSchema = z
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

  let baseTokenTemp = ''
  if (data?.BASE_TOKEN === chainConfig.USDCContractAddress)
    baseTokenTemp = 'USDC'
  if (data?.BASE_TOKEN === chainConfig.USDTContractAddress)
    baseTokenTemp = 'USDT'

  const form = useForm<ProjectObject>({
    resolver: zodResolver(projectSchema),
    delayError: 300,
    reValidateMode: 'onChange',
    values: {
      saleStartDate: data ? new Date(data.SALE_START_TIME + 'Z') : new Date(),
      saleEndDate: data ? new Date(data.SALE_END_TIME + 'Z') : new Date(),
      tokenAddress: data ? data.LAUNCHPAD_TOKEN_ADDRESS : '',
      tokenAmount: data ? data.TOTAL_SALE_AMOUNT?.toLocaleString('en-US') : '',
      tokenPrice: data ? data.LAUNCHPAD_TOKEN_PRICE : '',
      minPurchaseAmount: data
        ? data.MIN_PURCHASE_BASE_AMOUNT?.toLocaleString('en-US')
        : '',
      baseAmount: data
        ? data.MAX_PURCHASE_BASE_AMOUNT?.toLocaleString('en-US')
        : '',
      tokenDecimals: data ? data.LAUNCHPAD_TOKEN_DECIMAL : '18',
      tokenSymbol: data ? data.LAUNCHPAD_TOKEN_SYMBOL?.toString() : '',
      totalSupply: data
        ? data.LAUNCHPAD_TOKEN_TOTAL_SUPPLY?.toLocaleString('en-US')
        : '',
      raised: data ? data.RAISED?.toLocaleString('en-US') : '',
      softCap: data ? data.SOFT_CAP?.toLocaleString('en-US') : '',
      hardCap: data ? data.HARD_CAP?.toLocaleString('en-US') : '',
      initialMarketCap: data
        ? data.INITIAL_MARKET_CAP?.toLocaleString('en-US')
        : '',
      projectValuation: '', // should remove project valuation
      tokenName: data ? data.LAUNCHPAD_TOKEN_NAME.toString() : '',
      website: data ? data.WEBSITE_URL.toString() : '',
      projectDeck: data ? data.PROJECT_DECK?.toString() : '',
      pitchdeck: data ? data.WHITEPAPER_URL?.toString() : '',
      projectDescription: data ? data?.PROJECT_DETAIL?.toString() : '',
      projectImage: data ? data?.PROJECT_IMAGE : '',
      email: data ? data.EMAIL?.toString() : '',
      projectTwitter: data ? data.TWITTER?.toString() : '',
      github: data ? data.GITHUB?.toString() : '',
      contactTelegram: data ? data.TELEGRAM?.toString() : '',
      contactDiscord: data ? data.DISCORD?.toString() : '',
      contactMedium: data ? data.MEDIUM?.toString() : '',
      totalToken: data ? data.LAUNCHPAD_TOKEN_FDV?.toLocaleString('en-US') : '',
      leadVC: data?.LEAD_VC || '',
      marketMaker: data?.MARKET_MAKER || '',
      investorDetail:
        JSON.parse(data?.INVESTOR_DETAIL?.replace(/\n/g, '\\n') || '[]').join(
          ', '
        ) || '',
      leadVCImage: urlRegex.test(data?.LEAD_VC_IMAGE)
        ? data?.LEAD_VC_IMAGE
        : '',
      marketMakerImage: urlRegex.test(data?.MARKET_MAKER_IMAGE)
        ? data?.MARKET_MAKER_IMAGE
        : '',

      controlledCap: data?.CONTROLLED_CAP || '',
      daoApprovedMetrics: data?.DAO_APPROVED_METRICS || '',
      tokenType: data?.TOKEN_TYPE || '',
      baseToken: baseTokenTemp || '',
      isVesting: data?.IS_VESTING,
      vest_start: data?.VEST_START
        ? new Date(data.VEST_START + 'Z')
        : new Date(),
      vest_cliff: data?.VEST_CLIFF / 86400 || '',
      vest_duration: data?.VEST_DURATION / 86400 || '',
      vest_slice_period_seconds: data?.VEST_SLICE_PERIOD_SECONDS / 86400 || '',
      vest_initial_unlock: data?.VEST_INITIAL_UNLOCK || '',
      projectDescriptionDetail: data?.PROJECT_DESCRIPTION_DETAIL || '',
      saleRoundDetail: data?.SALE_ROUND_DETAIL || '',
    },
  })
  function isUrl(value: string) {
    // Regular expression to check if the value is a valid URL
    return value.trim() === '' || urlRegex.test(value)
  }
  async function onSubmit(value: z.infer<typeof projectSchema>) {
    if (isLoading) {
      alert('Loading')
      return
    }
    setIsLoading(true)

    try {
      let baseTokenTemp = ''
      if (value.baseToken === 'USDC')
        baseTokenTemp = chainConfig.USDCContractAddress
      if (value.baseToken === 'USDT')
        baseTokenTemp = chainConfig.USDTContractAddress

      const projectImageUrl = tempImageFile?.projectImage
        ? await uploadToCloudinary(tempImageFile?.projectImage as File)
        : value?.projectImage
      const leadVCImageUrl = tempImageFile?.leadVCImage
        ? await uploadToCloudinary(tempImageFile?.leadVCImage as File)
        : value?.leadVCImage
      const marketMakerImageUrl = tempImageFile?.marketMakerImage
        ? await uploadToCloudinary(tempImageFile?.marketMakerImage as File)
        : value?.marketMakerImage

      const tempInvestorDetail = JSON.stringify(
        value.investorDetail
          .split(',')
          .map((investor: string) => investor.trim().replace(/"/g, '\\"'))
      )

      const requestData = {
        owner: data.OWNER as `0x${string}`,
        launchpadIndex:
          data.LAUNCHPAD_INDEX != null ? Number(data.LAUNCHPAD_INDEX) : null,
        launchpadAddress: data.LAUNCHPAD_ADDRESS,
        launchpadTokenAddress: value.tokenAddress,
        launchpadTokenName: value.tokenName.trim(),
        launchpadTokenSymbol: value.tokenSymbol.trim(),
        launchpadTotalSupply: value.totalSupply, // update
        raised: value.raised,
        launchpadTokenDecimal: value.tokenDecimals,
        launchpadTokenPrice: value.tokenPrice,
        launchpadTokenFDV: value.totalToken, // update
        totalSaleAmount: value.tokenAmount,
        saleStartTime: new Date(value.saleStartDate).getTime(),
        saleEndTime: new Date(value.saleEndDate).getTime(),
        minPurchaseBaseAmount: value.minPurchaseAmount,
        maxPurchaseBaseAmount: value.baseAmount,
        softCap: value.softCap, // update
        hardCap: value.hardCap, // update
        initialMarketCap: value.initialMarketCap, // update
        projectValuation: 0, // should remove
        projectDetail: value.projectDescription,
        projectDescriptionDetail: value.projectDescriptionDetail,
        projectImage: projectImageUrl,
        leadVCImage: leadVCImageUrl,
        marketMakerImage: marketMakerImageUrl,
        // teamInfo: data.TEAM_INFO,
        teamDescription: data.TEAM_DESCRIPTION || '',
        saleRoundDetail: data.SALE_ROUND_DETAIL || '',
        // metrics: data.METRICS,
        websiteUrl: value.website,
        projectDeck: value.projectDeck,
        whitepaperUrl: value.pitchdeck,
        twitter: value.projectTwitter,
        github: value.github,
        telegram: value.contactTelegram,
        discord: value.contactDiscord,
        medium: value.contactMedium,
        otherUrl: data.OTHER_URL,
        email: value.email,
        chain: data.CHAIN || (chain && idToChain[chain.id]) || 'Arbitrum',
        requestTransaction: data.REQUEST_TRANSACTION,
        approveTransaction: data.APPROVE_TRANSACTION,
        status: data.STATUS,
        leadVC: value.leadVC.trim(),
        marketMaker: value.marketMaker.trim(),
        investorDetail: tempInvestorDetail,
        controlledCap: '',
        daoApprovedMetrics: '',
        tokenType: value.tokenType,
        baseToken: baseTokenTemp,
        isVesting: value.isVesting,
        vest_start: value.vest_start
          ? new Date(value.vest_start).getTime()
          : new Date().getTime(),
        vest_cliff: Number(value.vest_cliff) * 86400 || 0,
        vest_duration: Number(value.vest_duration) * 86400 || 0,
        vest_slice_period_seconds:
          Number(value.vest_slice_period_seconds) * 86400 || 0,
        vest_initial_unlock: value.vest_initial_unlock || 0,
      }

      const res = await updateLaunchpadForDB(requestData, data?.ID + '')
      if (res.ok) {
        if (refetchData) {
          refetchData()
        }
        setIsLoading(false)
        setOpen(false)
      } else {
        throw new Error('Connection to the server failed.')
      }
    } catch (error) {
      console.error('Error during form submission:', error)
      alert('An error occurred during submission. Please try again later.')
      setIsLoading(false)
    }
  }

  const isAdmin = pathname.includes('owner') || pathname.includes('admin')

  const tempContainer = document.getElementById('projectDescriptionDetail')

  // Set the HTML of the container to your string
  if (tempContainer) {
    tempContainer.innerHTML = data?.PROJECT_DESCRIPTION_DETAIL || ''
  }

  const createOnDropHandler = (fieldId: string) => {
    return async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedImage = acceptedFiles[0]
        handleImageUpload(selectedImage, fieldId)
      }
    }
  }

  const projectDropzoneProps = useDropzone({
    onDrop: createOnDropHandler('projectImage'),
  })
  const leadVCDropzoneProps = useDropzone({
    onDrop: createOnDropHandler('leadVCImage'),
  })
  const marketMakerDropzoneProps = useDropzone({
    onDrop: createOnDropHandler('marketMakerImage'),
  })
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
            <DialogContent className="sm:max-w-xl max-h-[80vh] bg-whiterounded-3xl shadow  bg-[#15192b] text-white  overflow-y-auto overflow-x-auto">
              <DialogHeader>
                <DialogTitle>Project Details Edit</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={clsx(
                    styles['index-form'],
                    'w-full flex flex-col gap-8'
                  )}
                >
                  <Separator className="bg-gray-400"></Separator>
                  <div className="text-center w-full mt-6">
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
                            autoComplete="off"
                            placeholder="e.g. ASTRA"
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
                                  Please provide a brief description of your
                                  project <br /> within 300 characters.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
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
                            autoComplete="off"
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
                        <FormLabel>Whitepaper Link *</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
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
                    name="projectDeck"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Deck *</FormLabel>
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
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
                        <FormLabel>Twitter Handle *</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
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
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Github Link *</FormLabel>
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
                                  You can input a Telegram username (@johndoe){' '}
                                  <br />
                                  or URL (https://t.me/johndoe).
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder="e.g. @johndoe"
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
                        <FormLabel>Discord Handle</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
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
                    name="contactMedium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blog</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder="https://medium.com"
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
                              {...projectDropzoneProps.getRootProps()}
                              className=" flex items-center justify-center w-full"
                              ref={field.ref}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Input
                                {...projectDropzoneProps.getInputProps()}
                                id="projectImage-dropzone-file"
                                accept="image/*"
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageChange(e, 'projectImage')
                                }
                              />
                              <label
                                htmlFor="projectImage-dropzone-file"
                                className="relative flex items-center justify-center w-full py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                                      Click to upload &#40; image should be
                                      500x500 px & under 10 MB &#41;
                                    </p>
                                  </div>
                                )}

                                {urlRegex.test(field.value || '') && (
                                  <div className="text-center">
                                    <Image
                                      width={1000}
                                      height={1000}
                                      src={field.value as string}
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
                  <FormField
                    control={form.control}
                    name="projectDescriptionDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <div
                            style={{
                              color: 'black',
                              display: 'block',
                              position: 'relative',
                            }}
                          >
                            {/* <DynamicTextEditor
                              quillRef={reactQuillRef}
                              value={field.value}
                              onChange={field.onChange}
                            ></DynamicTextEditor> */}

                            <SunEditor
                              ref={EditorRef}
                              contents={field.value}
                              onSave={field.onChange}
                              // onImageUploadBefore={onImageUploadBefore()}
                            />
                          </div>
                        </FormControl>
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
                                  Total supply refers to the predetermined
                                  maximum number <br /> of tokens that will ever
                                  exist for this project.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            type="string"
                            placeholder="e.g. 10000000"
                            {...field}
                            onChange={(e) => {
                              // Remove commas from the input value
                              const inputValue = e.target.value.replace(
                                /,/g,
                                ''
                              )
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
                            autoComplete="off"
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
                              <TooltipTrigger asChild type="reset">
                                <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Token decimal represents the number of decimal
                                  places <br /> used to define the smallest unit
                                  of a launchpad token, <br /> such as 1*10^18
                                  for a value of 18.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            type="number"
                            placeholder="e.g. 18"
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
                            <SelectItem value="dex">DEX</SelectItem>
                            <SelectItem value="cex">CEX</SelectItem>
                            <SelectItem value="meme">Meme</SelectItem>
                            <SelectItem value="ai">AI</SelectItem>
                            <SelectItem value="socialNetwork">
                              Social Network
                            </SelectItem>
                            <SelectItem value="depin">DePin</SelectItem>
                            <SelectItem value="rwa">
                              Real World Assets
                            </SelectItem>
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
                                  starting <br /> with '0x' and being precisely
                                  42 characters in length.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
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
                              <SelectValue placeholder="e.g. USDC" />
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
                              <TooltipTrigger asChild type="reset">
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
                            autoComplete="off"
                            type="string"
                            placeholder="e.g. 1000"
                            {...field}
                            onChange={(e) => {
                              // Remove commas from the input value
                              const inputValue = e.target.value.replace(
                                /,/g,
                                ''
                              )
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
                            autoComplete="off"
                            type="number"
                            placeholder="e.g. $10"
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
                    name="minPurchaseAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex">
                          <span className="mr-2">
                            Minimum User Contribution *
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild type="reset">
                                <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Minimum User Contribution is the minimum
                                  amount that an individual <br /> participant
                                  can contribute during a token sale event.
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
                              const inputValue = e.target.value.replace(
                                /,/g,
                                ''
                              )
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
                          <span className="mr-2">
                            Maximum User Contribution *
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild type="reset">
                                <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Maximum User Contribution is the maximum
                                  amount that an individual <br /> participant
                                  can contribute during a token sale event.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            type="string"
                            placeholder="Maximum user contribution($)  e.g. $30"
                            {...field}
                            onChange={(e) => {
                              // Remove commas from the input value
                              const inputValue = e.target.value.replace(
                                /,/g,
                                ''
                              )
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
                          Fully Diluted Market Cap AKA Valuation (IDO Token
                          Price X Total Tokens) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            type="string"
                            placeholder="$30,000,000"
                            {...field}
                            onChange={(e) => {
                              // Remove commas from the input value
                              const inputValue = e.target.value.replace(
                                /,/g,
                                ''
                              )
                              // Set the formatted value with commas
                              const formattedValue =
                                inputValue === '0-'
                                  ? '-'
                                  : /^[0-9]+\.$/.test(inputValue)
                                    ? (
                                        parseFloat(inputValue) || 0
                                      ).toLocaleString('en-US') + '.'
                                    : (
                                        parseFloat(inputValue) || 0
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
                              initialFocus
                            />
                            <TimeField
                              onChange={(event) => {
                                const timeTemp: Date = field.value || new Date()
                                timeTemp.setHours(event.hour)
                                timeTemp.setMinutes(event.minute)
                                field.value = timeTemp
                                return true
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
                              initialFocus
                            />
                            <TimeField
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
                            autoComplete="off"
                            type="string"
                            placeholder="e.g. $100"
                            {...field}
                            onChange={(e) => {
                              // Remove commas from the input value
                              const inputValue = e.target.value.replace(
                                /,/g,
                                ''
                              )
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
                              <TooltipTrigger asChild type="reset">
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
                            autoComplete="off"
                            type="string"
                            placeholder="e.g. $10000"
                            {...field}
                            onChange={(e) => {
                              // Remove commas from the input value
                              const inputValue = e.target.value.replace(
                                /,/g,
                                ''
                              )
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
                              <TooltipTrigger asChild type="reset">
                                <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Initial market cap is the total market value
                                  of a launchpad <br />
                                  project upon its entry into the market.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            type="string"
                            placeholder="e.g. $50000"
                            {...field}
                            onChange={(e) => {
                              // Remove commas from the input value
                              const inputValue = e.target.value.replace(
                                /,/g,
                                ''
                              )
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
                              values[`vest_start`] = undefined
                              values[`vest_cliff`] = '0'
                              values[`vest_duration`] = '0'
                              values[`vest_slice_period_seconds`] = '0'
                              values[`vest_initial_unlock`] = '0'
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
                                  <TooltipTrigger asChild type="reset">
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
                                  selected={field.value ?? undefined}
                                  onSelect={field.onChange}
                                  // disabled={(date: any) =>
                                  //   date > new Date() || date < new Date('1900-01-01')
                                  // }
                                  initialFocus
                                />
                                <TimeField
                                  // value={state.timeValue}
                                  onChange={(event) => {
                                    const timeTemp: any = field.value
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
                                      A vesting cliff is a specific period
                                      within a vesting schedule during <br />{' '}
                                      which no tokens are awarded, followed by a
                                      period where <br /> a certain portion of
                                      tokens become available for the holder.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                type="number"
                                placeholder="e.g. 1(day) (Must be positive)"
                                {...field}
                                value={
                                  field.value !== null
                                    ? field.value.toString()
                                    : ''
                                }
                                onWheel={(event) => event.currentTarget.blur()}
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
                                      Vesting duration is the length of time
                                      over which tokens gradually <br /> become
                                      available to the holder after a vesting
                                      cliff.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                type="number"
                                placeholder="e.g. 365(days) (Must be positive)"
                                {...field}
                                value={
                                  field.value !== null
                                    ? field.value.toString()
                                    : ''
                                }
                                onWheel={(event) => event.currentTarget.blur()}
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
                                      Vesting frequency refers to how often
                                      tokens become available <br /> to the
                                      holder after the vesting cliff.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                type="number"
                                placeholder="e.g. 1(day) (Must be positive)"
                                {...field}
                                value={
                                  field.value !== null ? field.value : undefined
                                }
                                onWheel={(event) => event.currentTarget.blur()}
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
                                  <TooltipTrigger asChild type="reset">
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
                                autoComplete="off"
                                type="number"
                                placeholder="e.g. 10(%) (Must be positive integer between 1 - 100)"
                                {...field}
                                value={
                                  field.value !== null ? field.value : undefined
                                }
                                onWheel={(event) => event.currentTarget.blur()}
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
                        <FormLabel>Lead VC *</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
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
                            autoComplete="off"
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
                  <FormField
                    control={form.control}
                    name="investorDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex">
                          <span className="mr-2">Investor List *</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild type="reset">
                                <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Write down the investor list, separated by
                                  commas.
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
                          <span className="mr-2">Total Raised Amount *</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild type="reset">
                                <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Please write down the total amount <br /> you
                                  have raised so far.
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
                              const inputValue = e.target.value.replace(
                                /,/g,
                                ''
                              )
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

                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 h-full">
                      <FormField
                        control={form.control}
                        name="leadVCImage"
                        render={({ field }) => (
                          <FormItem className="py-3 h-full">
                            <FormLabel>Lead VC Image *</FormLabel>
                            <div className="text-center h-full">
                              <FormControl>
                                <div
                                  {...leadVCDropzoneProps.getRootProps()}
                                  className=" flex items-center justify-center w-full h-full"
                                  ref={field.ref}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                  }}
                                >
                                  <Input
                                    {...leadVCDropzoneProps.getInputProps()}
                                    id="leadVC-dropzone-file"
                                    accept="image/*"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                      handleImageChange(e, 'leadVCImage')
                                    }}
                                  />

                                  <label
                                    htmlFor="leadVC-dropzone-file"
                                    className="flex items-center justify-center w-full h-full py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                                          Click to upload &#40; image should be
                                          500x500 px & under 10 MB &#41;
                                        </p>
                                      </div>
                                    )}

                                    {urlRegex.test(field.value || '') && (
                                      <div className="text-center">
                                        <Image
                                          width={1000}
                                          height={1000}
                                          src={field.value as string}
                                          className=" w-full object-contain max-h-16 mx-auto mt-2 mb-3 opacity-70"
                                          alt="uploaded image"
                                        />
                                        <p className=" text-sm font-semibold">
                                          Image Uploaded
                                        </p>
                                        <Button
                                          className="px-1 mt-2"
                                          variant="astra-red"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            form.setValue(`leadVCImage`, '')
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
                    </div>
                    <div className="flex-1 h-full">
                      <FormField
                        control={form.control}
                        name="marketMakerImage"
                        render={({ field }) => (
                          <FormItem className="py-3 h-full">
                            <FormLabel>Market Maker Image *</FormLabel>
                            <div className="text-center h-full">
                              <FormControl>
                                <div
                                  {...marketMakerDropzoneProps.getRootProps()}
                                  className=" flex items-center justify-center w-full h-full"
                                  ref={field.ref}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Input
                                    {...marketMakerDropzoneProps.getInputProps()}
                                    id="marketMaker-dropzone-file"
                                    accept="image/*"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                      handleImageChange(e, 'marketMakerImage')
                                    }}
                                  />
                                  <label
                                    htmlFor="marketMaker-dropzone-file"
                                    className="flex items-center justify-center w-full h-full py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                                          Click to upload &#40; image should be
                                          500x500 px & under 10 MB &#41;
                                        </p>
                                      </div>
                                    )}

                                    {urlRegex.test(field.value || '') && (
                                      <div className="text-center">
                                        <Image
                                          width={1000}
                                          height={1000}
                                          src={field.value as string}
                                          className=" w-full object-contain max-h-16 mx-auto mt-2 mb-3 opacity-70"
                                          alt="uploaded image"
                                        />
                                        <p className=" text-sm font-semibold">
                                          Image Uploaded
                                        </p>
                                        <Button
                                          className="px-1 mt-2"
                                          variant="astra-red"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            form.setValue(
                                              `marketMakerImage`,
                                              ''
                                            )
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
                    </div>
                  </div>
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
      <div id="projectDescriptionDetail" className="view ql-editor"></div>
    </div>
  )
}
