'use client'
import { DAOAbi } from '@/abis'
import {
  AstraButtonAuthenticated,
  AstraHeader,
  AstraLoading,
} from '@/components'
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
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn'
import { defaultChain } from '@/config'
import { zodResolver } from '@hookform/resolvers/zod'
import { InfoCircledIcon, TrashIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import { encodeAbiParameters, formatUnits, getAddress, parseUnits } from 'viem'
import { useAccount, useContractRead, useNetwork } from 'wagmi'
import * as z from 'zod'
import styles from './create-proposal.module.scss'
import 'react-quill/dist/quill.snow.css'
import { ActionsTable } from './actions-table'
import { proposalActionsColumns } from './actions-table-columns'
import { TIndex, TProposalActionSelected } from '@/types'
import { CreateActionsDialog } from './create-actions-dialog'
import {
  useApprove,
  useAstraAllowance,
  useAstraDecimal,
  usePropose,
  useChainConfig,
} from '@/hooks'

const createProposalFormSchema = z.object({
  proposalName: z.string({
    required_error: 'Proposal Name is required',
  }),
  proposalSummary: z.string({
    required_error: 'Proposal Summary is required',
  }),
  proposalChain: z.string({
    required_error: 'Proposal Chain is required',
  }),
  proposalLinks: z.array(
    z.object({
      value: z
        .string({
          required_error: 'Link is required',
        })
        .regex(
          /(https?:(?!www\.)|(?!http:\/\/|https:\/\/)[a-zA-Z0-9.-]+\.[a-z]+)/,
          { message: 'Invalid Link' }
        ),
    })
  ),
})

type CreateProposalFormValues = z.infer<typeof createProposalFormSchema>

type TCreateProposalProps = { indices: TIndex[] }

const CreateProposal = ({ indices }: TCreateProposalProps) => {
  const [actionsDialog, setActionsDialog] = useState(false)
  const [proposalActions, setProposalActions] = useState<
    TProposalActionSelected[]
  >([])
  const [proposalActionEdit, setProposalActionEdit] =
    useState<TProposalActionSelected>()
  // const proposalActions: TProposalAction[] = []
  const form = useForm<CreateProposalFormValues>({
    resolver: zodResolver(createProposalFormSchema),
    delayError: 300,
    reValidateMode: 'onBlur',
    mode: 'onBlur',
    defaultValues: {
      proposalLinks: [{ value: '' }],
    },
  })
  const formValues = form.getValues()
  const { fields, append, remove } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'proposalLinks', // unique name for your Field Array
  })
  const { chain = defaultChain, chains } = useNetwork()
  const { chainConfig } = useChainConfig()

  const { data: proposalTokens, isLoading: loadingProposalTokens } =
    useContractRead({
      address: chainConfig.DAOContractAddress,
      abi: DAOAbi,
      functionName: 'proposalTokens',
    })
  const { address } = useAccount()

  const { data: astraDecimal } = useAstraDecimal()
  const { data: astraAllowance, refetch: refetchAstraAllowance } =
    useAstraAllowance({
      args: [address!, chainConfig.DAOContractAddress],
      enabled: !!address,
    })
  const {
    approve,
    isLoading: approveLoading,
    error: approveError,
  } = useApprove({
    minAmount: proposalTokens?.valueOf() || 0,
    address: chainConfig.AstraContractAddress,
    args: [
      chainConfig.DAOContractAddress,
      proposalTokens?.valueOf() || BigInt(0),
    ],
    enabled:
      form.formState.isValid &&
      proposalActions.length > 0 &&
      astraAllowance !== undefined &&
      proposalTokens !== undefined &&
      astraDecimal !== undefined &&
      chain !== undefined &&
      astraAllowance < proposalTokens?.valueOf(),
    onSuccessTx: () => {
      refetchAstraAllowance()
    },
  })

  const getEncodedParameters = (actions: TProposalActionSelected[]) => {
    return actions.map((action) => {
      const params = action.contractAbi[0].inputs.map((input) => ({
        name: input.name,
        type: input.internalType,
      }))
      const values = action.inputs.map((value, idx) => {
        const param = params[idx]
        const input = action.contractAbi[0].inputs[idx]
        if (param.type === 'bool') {
          return value === 'true'
        } else if (param.type === 'address') {
          return value
        } else {
          if (
            ['_proposalTokens', 'amount', '_rewardAmount'].includes(input.name)
          ) {
            return parseUnits(value, astraDecimal!.valueOf())
          } else {
            return BigInt(value)
          }
        }
      })
      return encodeAbiParameters(params, values)
    })
  }

  const getValues = (actions: TProposalActionSelected[]) => {
    return actions.map((action) => {
      if (!action.contractAbi[0].payable) return BigInt('0')
      return action.inputs.reduce((acc, value, idx) => {
        const input = action.contractAbi[0].inputs[idx]
        if (input.name === 'amount') {
          acc = acc + parseUnits(value, astraDecimal!.valueOf())
        }
        return acc
      }, BigInt('0'))
    })
  }

  const {
    propose,
    isLoading: proposeLoading,
    error: proposeError,
  } = usePropose({
    address: chainConfig.DAOContractAddress,
    enabled:
      form.formState.isValid &&
      proposalActions.length > 0 &&
      astraAllowance !== undefined &&
      proposalTokens !== undefined &&
      astraAllowance >= proposalTokens?.valueOf(),
    args: form.formState.isValid
      ? [
          formValues.proposalChain.split(' ')[0],
          proposalActions.map((action) => getAddress(action.value)),
          getValues(proposalActions),
          proposalActions.map((action) => {
            const abi = action.contractAbi[0]

            let actionText = `${abi.name}(`
            for (let idx = 0; idx < abi.inputs.length; idx++) {
              const input = abi.inputs[idx]
              actionText += `${input.type},`
            }
            actionText = actionText.slice(0, -1) + ')'
            return actionText
          }),
          getEncodedParameters(proposalActions),
          JSON.stringify({
            title: formValues.proposalName,
            description: formValues.proposalSummary,
            links: formValues.proposalLinks.map((link) => link.value),
          }),
          false,
        ]
      : undefined,
  })

  const onSubmit = () => {
    if (propose !== undefined && !actionsDialog) {
      propose?.()
    }
  }

  const addProposalAction = (value: TProposalActionSelected) => {
    setProposalActions((prev) => [...prev, value])
  }

  const updateProposalAction = (
    value: TProposalActionSelected,
    index: number
  ) => {
    setProposalActions((prev) => {
      const newActions = prev
      newActions[index] = value
      return newActions
    })
    setProposalActionEdit(undefined)
  }

  const editProposalAction = (value: TProposalActionSelected) => {
    setProposalActionEdit({ ...value, actionIndex: value.actionIndex })
    setActionsDialog(true)
  }

  const deleteProposalAction = (index: number) => {
    setProposalActions((prev) => prev.filter((_, idx) => idx !== index))
  }

  const submitButton = () => {
    if (astraAllowance === undefined || proposalTokens === undefined) {
      return <Skeleton className="w-[200px] h-[40px] rounded-full" />
    }
    if (astraAllowance < proposalTokens?.valueOf()) {
      return (
        <>
          <Button
            variant="astra-blue"
            disabled={!approve || !!approveError || approveLoading}
            isLoading={approveLoading}
            onClick={() => approve?.()}
          >
            APPROVE
          </Button>
          {approveError && (
            <div className="text-destructive text-sm">
              An error occurred preparing the transaction:&nbsp;
            </div>
          )}
        </>
      )
    } else {
      return (
        <>
          <Button
            variant="astra-blue"
            type="submit"
            disabled={!!proposeError || proposeLoading || !propose}
            isLoading={proposeLoading}
          >
            CREATE PROPOSAL
          </Button>
          {proposeError && (
            <div className="text-destructive text-sm">
              An error occurred preparing the transaction:
              {/* {proposeError?.cause?.reason} */}
            </div>
          )}
        </>
      )
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <AstraHeader className="text-center">Create Proposals</AstraHeader>
        <div className="text-center">
          Enter details of your proposal and submit it. <br /> To create a
          proposal&nbsp;
          <AstraLoading isLoading={loadingProposalTokens}>
            {proposalTokens !== undefined &&
              !!astraDecimal &&
              Number(
                formatUnits(proposalTokens?.valueOf(), astraDecimal?.valueOf())
              ).toLocaleString('en-US')}
          </AstraLoading>
          &nbsp; ASTRADAO tokens will be automatically staked for No lockup
          vault to complete the submission.&nbsp;
        </div>
        <div className="text-center">
          You can't create a proposal if you already have the pending or active
          one.&nbsp;
        </div>
        <div className="w-full mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={clsx(
                styles['create-proposal-form'],
                'w-full flex flex-col gap-6'
              )}
            >
              <FormField
                control={form.control}
                name="proposalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <div>Proposal Name</div>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Proposal Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proposalSummary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <div>Proposal Summary</div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="reset">
                            <InfoCircledIcon className="w-1rem h-[1rem]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Your description should contain a summary,
                              motivation, rationale, steps to implement,
                              timeline and overall cost.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <div className="w-full bg-white border border-astra-blue rounded-lg text-black">
                        <ReactQuill theme="snow" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proposalChain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <div>Chain Name</div>
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
                                Select Chain Name
                              </span>
                            )}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-wrap gap-2">
                              {chains.map((chain) => (
                                <div
                                  className={clsx(
                                    'cursor-pointer text-sm px-6 py-1 border border-astra-blue rounded-full',
                                    field.value === chain.name &&
                                      'bg-astra-blue text-black'
                                  )}
                                  onClick={() => field.onChange(chain.name)}
                                  key={chain.name}
                                >
                                  {chain.name}
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
              {fields.map((field, idx) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`proposalLinks.${idx}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <div>Proposal Links:</div>
                      </FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            placeholder="Add link to support proposal"
                            {...field}
                          />
                          {idx !== 0 || fields.length > 1 ? (
                            <TrashIcon
                              onClick={() => {
                                remove(idx)
                              }}
                              className="cursor-pointer text-black absolute right-[1rem] top-1/2 transform -translate-y-1/2"
                            />
                          ) : null}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <div className="flex justify-end">
                <Button
                  variant="astra-blue"
                  onClick={() => {
                    append({ value: '' })
                  }}
                >
                  + ADD ANOTHER LINK
                </Button>
              </div>
              <Separator></Separator>
              <div className="flex justify-between items-center">
                <FormLabel className="flex items-center gap-1">
                  <div>Proposal Actions</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="reset">
                        <InfoCircledIcon className="w-1rem h-[1rem]" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          You can select up to a maximum of 3 actions in one
                          proposal.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
              </div>
              <ActionsTable
                data={proposalActions}
                columns={proposalActionsColumns}
                editProposalAction={editProposalAction}
                deleteProposalAction={deleteProposalAction}
              ></ActionsTable>
              <div className="flex justify-end">
                <CreateActionsDialog
                  proposalActionEdit={proposalActionEdit}
                  setProposalActionEdit={setProposalActionEdit}
                  updateProposalAction={updateProposalAction}
                  actionsDialog={actionsDialog}
                  setActionsDialog={setActionsDialog}
                  chainName={form.getValues('proposalChain')}
                  indices={indices}
                  addProposalAction={
                    proposalActions.length < 3 ? addProposalAction : undefined
                  }
                />
              </div>
              <Separator></Separator>
              <div className="flex justify-center">
                <AstraButtonAuthenticated>
                  <div className="flex flex-col gap-2">{submitButton()}</div>
                </AstraButtonAuthenticated>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}

export { CreateProposal }
