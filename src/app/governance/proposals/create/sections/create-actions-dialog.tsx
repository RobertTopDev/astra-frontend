'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Form,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn'
import { chainConfig } from '@/config'
import {
  TIndex,
  TProposalActionSelected,
  TProposalContractABI,
  TProposalContractAction,
} from '@/types'
import React, { useState, useMemo, useEffect } from 'react'
import { useNetwork } from 'wagmi'
import { proposalOptions } from '../constants'
import styles from './create-proposal.module.scss'
import clsx from 'clsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ContractArgumentsInput } from './contract-arguments-input'
import { isAddress } from 'viem'

type TCreateActionsDialogProps = {
  actionsDialog: boolean
  setActionsDialog: (value: boolean) => void
  chainName: string | undefined
  indices: TIndex[]
  addProposalAction?: (value: TProposalActionSelected) => void
  proposalActionEdit?: TProposalActionSelected
  setProposalActionEdit: (value: TProposalActionSelected | undefined) => void
  updateProposalAction: (value: TProposalActionSelected, index: number) => void
}

const createProposalActionsFormSchema = z.object({
  proposalInputs: z.array(z.string({ required_error: 'Argument Required' })),
})

type CreateProposalActionsFormValues = z.infer<
  typeof createProposalActionsFormSchema
>

