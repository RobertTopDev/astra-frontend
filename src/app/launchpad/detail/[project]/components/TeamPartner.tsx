'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef, useCallback, useMemo, Key } from 'react'
import { usePathname } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import styles from './update-modal.module.scss'
import { AstraHeader } from '@/components'
import TeamCard from './TeamCard'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  Input,
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  Separator,
  Textarea,
  FormField,
} from '@/components/shadcn'
import clsx from 'clsx'
import { TeamObject, TLaunchpadDetailInfo } from '@/types'
import _ from 'lodash'
import { updateLaunchpadForDB } from '@/util/updateLaunchpadForDB'
// import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import Image from 'next/image'
import 'suneditor/dist/css/suneditor.min.css'
import './projectDetail.scss'

interface Props {
  data: TLaunchpadDetailInfo | undefined
  refetchData?: () => Promise<void>
}

export default function TeamPartner({ data, refetchData }: Props) {
  const pathname = usePathname()
  const urlRegex = new RegExp('^(ftp|http|https)://[^ "]+$')

  // const DynamicTextEditor = useMemo(() => {
  //   return dynamic(() => import('@/components/Editor'), {
  //     loading: () => <p>loading...</p>,
  //     ssr: true,
  //   })
  // }, [])

  const SunEditor = useMemo(() => {
    return dynamic(() => import('suneditor-react'), {
      loading: () => <p>loading...</p>,
      ssr: true,
    })
  }, [])

  const reactQuillRef = useRef<ReactQuill>(null)
  const [imageFile, setImageFile] = useState<Record<`avatar${number}`, string>>(
    {}
  )

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

  const uploadImage = useCallback((index: number) => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0]
        form.setValue(`avatar${index}`, file)
        // Create a data URL from the uploaded file
        const reader = new FileReader()
        reader.onload = () => {
          setImageFile((prevImageFile) => ({
            ...prevImageFile,
            [`avatar${index}`]: reader.result as string,
          }))
        }
        reader.readAsDataURL(file)
      }
    }
  }, [])

  const onImageUploadBefore = () => {
    return (files: File[], info: any, uploadHandler: any) => {
      ;(async () => {
        try {
          const images = []
          for (const file of files) {
            //Do something with image
            const url = await uploadToCloudinary(file)

            const image = {
              url: url,
              name: file.name,
              size: file.size,
            }

            images.push(image)
          }
          const response = {
            result: images,
          }
          uploadHandler(response)
        } catch (error) {
          console.error('Error uploading image to Cloudinary', error)
        }
      })()

      uploadHandler()
    }
  }

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const teamInfoArray = JSON.parse(
    data?.TEAM_INFO.replace(/\n/g, '\\n') || '[]'
  )
  const [team, setTeam] = useState<TeamObject[]>([
    {
      name: '',
      position: '',
      description: '',
      linkedin: '',
      twitter: '',
      avatar: '',
    },
  ])
  const temp: Record<string, any> = {
    teamDescription: z.coerce.string(),
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
    temp[`linkedin${i}`] = z.string().regex(/^[^'"]*$/, {
      message: 'Linkedin url cannot contain single or double quotes.',
    })
    temp[`twitter${i}`] = z.string().regex(/^[^'"]*$/, {
      message: 'Twitter url cannot contain single or double quotes.',
    })
    temp[`avatar${i}`] = z.any()
  }
  const teamSchema = z.object(temp)

  const teamDefaultValues: Record<string, any> = {
    teamDescription: data?.TEAM_DESCRIPTION || '',
  }
  teamInfoArray.map((item: TeamObject, key: any) => {
    teamDefaultValues[`name${key}`] = item.name.trim()
    teamDefaultValues[`position${key}`] = item.position.trim()
    teamDefaultValues[`description${key}`] = item.description.trim()
    teamDefaultValues[`linkedin${key}`] = item?.linkedin?.trim() || ''
    teamDefaultValues[`twitter${key}`] = item?.twitter?.trim() || ''
    teamDefaultValues[`avatar${key}`] = item?.avatar?.trim() || ''
  })

  useEffect(() => {
    setTeam(teamInfoArray)
    let tempAvatar: Record<`avatar${number}`, string> = {}
    for (let i = 0; i < teamInfoArray.length; i++) {
      tempAvatar = Object.assign({}, tempAvatar, {
        [`avatar${i}`]: urlRegex.test(teamInfoArray[i]?.avatar)
          ? teamInfoArray[i]?.avatar
          : '',
      })
    }
    setImageFile(tempAvatar)
  }, [data?.TEAM_INFO])

  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    delayError: 300,
    reValidateMode: 'onChange',
    defaultValues: teamDefaultValues,
  })

  async function onSubmit(value: z.infer<typeof teamSchema>) {
    if (isLoading) {
      alert('Loading')
      return
    }

    try {
      setIsLoading(true)
      const valueArray = []
      for (let i = 0; i < team.length; i++) {
        const url = await uploadToCloudinary(value[`avatar${i}`])
        valueArray.push({
          name: value[`name${i}`].replace(/"/g, '\\"').trim(),
          position: value[`position${i}`].replace(/"/g, '\\"').trim(),
          description: value[`description${i}`].replace(/\n/g, '\\n').trim(),
          linkedin: value[`linkedin${i}`].replace(/"/g, '\\"').trim(),
          twitter: value[`twitter${i}`].replace(/"/g, '\\"').trim(),
          avatar: url,
        })
        form.setValue(`name${i}`, value[`name${i}`].trim())
        form.setValue(`position${i}`, value[`position${i}`].trim())
        form.setValue(`description${i}`, value[`description${i}`].trim())
        form.setValue(`linkedin${i}`, value[`linkedin${i}`].trim())
        form.setValue(`twitter${i}`, value[`twitter${i}`].trim())
      }

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
        teamInfo: JSON.stringify(valueArray),
        teamDescription: value.teamDescription || '',
        // metrics: data?.METRICS,
        saleRoundDetail: data?.SALE_ROUND_DETAIL || '',
        websiteUrl: data?.WEBSITE_URL,
        whitepaperUrl: data?.WHITEPAPER_URL,
        twitter: data?.TWITTER,
        telegram: data?.TELEGRAM,
        discord: data?.DISCORD,
        otherUrl: data?.OTHER_URL,
        email: data?.EMAIL,
        // investorDetail: JSON.stringify(
        //   (
        //     JSON.parse(data?.INVESTOR_DETAIL?.replace(/\n/g, '\\n') || '[]').join(
        //       ', '
        //     ) || ''
        //   )
        //     .split(',')
        //     .map((investor: string) => investor.trim().replace(/"/g, '\\"'))
        // ),
        chain: data?.CHAIN,
        requestTransaction: data?.REQUEST_TRANSACTION,
        approveTransaction: data?.APPROVE_TRANSACTION,
        status: data?.STATUS,
        leadVC: data?.LEAD_VC,
        marketMaker: data?.MARKET_MAKER,
        controlledCap: data?.CONTROLLED_CAP,
        daoApprovedMetrics: data?.DAO_APPROVED_METRICS,
        tokenType: data?.TOKEN_TYPE,
        baseToken: data?.BASE_TOKEN,
        isVesting: data?.IS_VESTING,
        vest_start: data?.VEST_START,
        vest_cliff: data?.VEST_CLIFF,
        vest_duration: data?.VEST_DURATION,
        vest_slice_period_seconds: data?.VEST_SLICE_PERIOD_SECONDS,
        vest_initial_unlock: data?.VEST_INITIAL_UNLOCK,
      }
      const res = await updateLaunchpadForDB(requestData, data?.ID + '')
      if (res.ok) {
        setTeam(valueArray)
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
  const handleAddInput = () => {
    const index = team.length
    const values = form.getValues()
    values[`name${index}`] = ''
    values[`position${index}`] = ''
    values[`description${index}`] = ''
    values[`linkedin${index}`] = ''
    values[`twitter${index}`] = ''
    values[`avatar${index}`] = ''
    form.reset(values)
    setTeam([...team, { name: '', position: '', description: '' }])
  }
  const handleDeleteInput = () => {
    const index = team.length
    const values = form.getValues()
    delete values[`name${index - 1}`]
    delete values[`position${index - 1}`]
    delete values[`description${index - 1}`]
    delete values[`linkedin${index - 1}`]
    delete values[`twitter${index - 1}`]
    delete values[`avatar${index - 1}`]
    form.reset(values)
    setTeam((teams) => [...teams.slice(0, -1)])
  }
  const isAdmin = pathname.includes('owner') || pathname.includes('admin')

  const tempContainer = document.getElementById('teamDescription')

  // Set the HTML of the container to your string
  if (tempContainer) {
    tempContainer.innerHTML = data?.TEAM_DESCRIPTION || ''
  }
  return (
    <div>
      {isAdmin ? (
        <div className="mt-2 w-full text-right" id="team">
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
                <DialogTitle>Team Members Edit</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={clsx(
                    styles['index-form'],
                    'w-full flex flex-col gap-8'
                  )}
                >
                  {team.map((input, index) => (
                    <div key={index}>
                      <Separator className="bg-gray-400"></Separator>
                      {index == 0 ? (
                        <div className="text-center w-full mt-6">
                          <FormLabel className="text-2xl text-center">
                            Team
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
                                autoComplete="off"
                                placeholder="Ayush"
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
                                autoComplete="off"
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
                      <FormField
                        control={form.control}
                        name={`linkedin${index}`}
                        render={({ field }) => (
                          <FormItem className="my-8">
                            <FormLabel>Team Member Linkedin</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                placeholder="Team member linkedin profile url"
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
                        name={`twitter${index}`}
                        render={({ field }) => (
                          <FormItem className="my-8">
                            <FormLabel>Team Member Twitter Handle</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                placeholder="Team member twitter address"
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
                        name={`avatar${index}`}
                        render={({ field }) => (
                          <FormItem className="my-8">
                            <FormLabel>Team Member Avatar</FormLabel>
                            <div className="text-center">
                              <div className="flex justify-center mb-3">
                                <div style={{ width: '150px' }}>
                                  {!_.isEmpty(imageFile[`avatar${index}`]) && (
                                    <Image
                                      src={imageFile[`avatar${index}`]}
                                      alt="Astra Logo"
                                      width={140}
                                      height={140}
                                    />
                                  )}
                                </div>
                              </div>
                              <FormControl>
                                <Button
                                  variant="astra-blue"
                                  onClick={(e) => uploadImage(index)}
                                >
                                  Upload Avatar
                                </Button>
                              </FormControl>
                            </div>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-3 items-center justify-center">
                    <Button variant="astra-blue" onClick={handleAddInput}>
                      Add
                    </Button>
                    <Button
                      variant="astra-blue"
                      style={{ backgroundColor: 'tomato', border: 'none' }}
                      onClick={handleDeleteInput}
                      disabled={team.length === 1}
                    >
                      Delete
                    </Button>
                  </div>
                  <Separator className="bg-gray-400"></Separator>
                  <FormField
                    control={form.control}
                    name="teamDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Description</FormLabel>
                        <FormControl>
                          <div style={{ color: 'black' }}>
                            <SunEditor
                              defaultValue={field.value}
                              height="400px"
                              placeholder="Please insert project description."
                              onChange={field.onChange}
                              setOptions={{
                                buttonList: [
                                  // default
                                  ['font', 'fontSize', 'formatBlock'],
                                  ['blockquote'],
                                  [
                                    'bold',
                                    'underline',
                                    'italic',
                                    'strike',
                                    'subscript',
                                    'superscript',
                                  ],
                                  ['undo', 'redo'],
                                  ['fontColor', 'hiliteColor', 'textStyle'],
                                  ['removeFormat'],
                                  ['outdent', 'indent'],
                                  [
                                    'align',
                                    'horizontalRule',
                                    'list',
                                    'lineHeight',
                                  ],
                                  // ['table', 'link', 'image', 'video'],
                                  ['table', 'link', 'image'],
                                  ['showBlocks', 'codeView'],
                                  ['preview'],
                                  // responsive
                                  [
                                    '%1161',
                                    [
                                      [
                                        'font',
                                        'fontSize',
                                        'formatBlock',
                                        'blockquote',
                                      ],
                                      [
                                        ':p-Formats-default.more_paragraph',
                                        'bold',
                                        'underline',
                                        'italic',
                                        'strike',
                                        'subscript',
                                        'superscript',
                                      ],
                                      ['undo', 'redo'],
                                      ['fontColor', 'hiliteColor', 'textStyle'],
                                      ['removeFormat'],
                                      ['outdent', 'indent'],
                                      [
                                        'align',
                                        'horizontalRule',
                                        'list',
                                        'lineHeight',
                                      ],
                                      [
                                        '-right',
                                        ':i-Etc-default.more_vertical',
                                        'showBlocks',
                                        'codeView',
                                        'preview',
                                      ],
                                      [
                                        '-right',
                                        ':r-Table&Media-default.more_plus',
                                        'table',
                                        'link',
                                        'image',
                                        // 'video',
                                      ],
                                    ],
                                  ],
                                  [
                                    '%893',
                                    [
                                      [
                                        'font',
                                        'fontSize',
                                        'formatBlock',
                                        'blockquote',
                                      ],
                                      [
                                        ':p-Formats-default.more_paragraph',
                                        'bold',
                                        'underline',
                                        'italic',
                                        'strike',
                                      ],
                                      [
                                        ':t-Fonts-default.more_text',
                                        'subscript',
                                        'superscript',
                                        'fontColor',
                                        'hiliteColor',
                                        'textStyle',
                                      ],
                                      ['undo', 'redo'],
                                      ['removeFormat'],
                                      ['outdent', 'indent'],
                                      [
                                        'align',
                                        'horizontalRule',
                                        'list',
                                        'lineHeight',
                                      ],
                                      [
                                        '-right',
                                        ':i-Etc-default.more_vertical',
                                        'showBlocks',
                                        'codeView',
                                        'preview',
                                      ],
                                      [
                                        '-right',
                                        ':r-Table&Media-default.more_plus',
                                        'table',
                                        'link',
                                        'image',
                                        // 'video',
                                      ],
                                    ],
                                  ],
                                  [
                                    '%855',
                                    [
                                      [
                                        ':t-Fonts-default.more_text',
                                        'font',
                                        'fontSize',
                                        'formatBlock',
                                        'blockquote',
                                      ],
                                      [
                                        ':p-Formats-default.more_paragraph',
                                        'bold',
                                        'underline',
                                        'italic',
                                        'strike',
                                        'subscript',
                                        'superscript',
                                        'fontColor',
                                        'hiliteColor',
                                        'textStyle',
                                      ],
                                      ['undo', 'redo'],
                                      ['removeFormat'],
                                      ['outdent', 'indent'],
                                      [
                                        'align',
                                        'horizontalRule',
                                        'list',
                                        'lineHeight',
                                      ],
                                      [
                                        ':r-Table&Media-default.more_plus',
                                        'table',
                                        'link',
                                        'image',
                                        // 'video',
                                      ],
                                      [
                                        '-right',
                                        ':i-Etc-default.more_vertical',
                                        'showBlocks',
                                        'codeView',
                                        'preview',
                                      ],
                                    ],
                                  ],
                                  [
                                    '%563',
                                    [
                                      [
                                        ':t-Fonts-default.more_text',
                                        'font',
                                        'fontSize',
                                        'formatBlock',
                                        'blockquote',
                                      ],
                                      [
                                        ':p-Formats-default.more_paragraph',
                                        'bold',
                                        'underline',
                                        'italic',
                                        'strike',
                                        'subscript',
                                        'superscript',
                                        'fontColor',
                                        'hiliteColor',
                                        'textStyle',
                                      ],
                                      ['undo', 'redo'],
                                      ['removeFormat'],
                                      ['outdent', 'indent'],
                                      [
                                        ':e-List&Line-default.more_horizontal',
                                        'align',
                                        'horizontalRule',
                                        'list',
                                        'lineHeight',
                                      ],
                                      [
                                        ':r-Table&Media-default.more_plus',
                                        'table',
                                        'link',
                                        'image',
                                        // 'video',
                                      ],
                                      [
                                        '-right',
                                        ':i-Etc-default.more_vertical',
                                        'showBlocks',
                                        'codeView',
                                        'preview',
                                      ],
                                    ],
                                  ],
                                  [
                                    '%458',
                                    [
                                      [
                                        ':t-Fonts-default.more_text',
                                        'font',
                                        'fontSize',
                                        'formatBlock',
                                        'blockquote',
                                      ],
                                      [
                                        ':p-Formats-default.more_paragraph',
                                        'bold',
                                        'underline',
                                        'italic',
                                        'strike',
                                        'subscript',
                                        'superscript',
                                        'fontColor',
                                        'hiliteColor',
                                        'textStyle',
                                        'removeFormat',
                                      ],
                                      ['undo', 'redo'],
                                      [
                                        ':e-List&Line-default.more_horizontal',
                                        'outdent',
                                        'indent',
                                        'align',
                                        'horizontalRule',
                                        'list',
                                        'lineHeight',
                                      ],
                                      [
                                        ':r-Table&Media-default.more_plus',
                                        'table',
                                        'link',
                                        'image',
                                        // 'video',
                                      ],
                                      [
                                        '-right',
                                        ':i-Etc-default.more_vertical',
                                        'showBlocks',
                                        'codeView',
                                        'preview',
                                      ],
                                    ],
                                  ],
                                ],
                              }}
                              onImageUploadBefore={onImageUploadBefore()}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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

      <div className="flex flex-col items-stretch">
        <div className="flex justify-center">
          <AstraHeader>{data?.LAUNCHPAD_TOKEN_NAME} Team</AstraHeader>
        </div>

        <div className="mt-8 gap-6 flex-wrap grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1">
          {teamInfoArray.map((item: TeamObject, i: Key | null | undefined) => (
            <TeamCard key={i} data={item} />
          ))}
        </div>

        <div className="mt-12" id="teamDescription"></div>
      </div>
    </div>
  )
}
