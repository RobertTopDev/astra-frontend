'use client'
import { AstraTerms } from '@/components'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Checkbox,
} from '@/components/shadcn'
import { CheckedState } from '@radix-ui/react-checkbox'
import React from 'react'

type TTermsCheckboxProps = {
  termsAccepted: boolean | CheckedState
  setTermsAccepted: (value: boolean) => void
}

const TermsCheckbox = ({
  termsAccepted,
  setTermsAccepted,
}: TTermsCheckboxProps) => {
  const [showTerms, setShowTerms] = React.useState(false)
  return (
    <div className="flex space-x-2 items-center">
      <Checkbox
        id="terms"
        checked={termsAccepted}
        onClick={() => {
          setShowTerms(true)
        }}
      ></Checkbox>
      <AlertDialog open={showTerms} onOpenChange={setShowTerms}>
        <AlertDialogTrigger>
          <span className="text-sm font-medium">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agreed to the&nbsp;
            </label>
            <span className="text-astra-blue cursor-pointer">
              ASTRA DAO Terms of Service
            </span>
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terms & Conditions</AlertDialogTitle>
            <AstraTerms></AstraTerms>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setTermsAccepted(false)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setTermsAccepted(true)
              }}
            >
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export { TermsCheckbox }