const CreateActionsDialog = ({
  actionsDialog,
  setActionsDialog,
  chainName,
  indices,
  addProposalAction,
  proposalActionEdit,
  updateProposalAction,
  setProposalActionEdit,
}: TCreateActionsDialogProps) => {
  const [selectedActionIndex, setSelectedActionIndex] = useState<string>('')
  const [selectedSubActionIndex, setSelectedSubActionIndex] = useState<string>()
  const { chains } = useNetwork()
  const chain = chains.find((chain) => chain.name === chainName)

  const form = useForm<CreateProposalActionsFormValues>({
    resolver: zodResolver(createProposalActionsFormSchema),
    delayError: 300,
    reValidateMode: 'onSubmit',
    defaultValues: {
      proposalInputs: proposalActionEdit?.inputs || [],
    },
  })

  const proposalOptionsArr = useMemo(() => {
    if (!chain) return []
    return proposalOptions(chainConfig[chain.id]) as TProposalContractAction[]
  }, [chain])

  const selectedAction = useMemo(
    () =>
      !selectedActionIndex
        ? undefined
        : proposalOptionsArr[Number(selectedActionIndex)],
    [selectedActionIndex, chain]
  )

  const selectedActionInputs = () => {
    if (!selectedAction) return null
    else if (selectedAction.hasDropdown) {
      let subActions
      if (!!selectedSubActionIndex && !!selectedAction.action) {
        const abi =
          selectedAction.action[Number(selectedSubActionIndex)].contractAbi[0]
        subActions = abi.inputs.map((input, index) => {
          if (!!input.value) {
            form.setValue(`proposalInputs.${index}`, input.value)
          }
          if (!input.hide) {
            return (
              <ContractArgumentsInput
                input={input}
                indices={indices}
                index={index}
                form={form}
                chain={chain!}
                functionName={abi.name}
                key={index}
              />
            )
          }
          return null
        })
      }
      return (
        <>
          <Select
            onValueChange={setSelectedSubActionIndex}
            defaultValue={selectedSubActionIndex}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an Action" />
            </SelectTrigger>
            <SelectContent>
              {selectedAction?.action?.map((proposalAction, index) => (
                <SelectItem value={index + ''} key={index}>
                  {proposalAction.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {subActions?.map((a) => a)}
        </>
      )
    } else if (selectedAction.contractAbi) {
      const abi = selectedAction.contractAbi[0]

      const res = abi.inputs.map((input, index) => {
        if (!!input.value) {
          form.setValue(`proposalInputs.${index}`, input.value)
        }
        if (input.name === '_poolId') {
          return null
        }
        return (
          <ContractArgumentsInput
            input={input}
            indices={indices}
            index={index}
            form={form}
            chain={chain!}
            functionName={abi.name}
            key={index}
          />
        )
      })

      return <>{res.map((r) => r)}</>
    }
  }

  function onSubmit(values: CreateProposalActionsFormValues) {
    let isValidated = true
    if (!selectedAction) return
    let abi: TProposalContractABI
    if (selectedAction?.hasDropdown) {
      abi =
        selectedAction.action![Number(selectedSubActionIndex)].contractAbi[0]
    } else {
      abi = selectedAction.contractAbi[0]
    }
    for (let idx = 0; abi.inputs.length > idx; idx++) {
      const input = abi.inputs[idx]
      const value = values.proposalInputs[idx]
      switch (input.type) {
        case 'uint256':
        case 'uint24':
          if (!/^(0|[1-9][0-9]*)$/.test(value)) {
            form.setError(`proposalInputs.${idx}`, {
              type: 'custom',
              message: 'Invalid Input',
            })
            isValidated = false
          } else if (input.max) {
            const numValue = parseInt(value)
            if (numValue > input.max) {
              form.setError(`proposalInputs.${idx}`, {
                type: 'custom',
                message: `Maximum value is ${input.max}`,
              })
              isValidated = false
            }
          }
          break
        case 'bool':
          if (value === 'true' || value === 'false') {
            continue
          } else {
            isValidated = false
            form.setError(`proposalInputs.${idx}`, {
              type: 'custom',
              message: 'Input is Required',
            })
          }
          break
        case 'address':
          if (!isAddress(value)) {
            isValidated = false
            form.setError(`proposalInputs.${idx}`, {
              type: 'custom',
              message: 'Input a valid Address',
            })
          }
          break
        default:
          if (!value) {
            form.setError(`proposalInputs.${idx}`, {
              type: 'custom',
              message: 'Input is Required',
            })
            isValidated = false
          }
          break
      }
    }

    if (!isValidated) return
    const finalValues = values.proposalInputs
    if (selectedAction.contractAbi[0].name === 'addItoken') {
      const ix = indices.find((ix) => ix.ITOKEN_ADDR === finalValues[0])
      if (ix) {
        finalValues[1] = ix.ITOKEN_INDEX
      }
    }

    if (!proposalActionEdit) {
      addProposalAction?.({
        inputs: finalValues,
        actionIndex: selectedActionIndex,
        subActionIndex: selectedSubActionIndex,
        ...selectedAction!,
        contractAbi: [abi],
      })
    } else {
      updateProposalAction(
        {
          inputs: finalValues,
          index: proposalActionEdit.index,
          subActionIndex: selectedSubActionIndex,
          actionIndex: selectedActionIndex,
          ...selectedAction!,
        },
        proposalActionEdit.index!
      )
    }
    setSelectedActionIndex('')
    setSelectedSubActionIndex('')
    setActionsDialog(!actionsDialog)
  }

  // useEffect(() => {
  //   if (
  //     selectedAction?.contractAbi !== undefined &&
  //     selectedAction?.contractAbi[0].name !== 'addItoken'
  //   ) {
  //     console.log({ selectedAction })
  //   }
  // }, [selectedAction])

  useEffect(() => {
    form.reset()
  }, [selectedActionIndex, selectedAction, selectedSubActionIndex])

  useEffect(() => {
    if (!!proposalActionEdit) {
      setSelectedActionIndex(proposalActionEdit.actionIndex)
      setSelectedSubActionIndex(proposalActionEdit.subActionIndex)
      form.setValue('proposalInputs', proposalActionEdit.inputs)
    }
  }, [proposalActionEdit])

  const onDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedActionIndex('')
      setSelectedSubActionIndex('')
      setProposalActionEdit(undefined)
      form.reset()
    }
    setActionsDialog(open)
  }

  return (
    <Dialog open={actionsDialog} onOpenChange={onDialogChange}>
      {!!addProposalAction && (
        <DialogTrigger asChild>
          {chain ? (
            <Button variant="astra-blue" disabled={!chain}>
              + ADD ACTIONS
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="astra-blue" disabled={!chain}>
                    + ADD ACTIONS
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select a Chain First!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-xl max-h-[90vh] bg-white text-black rounded-lg">
        <DialogHeader className="text-xl">
          {!proposalActionEdit ? 'Add' : 'Update'} Proposal Actions
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={clsx(
              styles['create-proposal-form'],
              'w-full flex flex-col gap-6'
            )}
          >
            <div
              className={clsx(
                styles['create-proposal-form'],
                'flex flex-col gap-4 w-full relative'
              )}
            >
              <Select
                onValueChange={setSelectedActionIndex}
                defaultValue={selectedActionIndex}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an Action" />
                </SelectTrigger>
                <SelectContent>
                  {proposalOptionsArr.map((proposalAction, index) => (
                    <SelectItem value={index + ''} key={index}>
                      {proposalAction.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedActionInputs()}
              <div className="flex justify-center">
                <Button variant="astra-blue" type="submit">
                  {!proposalActionEdit ? 'ADD ACTION' : 'UPDATE ACTION'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { CreateActionsDialog }
