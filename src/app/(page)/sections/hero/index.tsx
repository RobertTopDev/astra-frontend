import clsx from 'clsx'
import styles from './hero.module.scss'
import { Button } from '@/components/shadcn'
import Image from 'next/image'
import { AstraShootingStar, AstraStar, HeroBackdrop } from '@/components'
import Link from 'next/link'

export const Hero = () => {
  return (
    <>
      <div className="bg-hero absolute w-screen h-screen bg-no-repeat bg-cover top-0 z-0"></div>
      <HeroBackdrop />
      <div className="relative z-10 container mx-auto w-full overflow-visible pb-20 transform -translate-y-[7rem]">
        <Animations />
        <div className="relative z-30 sm:mt-0 mt-10 w-full h-[90vh] flex justify-center lg:items-center">
          <div className="grid grid-cols-2 gap-8 w-full">
            <div className="lg:col-span-1 col-span-full flex flex-col items-center justify-center gap-8 whitespace-nowrap">
              <div className={clsx(styles['hero-heading'])}>
                The Only Platform <br /> You Need To Build <br /> Wealth With
                Crypto
              </div>
              <div className="grid grid-cols-2 w-full gap-4">
                <Link href="/#indices">
                  <Button
                    className="sm:col-span-1 col-span-full w-full rounded-full text-xs tracking-widest border border-astra-blue dark:text-neutral-900 dark:bg-neutral-50 dark:hover:bg-astra-blue/80 dark:hover:text-white"
                    size="default"
                  >
                    GET STARTED
                  </Button>
                </Link>

                <Link href="/how-to-buy">
                  <Button
                    className="sm:col-span-1 col-span-full w-full rounded-full text-xs tracking-widest border border-astra-blue dark:bg-astra-blue/90 dark:text-neutral-900 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
                    size="default"
                  >
                    HOW TO BUY ASTRADAO
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-1 col-span-full flex justify-center items-center">
              <div className="h-full w-full relative">
                <div
                  className={clsx(
                    styles['video-container'],
                    'h-full w-full md:px-10 px-0'
                  )}
                >
                  <iframe
                    allowFullScreen
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/vy-pmys_cJQ"
                  ></iframe>
                </div>
                <div className={clsx(styles['astra-icon'], 'lg:block hidden')}>
                  <Image
                    fill={true}
                    alt="Dolphin"
                    src="/images/dolphin.png"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Animations = () => {
  return (
    <>
      <AstraStar
        className="delay-500 -left-[5%] top-[20%]"
        style={{ animationDuration: '3s' }}
      />
      <AstraStar
        className="delay-500 -left-[10%] top-[25%]"
        style={{ animationDuration: '1s' }}
      />
      <AstraStar
        className="delay-500 -left-[15%] top-[40%]"
        style={{ animationDuration: '2s' }}
      />
      <AstraStar
        className="delay-1000 -right-[2%] top-[25%]"
        style={{ animationDuration: '5s' }}
      />
      <AstraStar
        className="delay-500 -right-[10%] top-[28%]"
        style={{ animationDuration: '4s' }}
      />
      <AstraStar
        className="delay-[5000] -right-[12%] top-[35%]"
        style={{ animationDuration: '2s' }}
      />
      <AstraStar
        className="delay-[2000] -right-[5%] top-[40%]"
        style={{ animationDuration: '3s' }}
      />
      <AstraStar
        className="delay-500 -right-[8%] top-[45%]"
        style={{ animationDuration: '1s' }}
      />
      <AstraShootingStar
        className="top-[20%] right-0"
        style={{ animationDuration: '3s' }}
      />
      <AstraShootingStar
        className="top-[20%] right-[50%]"
        style={{ animationDuration: '5s' }}
      />
      <AstraShootingStar
        className="top-[20%] right-[20%]"
        style={{ animationDuration: '2s' }}
      />
      <AstraShootingStar
        className="top-[50%] right-[0%]"
        style={{ animationDuration: '1s' }}
      />
    </>
  )
}
