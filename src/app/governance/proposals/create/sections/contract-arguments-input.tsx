'use client'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
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
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { TIndex, TProposalContractABIInput } from '@/types'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'
import {
  days,
  durations,
  listOfContracts,
  updatePoolDropdown,
} from '../constants'
import { Chain } from 'wagmi'
import { chainConfig } from '@/config'

type TContractArgumentsInputProps = {
  input: TProposalContractABIInput
  indices: TIndex[]
  index: number
  form: UseFormReturn<
    {
      proposalInputs: string[]
    },
    unknown,
    undefined
  >
  chain: Chain
  functionName: string
}

const ContractArgumentsInput = ({
  input,
  indices,
  index,
  form,
  chain,
  functionName,
}: TContractArgumentsInputProps) => {
  const inputComponent = useCallback(
    ({
      value,
      ...field
    }: ControllerRenderProps<
      {
        proposalInputs: string[]
      },
      `proposalInputs.${number}`
    >) => {
      const isSelect =
        input?.iTokensDropdown ||
        input?.showLockUpDropdown ||
        input.showUpdatePoolDropdown ||
        input.showDaysDropdown ||
        (input.contractDropdown && !!chain)
      if (isSelect) {
        let options: {
          value: string
          label: string
        }[] = [{ value: '', label: '' }]
        if (input.iTokensDropdown)
          options = indices.map((i) => ({
            value: i.ITOKEN_ADDR,
            label: i.ITOKENNAME,
          }))
        else if (input.showLockUpDropdown) {
          options = durations
        } else if (input.showUpdatePoolDropdown) {
          options = updatePoolDropdown
        } else if (input.showDaysDropdown) {
          options = days
        } else {
          options = listOfContracts(chainConfig[chain.id]).map((c) => ({
            value: c.ADDRESS,
            label: c.NAME,
          }))
        }
        return options.length > 0 ? (
          <ContractArgumentsSelect
            options={options}
            placeholder={input.placeholder}
            key={`${functionName}_${input.name}`}
            defaultValue={value || input.defaultValue || ''}
            onValueChange={field.onChange}
          />
        ) : null
      } else {
        // if (!!input.value) {
        //   form.setValue(`proposalInputs.${index}`, input.value)
        // }
        return (
          <Input
            placeholder={input.placeholder}
            value={input.value || value || ''}
            key={`${functionName}_${input.name}`}
            {...field}
          />
        )
      }
    },
    [input, form, indices, chain, index]
  )

  return (
    <>
      <FormField
        control={form.control}
        name={`proposalInputs.${index}`}
        render={({ field }) => (
          <FormItem key={input.displayName}>
            <FormLabel className="flex items-center gap-1">
              <div>{input.displayName}</div>
              {!!input.tooltipText ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="w-1rem h-[1rem]" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{input.tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
            </FormLabel>
            <FormControl>{inputComponent(field)}</FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

const ContractArgumentsSelect = ({
  onValueChange,
  defaultValue,
  placeholder,
  options,
  key,
}: {
  onValueChange: Dispatch<SetStateAction<string | undefined>>
  defaultValue: string | undefined
  placeholder: string
  key: string
  options: {
    value: string
    label: string
  }[]
}) => {
  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={defaultValue !== undefined ? defaultValue : ''}
      key={key}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, idx) => (
          <SelectItem
            value={!!option.value ? option.value : ''}
            key={option.label + idx}
          >
            {!!option.label ? option.label : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { ContractArgumentsInput }
