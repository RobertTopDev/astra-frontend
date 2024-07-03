import { Button } from '@/components/shadcn'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'

export const NavConnect = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    type="button"
                    className="w-full px-12 py-2 rounded-full text-xs tracking-widest font-medium border-2 border-astra-blue dark:bg-white dark:text-black dark:hover:bg-astra-blue/80 dark:hover:text-white"
                  >
                    CONNECT WALLET
                  </Button>
                )
              }
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    type="button"
                    className="w-full px-12 py-2 rounded-full text-xs font-medium border border-destructive dark:bg-neutral-900 dark:text-destructive dark:hover:bg-astra-blue/80 dark:hover:text-white"
                  >
                    Wrong network
                  </Button>
                )
              }
              return (
                <div className="flex gap-2">
                  <Button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                    variant="outline"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            width={12}
                            height={12}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                    <StarFilledIcon
                      className="relative text-astra-blue ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </Button>
                  <Button
                    onClick={openAccountModal}
                    type="button"
                    variant="outline"
                  >
                    {account.displayName}
                    {/* {account.displayBalance */}
                    {/*   ? ` (${account.displayBalance})` */}
                    {/*   : ''} */}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
