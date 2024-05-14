'use client'
import { AstraButtonAuthenticated, AstraCard } from '@/components'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn'
import React, { useState } from 'react'
import { SelectTokens } from './select-tokens'
import { TToken } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import styles from './create-form.module.scss'
import clsx from 'clsx'
import { CreateConfirmation } from './create-confirmation'
import { defaultChain } from '@/config'
import { erc20ABI, useAccount, useContractRead, useNetwork } from 'wagmi'
import { DAAAbi, indicesPaymentAbi } from '@/abis'
import { parseUnits } from 'viem'
import { addDays, addHours, addMonths, addWeeks } from 'date-fns'
import { useRouter } from 'next/navigation'
import {
  useAddPublicPool,
  useAstraAllowance,
  useChainConfig,
  useIndicesAmount,
} from '@/hooks'
import revalidateIndices from '@/app/indices/(page)/actions'

const REBALANCING_TIME =
  process.env.NODE_ENV !== 'production'
    ? (['Hourly', 'Daily', 'Weekly', 'Monthly'] as const)
    : (['Daily', 'Weekly', 'Monthly'] as const)

const createIndexFormSchema = z.object({
  rebalancingTime: z.enum(REBALANCING_TIME, {
    required_error: 'Rebalancing Time required',
  }),
  minimumTVL: z
    .string({
      required_error: 'Minimum TVL is required',
    })
    .regex(/^\$(?=.)\d{0,6}(\.\d{1,2})?$/, {
      message: 'Please input a correct TVL',
    }),
  indexName: z.string({ required_error: 'Index name is required' }),
  indexSymbol: z.string({ required_error: 'Index symbol is required' }),
  indexDescription: z.string({
    required_error: 'Index description is required',
  }),
  weights: z
    .array(
      z
        .string({ required_error: 'Weight is required' })
        .regex(/^(100|([1-9]?[0-9]|0))%$/, {
          message: 'Invalid Weight value',
        }),
      { required_error: 'Indices Tokens should not be empty' }
    )
    .min(1, { message: 'Indices Tokens should not be empty' })
    .refine(
      (val) =>
        Math.abs(
          val.map((v) => Number(v.slice(0, -1))).reduce((a, b) => a + b, 0) -
            100
        ) === 0,
      {
        message: 'Weights should total to 100',
      }
    ),
})

export type CreateIndexFormValues = z.infer<typeof createIndexFormSchema>

type TCreateFormProps = {
  allTokens: TToken[]
}

