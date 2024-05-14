'use client'
import { AstraInputSearch } from '@/components/astra/astra-input-search'
import {
  Button,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Separator,
  ScrollArea,
  DialogClose,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/shadcn'
import { TToken } from '@/types'
import { CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { CreateIndexFormValues } from '.'
import { WeightInput } from './weight-input'
import { MiniIdenticon } from '@/components/mini-identicon'
import Fuse from 'fuse.js'
import { numberFormatter } from '@/util'

type TSelectTokensProps = {
  selectedTokens: TToken[]
  allTokens: TToken[]
  toggleSelected: (token: TToken) => void
  tokenDialog: boolean
  setTokenDialog: (value: boolean) => void
  form: UseFormReturn<CreateIndexFormValues, unknown, undefined>
}

const SelectTokens = ({
  selectedTokens,
  allTokens,
  toggleSelected,
  tokenDialog,
  setTokenDialog,
  form,
}: TSelectTokensProps) => {
  const [search, setSearch] = useState('')
  const [filteredResults, setFilteredResults] = useState<TToken[]>(allTokens)

  const fuse = new Fuse(allTokens, {
    keys: ['symbol', 'name', 'contractAddress', '_totalValueLockedUSD'],
  })

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredResults(allTokens)
    } else {
      setFilteredResults(fuse.search(search).map((result) => result.item))
    }
  }, [search])

  return (
    <>
      <div className="flex justify-center">
        <Dialog open={tokenDialog} onOpenChange={setTokenDialog}>
          <DialogTrigger asChild>
            {selectedTokens.length === 0 ? (
              <Button variant="astra-blue">SELECT TOKENS</Button>
            ) : null}
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh] bg-white text-black">
            <DialogHeader></DialogHeader>
            <div className="flex flex-col gap-4 w-full">
              <div className="text-xl text-center font-bold">SELECT TOKENS</div>

              <AstraInputSearch
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></AstraInputSearch>

              {/* <div className="flex gap-1.5"> */}
              {/*   <div className="text-lg tracking-wide">Common Base</div> */}
              {/*   <TooltipProvider> */}
              {/*     <Tooltip> */}
              {/*       <TooltipTrigger> */}
              {/*         <InfoCircledIcon className="w-[1rem] h-[1rem]" /> */}
              {/*       </TooltipTrigger> */}
              {/*       <TooltipContent> */}
              {/*         <p>Common Tokens often paired with other tokens.</p> */}
              {/*       </TooltipContent> */}
              {/*     </Tooltip> */}
              {/*   </TooltipProvider> */}
              {/* </div> */}

              {/* <div className="flex flex-wrap gap-2"> */}
              {/*   {filteredResults.map((token) => ( */}
              {/*     <Button */}
              {/*       className="relative flex justify-center items-center gap-1 !px-3" */}
              {/*       variant="astra-white" */}
              {/*       onClick={() => toggleSelected(token)} */}
              {/*       key={'button' + token.symbol + token.name} */}
              {/*     > */}
              {/*       {selectedTokens.includes(token) && ( */}
              {/*         <CheckIcon className="absolute -right-1 -top-1 bg-black rounded-full text-white" /> */}
              {/*       )} */}
              {/*       <div className="h-[1.5rem] w-[1.5rem]"> */}
              {/*         <img src={token.img} alt={token.name}></img> */}
              {/*       </div> */}
              {/*       <div>{token.name}</div> */}
              {/*     </Button> */}
              {/*   ))} */}
              {/* </div> */}

              <Separator className="bg-astra-blue" />

              <div className="h-full w-full">
                <ScrollArea className="h-full w-full max-h-64 flex flex-col gap-2">
                  {filteredResults.map((token, i) => (
                    <div
                      className="relative flex gap-6 py-1 px-2 items-center cursor-pointer hover:bg-gray-100/80"
                      onClick={() => toggleSelected(token)}
                      key={'scroll' + token.symbol + token.name + i}
                    >
                      {!!token.img ? (
                        <img
                          className="w-[1.75rem] h-[1.75rem]"
                          src={token.img}
                          alt={token.name}
                        />
                      ) : (
                        <div className="relative w-[1.75rem] h-[1.75rem]">
                          <MiniIdenticon seed={token.id} />
                        </div>
                      )}

                      <div>
                        <h2 className="font-medium">
                          {token.name} - ({token.symbol})
                        </h2>
                        <p className="text-xs font-medium">
                          TVL - $
                          {numberFormatter(token._totalValueLockedUSD ?? '-')}
                        </p>
                      </div>
                      <div className="absolute right-4 transform top-1/2 -translate-y-1/2">
                        {selectedTokens.some((stok) => stok.id === token.id) ? (
                          <div className="h-[1.5rem] w-[1.5rem] flex justify-center items-center bg-black text-white rounded-full">
                            <CheckIcon />
                          </div>
                        ) : (
                          <div className="h-[1.5rem] w-[1.5rem] flex justify-center items-center border border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <div className="flex justify-center">
                <DialogClose asChild>
                  <Button variant="astra-blue">Continue</Button>
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {selectedTokens.length > 0 ? (
        <div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-12">
              <div className="col-span-3">Token Name</div>
              <div className="col-span-7 flex items-center justify-center gap-1 text-center w-full">
                <div>Weight</div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="w-[1rem] h-[1rem]" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Weight of each asset. Should total to 100%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Separator className="bg-white"></Separator>
            {selectedTokens.map((token, index) => (
              <div
                className="grid grid-cols-12 gap-2"
                key={'selected' + token.name + token.symbol}
              >
                <div className="col-span-3 flex items-start">
                  <div className="flex gap-6 items-center">
                    {!!token.img ? (
                      <img
                        className="w-[1.75rem] h-[1.75rem]"
                        src={token.img}
                        alt={token.name}
                      />
                    ) : (
                      <div className="relative w-[1.75rem] h-[1.75rem]">
                        <MiniIdenticon seed={token.id} />
                      </div>
                    )}

                    <div>
                      <h2 className="font-medium">{token.symbol}</h2>
                    </div>
                  </div>
                </div>
                <WeightInput index={index} form={form} />
                <div className="col-span-2">
                  <Button
                    variant="astra-blue"
                    className="!px-4"
                    onClick={() => {
                      form.setValue(
                        `weights`,
                        form.getValues('weights').filter((_, i) => i !== index)
                      )
                      toggleSelected(token)
                    }}
                  >
                    REMOVE
                  </Button>
                </div>
              </div>
            ))}
            <FormField
              control={form.control}
              name="weights"
              render={() => {
                return (
                  <FormItem className="flex flex-col justify-center items-center">
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <div className="flex items-center justify-center">
              <Button variant="astra-blue" onClick={() => setTokenDialog(true)}>
                + Add Token
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <FormField
          control={form.control}
          name="weights"
          render={() => {
            return (
              <FormItem className="flex flex-col justify-center items-center">
                <FormMessage />
              </FormItem>
            )
          }}
        />
      )}
    </>
  )
}

export { SelectTokens }
