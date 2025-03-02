'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAccount, useSignMessage } from 'wagmi'
import { PureFI, PureFIErrorCodes } from '@purefi/verifier-sdk'
import { AstraCard, AstraHeader, AstraLink } from '@/components'
import { Button, useToast } from '@/components/shadcn'
import { kycConfig } from '@/config'
import {
  useChainConfig,
  useWhitelistWithKYCPurefi,
  useGetBuyRuleLaunchpad,
} from '@/hooks'

const ApplyForm = () => {
  const { chainConfig, chain } = useChainConfig()
  const { address: sender } = useAccount()
  const {
    data: signMessageData,
    error: signMessageError,
    isLoading: signLoading,
    signMessage,
    variables,
  } = useSignMessage()
  const { toast } = useToast()

  const purefiUrl = chainConfig.PURFI_CONFIGURE_URL
  const receiver = chainConfig.AstraDAOWhitelistAddress
  const ruleId = purefiUrl.ruleId
  const signType = kycConfig.DEFAULT_SIGN_TYPE

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dataPack, setDataPack] = useState<any>({})
  const [signature, setSignature] = useState<string>('')
  const [purefiData, setPurefiData] = useState<any>('')
  const [kycRequired, setKycRequired] = useState<string>('')

  const {
    data: buyRuleStatus,
    isLoading: buyRuleStatusLoading,
    refetch: buyRuleStatusRefetch,
  } = useGetBuyRuleLaunchpad()
  const {
    joinWhitelist,
    error: joinWhitelistError,
    isLoading: joinWhitelistLoading,
  } = useWhitelistWithKYCPurefi({
    enabled: purefiData,
    args: [purefiData, BigInt(ruleId)],
    onSuccessTx: () => {
      buyRuleStatusRefetch()
    },
  })

  const verifyHandler = async (signData: string) => {
    try {
      if (isLoading || !signData) return
      setKycRequired('')
      setIsLoading(true)
      const payload = {
        message: JSON.stringify(dataPack),
        signature: signData,
      }
      PureFI.setIssuerUrl(purefiUrl.issuer)
      const data = await PureFI.verifyRule(payload, signType)
      setPurefiData(data)
    } catch (err: any) {
      if (err.code === PureFIErrorCodes.FORBIDDEN) {
        const url = purefiUrl.dashboard
        setKycRequired(url)
        toast({
          variant: 'destructive',
          title: 'Verify KYC Error',
          description: err.message,
          action: (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="!mr-2"
            >
              <span className="text-white border border-white rounded-lg py-1 px-2 hover:bg-white hover:text-black">
                Pass KYC
              </span>
            </a>
          ),
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Verify KYC Error',
          description: err.message,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const actionButton = () => {
    if (purefiData || (buyRuleStatus && buyRuleStatus[0]?.result)) {
      return buyRuleStatus && buyRuleStatus[0]?.result ? (
        <Link href="/launchpad">
          <Button
            variant="astra-blue"
            disabled={!buyRuleStatus || !buyRuleStatus[0]?.result}
            isLoading={buyRuleStatusLoading}
          >
            KYC Verified
          </Button>
        </Link>
      ) : (
        <Button
          variant="astra-blue"
          disabled={joinWhitelistLoading}
          onClick={joinWhitelist}
        >
          {joinWhitelistLoading ? 'Joining...' : 'Join Whitelist'}
        </Button>
      )
    } else if (signature) {
      return (
        <Button
          variant="astra-blue"
          disabled={isLoading || !!kycRequired}
          onClick={() => verifyHandler(signature)}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>
      )
    } else {
      return (
        <Button
          variant="astra-blue"
          disabled={signLoading}
          onClick={() => signMessage({ message: JSON.stringify(dataPack) })}
        >
          {signLoading ? 'Signing...' : 'Sign'}
        </Button>
      )
    }
  }

  useEffect(() => {
    const pack = {
      sender,
      receiver,
      chainId: +chain.id,
      ruleId,
    }
    setDataPack(pack)
    if ((!buyRuleStatus || !buyRuleStatus[0]?.result) && !signature) {
      console.log('dfdfdfdfdfdfd')
      signMessage({ message: JSON.stringify(pack) })
    }
  }, [sender, chain.id, ruleId])

  useEffect(() => {
    async function init() {
      if (!signMessageData) return
      setSignature(signMessageData)
      await verifyHandler(signMessageData)
    }

    init()
  }, [variables, signMessageData, sender, chain.id])

  useEffect(() => {
    if (signMessageError)
      toast({
        variant: 'destructive',
        title: 'Sign Message Error',
        description: signMessageError.message,
      })
    else if (joinWhitelistError) {
      toast({
        variant: 'destructive',
        title: 'Join Whitelist Error',
        description: joinWhitelistError.message,
      })
    }
  }, [signMessageError, joinWhitelistError])

  return (
    <>
      <AstraHeader className="text-center w-full">KYC Apply Form</AstraHeader>
      <AstraCard className="w-full my-8">
        <div className="form w-full">
          <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 sm:text-base">
            <li
              className={`flex md:w-full items-center ${
                signature || (buyRuleStatus && buyRuleStatus[0]?.result)
                  ? 'text-astra-blue after:border-astra-blue'
                  : 'after:border-gray-200'
              } sm:after:content-[''] after:w-full after:h-1 after:border-b  after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
            >
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                <CheckMarkComponent />
                <span className="hidden sm:inline-flex sm:ms-2 min-w-20">
                  Sign In
                </span>
              </span>
            </li>
            <li
              className={`flex md:w-full items-center ${
                purefiData || (buyRuleStatus && buyRuleStatus[0]?.result)
                  ? 'text-astra-blue'
                  : 'after:border-gray-200'
              } ${
                buyRuleStatus &&
                buyRuleStatus[0]?.result &&
                'after:border-astra-blue'
              } after:content-[''] after:w-full after:h-1 after:border-b  after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
            >
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                <CheckMarkComponent />
                <span className="hidden me-2 sm:inline-flex min-w-20">
                  Verify
                </span>
              </span>
            </li>
            <li
              className={`flex items-center ${
                buyRuleStatus && buyRuleStatus[0]?.result
                  ? 'text-astra-blue'
                  : ''
              }`}
            >
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                <CheckMarkComponent />
                <span className="hidden me-2 sm:inline-flex min-w-20">
                  Confirmation
                </span>
              </span>
            </li>
          </ol>

          <div className="flex items-center justify-center gap-4 mt-20">
            <div className="action-btn text-center">{actionButton()}</div>
            {kycRequired ? (
              <AstraLink link={kycRequired}>
                <Button variant="astra-blue">Verify KYC</Button>
              </AstraLink>
            ) : (
              <></>
            )}
          </div>
        </div>
      </AstraCard>
    </>
  )
}

export default ApplyForm

export const CheckMarkComponent = () => {
  return (
    <svg
      className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
    </svg>
  )
}