const CreateForm = ({ allTokens }: TCreateFormProps) => {
  const [selectedTokens, setSelectedTokens] = useState<TToken[]>([])
  const [tokenDialog, setTokenDialog] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { chain = defaultChain } = useNetwork()
  const { address } = useAccount()
  const router = useRouter()
  const { chainConfig } = useChainConfig()

  const form = useForm<CreateIndexFormValues>({
    mode: 'onBlur',
    resolver: zodResolver(createIndexFormSchema),
    reValidateMode: 'onBlur',
    // delayError: 750,
  })

  const tvl = form.watch('minimumTVL')
  const indexSymbol = form.watch('indexSymbol')
  const formValues = form.watch()

  const { data: astraAllowance } = useAstraAllowance({
    args: [address!, chainConfig.IndicesPaymentContractAddress],
    enabled: !!chain && !!chain.id && !!address,
  })
  const { data: stableCoinAddress } = useContractRead({
    address: chainConfig.DAAContractAddress,
    abi: DAAAbi,
    functionName: 'baseStableCoin',
  })
  const { data: stableCoinDecimals } = useContractRead({
    address: stableCoinAddress,
    abi: erc20ABI,
    functionName: 'decimals',
    enabled: stableCoinAddress !== undefined,
  })
  const { data: astraAmount } = useContractRead({
    address: chainConfig.IndicesPaymentContractAddress,
    abi: indicesPaymentAbi,
    functionName: 'astraAmount',
    enabled: !!chain && !!chain.id,
  })
  const getRebalancingTimeUnit = (rebalancingTime: string): bigint => {
    switch (rebalancingTime) {
      case 'Daily':
        return BigInt(Math.floor(addDays(new Date(), 1).getTime() / 1000))
      case 'Hourly':
        return BigInt(Math.floor(addHours(new Date(), 1).getTime() / 1000))
      case 'Weekly':
        return BigInt(Math.floor(addWeeks(new Date(), 1).getTime() / 1000))
      case 'Monthly':
        return BigInt(Math.floor(addMonths(new Date(), 1).getTime() / 1000))
      default:
        return BigInt(Math.floor(addHours(new Date(), 1).getTime() / 1000))
    }
  }

  const { utilisedAmount, depositedAmount } = useIndicesAmount()

  const {
    addPublicPool,
    error: addPublicPoolError,
    isLoading: addPublicPoolLoading,
  } = useAddPublicPool({
    enabled:
      form.formState.isValid &&
      astraAllowance !== undefined &&
      astraAmount !== undefined &&
      depositedAmount !== undefined &&
      utilisedAmount !== undefined &&
      depositedAmount - utilisedAmount >= astraAmount &&
      stableCoinDecimals !== undefined &&
      astraAllowance >= astraAmount?.valueOf(),
    args:
      form.formState.isValid &&
      !!formValues.weights &&
      !!formValues.minimumTVL &&
      !!formValues.rebalancingTime &&
      stableCoinDecimals !== undefined
        ? [
            selectedTokens.map((token) => token.id as `0x${string}`),
            formValues.weights.map((weight) =>
              !!weight ? BigInt(weight.slice(0, -1)) : BigInt(0)
            ),
            parseUnits(formValues.minimumTVL.slice(1), stableCoinDecimals),
            getRebalancingTimeUnit(formValues.rebalancingTime),
            formValues.indexName,
            formValues.indexSymbol,
            formValues.indexDescription,
          ]
        : undefined,
    onSuccessTx: async () => {
      await revalidateIndices()
      router.push('/indices')
    },
  })

  function onSubmit() {
    if (!address) return
    if (!isSubmitting) {
      setIsSubmitting(true)
      return
    }
    addPublicPool?.()
  }

  const toggleSelected = (token: TToken) => {
    if (selectedTokens.some((stok) => stok.id === token.id)) {
      setSelectedTokens((prev) => prev.filter((t) => t.id !== token.id))
      return
    } else {
      setSelectedTokens((prev) => [...prev, token])
    }
  }

  return (
    <AstraCard className="w-full bg-opacity-80">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={clsx(styles['index-form'], 'w-full')}
        >
          <div
            className={clsx(
              'flex-col gap-6 w-full',
              isSubmitting ? 'flex' : 'hidden'
            )}
          >
            {isSubmitting && (
              <CreateConfirmation
                isLoadingAddPublicPool={addPublicPoolLoading}
                addPublicPoolError={addPublicPoolError}
                addPublicPool={addPublicPool}
                form={form}
                selectedTokens={selectedTokens}
                allTokens={allTokens}
                toggleSelected={toggleSelected}
                tokenDialog={tokenDialog}
                setTokenDialog={setTokenDialog}
                setIsSubmitting={setIsSubmitting}
              />
            )}
          </div>
          <div
            className={clsx(
              'flex-col gap-6 w-full',
              isSubmitting ? 'hidden' : 'flex'
            )}
          >
            <>
              <SelectTokens
                selectedTokens={selectedTokens}
                allTokens={allTokens}
                toggleSelected={toggleSelected}
                tokenDialog={tokenDialog}
                setTokenDialog={setTokenDialog}
                form={form}
              />
              <Separator className="bg-astra-blue"></Separator>
              <FormField
                control={form.control}
                name="rebalancingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <div>Rebalancing Time</div>
                    </FormLabel>
                    <FormControl>
                      <Accordion
                        type="single"
                        collapsible
                        className="px-4 font-medium border-astra-blue bg-white placeholder:text-muted-foreground text-black focus-visible:outline-none file:bg-transparent focus-visible:ring-astra-blue rounded-lg border"
                      >
                        <AccordionItem value="item-1" className="border-0">
                          <AccordionTrigger className="hover:no-underline">
                            {field.value ? (
                              <span className="font-bold">{field.value}</span>
                            ) : (
                              <span className="text-muted-foreground">
                                Select Rebalancing Time
                              </span>
                            )}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-wrap gap-2">
                              {REBALANCING_TIME.map((time) => (
                                <div
                                  key={time}
                                  className={clsx(
                                    'cursor-pointer text-sm px-6 py-1 border border-astra-blue rounded-full',
                                    field.value === time &&
                                      'bg-astra-blue text-black'
                                  )}
                                  onClick={() => field.onChange(time)}
                                >
                                  {time}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minimumTVL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <div>Minimum TVL to Start Index: </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoCircledIcon className="w-1rem h-[1rem]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Minimum amount required to activate pool in USD
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide amount in USD"
                        {...field}
                        onBlur={() => {
                          if (tvl && tvl[0] !== '$') {
                            form.setValue(`minimumTVL`, `$${tvl}`)
                            form.trigger('minimumTVL')
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="indexName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create a name for your index:</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Index Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="indexSymbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create a symbol for your index:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Index Symbol"
                        {...field}
                        onBlur={() => {
                          if (indexSymbol && indexSymbol[0] !== 'i') {
                            form.setValue(`indexSymbol`, `i${indexSymbol}`)
                            form.trigger('indexSymbol')
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="indexDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your index:</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Description"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <AstraButtonAuthenticated>
                  <Button type="submit" variant="astra-blue">
                    CONTINUE
                  </Button>
                </AstraButtonAuthenticated>
              </div>
            </>
          </div>
        </form>
      </Form>
    </AstraCard>
  )
}

export { CreateForm }
