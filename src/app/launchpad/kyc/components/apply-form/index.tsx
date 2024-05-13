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
  const ruleId = kycConfig.DEFAULT_RULE_TYPE_VALUES[kycConfig.DEFAULT_RULE_TYPE]
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
    args: [purefiData],
    onSuccessTx: () => {
      buyRuleStatusRefetch()
    },
  })

  const verifyHandler = async () => {
    try {
      if (isLoading || !signature) return
      setKycRequired('')
      setIsLoading(true)
      const payload = {
        message: JSON.stringify(dataPack),
        signature,
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
          {joinWhitelistLoading ? 'Joining' : 'Join Whitelist'}
        </Button>
      )
    } else if (signature) {
      return (
        <Button
          variant="astra-blue"
          disabled={isLoading || !!kycRequired}
          onClick={verifyHandler}
        >
          {isLoading ? 'Verifying' : 'Verify'}
        </Button>
      )
    } else {
      return (
        <Button
          variant="astra-blue"
          disabled={signLoading}
          onClick={() => signMessage({ message: JSON.stringify(dataPack) })}
        >
          {signLoading ? 'Signing' : 'Sign'}
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
  }, [sender, receiver, chain.id, ruleId])

  useEffect(() => {
    if (!signMessageData) return
    setSignature(signMessageData)
  }, [variables, signMessageData, sender, chain.id])

  useEffect(() => {
    if (signMessageError)
      toast({
        variant: 'destructive',
        title: 'Sign Message Error',
        description: signMessageError.message,
      })
    else if (joinWhitelistError)
      toast({
        variant: 'destructive',
        title: 'Join Whitelist Error',
        description: joinWhitelistError.message,
      })
  }, [signMessageError, joinWhitelistError])

  return (
    <>
      <AstraHeader className="text-center w-full">KYC Apply Form</AstraHeader>
      <AstraCard className="w-full my-8">
        <div className="form w-full flex flex-col gap-4">
          <div className="message flex">
            <span className="label w-1/5">Message</span>
            <div className="input-form w-4/5 border border-white p-2 rounded break-words">
              <pre>
                {JSON.stringify(dataPack, undefined, 2).replace(
                  /,\s*(?=\w+:)/g,
                  ',\n'
                )}
              </pre>
            </div>
          </div>
          <div className="signature flex">
            <span className="label w-1/5">Signature</span>
            <div className="input-form w-4/5 border border-white p-2 rounded break-words min-h-20">
              {signature}
            </div>
          </div>
          <div className="purefi-data flex">
            <span className="label w-1/5">PureFI Data</span>
            <div className="input-form w-4/5 border border-white p-2 rounded break-words min-h-20">
              {purefiData}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
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
