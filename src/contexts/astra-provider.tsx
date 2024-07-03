'use client'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  ScrollArea,
} from '@/components/shadcn'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNetwork } from 'wagmi'

type TAstraProvider = {
  children: ReactNode
}

type TContext = {
  apiUrl: string
  setShowTerms: Dispatch<SetStateAction<boolean>>
}

const Store = createContext<TContext>({} as TContext)

export const AstraProvider = ({ children }: TAstraProvider) => {
  const [showTerms, setShowTerms] = useState(false)
  const value = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
    setShowTerms,
  }

  const { chain: networkChain } = useNetwork()

  useEffect(() => {
    if (networkChain?.unsupported) {
    }
  }, [networkChain])

  // useTransactionWatcher({})

  return (
    <Store.Provider value={value}>
      {children}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] bg-white text-black">
          <DialogHeader className="text-xl text-center w-full justify-center">
            ASTRA DAO TERMS OF USE
          </DialogHeader>

          <div className="flex flex-col gap-6 justify-center">
            <ScrollArea className="h-full w-full max-h-96 text-justify px-4">
              <div className="flex flex-col gap-6">
                <div>
                  Astra DAO is a decentralized system. By using it, you agree to
                  the following terms. If you don’t agree with all these terms,
                  don’t use the Astra DAO system. Also, you may not use Astra
                  DAO if you are under 18 years of age, if you live in a
                  jurisdiction sanctioned by United Nations sanctions, or if
                  there are any legal or regulatory restrictions in your home
                  jurisdiction that prevent you from using ASTRA DAO.
                </div>
                <div>
                  Beta stage: At the current time Astra DAO is still in Beta,
                  meaning that you use Astra DAO at your own risk, on an
                  experimental basis, with no warranties from Astra DAO and no
                  remedies for malfunctions of the Astra DAO system.
                </div>
                <div>
                  Do small test transactions first, just as with any transaction
                  with cryptocurrency, to make sure that the system works for
                  you and that you are successful in working the system.
                </div>
                <div>
                  THE LIABILITY OF ASTRA DAO TO YOU OR ANY USER IS LIMITED TO A
                  MAXIMUM VALUE OF 100 SWISS FRANCS.
                </div>
                <div>
                  You may submit suggestions and problem reports to Astra DAO at
                  the following address:&nbsp;
                  <a className="text-astra-blue" href="mailto:dao@astradao.org">
                    Dao@astradao.org
                  </a>
                </div>
                <div>
                  ASTRA DAO DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS OR
                  IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY AND FITNESS
                  FOR A PARTICULAR PURPOSE.
                </div>
                <div>Forbidden activities. Astra DAO users may not:</div>
                <ul className="list-disc pl-[3rem] whitespace-normal ">
                  <li className="list-disc">
                    Violate any law of your home jurisdiction or any other
                    applicable jurisdiction.
                  </li>
                  <li className="list-disc">
                    Use another person’s account on ASTRA DAO without their
                    permission.
                  </li>
                  <li className="list-disc">
                    Send advertisements or solicitations of any nature using
                    ASTRA DAO.
                  </li>
                  <li className="list-disc">
                    Create or send any harmful, malicious or illegal content
                    over the ASTRA DAO system.
                  </li>
                  <li className="list-disc">
                    Inject or use any viruses or spyware.
                  </li>
                  <li className="list-disc">
                    Hack or attempt to alter any aspect of the ASTRA DAO system
                  </li>
                  <li className="list-disc">
                    Disclose other persons’ confidential or personal
                    information.
                  </li>
                  <li className="list-disc">
                    Disable or circumvent any access restrictions in the ASTRA DAO
                    system.
                  </li>
                  <li className="list-disc">
                    Use a false identity or impersonate any other person.
                  </li>
                </ul>
              </div>
            </ScrollArea>
            <DialogClose asChild>
              <div className="flex justify-end">
                <Button
                  variant="astra-blue"
                  // onClick={() => {
                  //   setTermsAccepted(true)
                  // }}
                >
                  Accept
                </Button>
              </div>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </Store.Provider>
  )
}

export const useAstra = (): TContext => useContext(Store)
// export const useCtx = (): ContextProps => useContext(Store);
