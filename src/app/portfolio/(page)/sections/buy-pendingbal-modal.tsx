'use client'

import {
  DialogHeader,
  Dialog,
  DialogContent,
  Button,
} from '@/components/shadcn'
import { useBuyPendingBalance } from '@/hooks'

type TWithdrawIndexModalProps = {
  pendingModalOpen: boolean
  setPendingModalOpen: (open: boolean) => void
  itokenIndex: string | undefined
  poolPendingBalance: string
}

const BuyPendingBalModal = ({
  pendingModalOpen,
  setPendingModalOpen,
  itokenIndex,
  poolPendingBalance,
}: TWithdrawIndexModalProps) => {
  const {
    buyPendingBal,
    error: buyPendingBalError,
    isLoading: buyPendingBalLoading,
  } = useBuyPendingBalance({
    enabled: !!itokenIndex,
    args: itokenIndex ? [BigInt(itokenIndex)] : undefined,
    onSuccessTx: () => {
      setPendingModalOpen(false)
    },
    onRevert: () => {
      setPendingModalOpen(false)
    },
  })

  return (
    <Dialog
      open={pendingModalOpen}
      onOpenChange={(open) => {
        if (open) null
        else setPendingModalOpen(false)
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[90vh] bg-white text-black rounded-xl overflow-y-auto overflow-x-auto">
        <DialogHeader className="text-xl text-center">
          Buy Pool Pending Balance
        </DialogHeader>
        <div className="text-justify py-4">
          <span className="font-bold">Pool Pending Balance:</span> {poolPendingBalance} USDC
        </div>
        <div className="flex justify-center gap-4">
          <Button
            variant="astra-white"
            disabled={!!buyPendingBalError || buyPendingBalLoading}
            onClick={() => buyPendingBal?.()}
          >
            {buyPendingBalLoading ? 'Loading...' : 'Buy'}
          </Button>
          <Button
            variant="astra-blue"
            onClick={() => setPendingModalOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { BuyPendingBalModal }
