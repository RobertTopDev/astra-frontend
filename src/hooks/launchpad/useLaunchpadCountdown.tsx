'use client'

import { useEffect, useMemo, useState } from 'react'

type TAstraCountdownProps = {
  cooldownDate?: Date | undefined
  refetch?: () => void
}

export const useLaunchpadCountdown = ({
  cooldownDate,
  refetch: refetchDatas,
}: TAstraCountdownProps) => {
  const [remainingTime, setRemainingTime] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now()
      if (!cooldownDate) {
        clearInterval(timer)
        refetchDatas?.()
        setRemainingTime(0)
        return
      }
      const timeDifference = cooldownDate.getTime() - currentTime

      if (timeDifference < 1_500) {
        refetchDatas?.()
        clearInterval(timer)
      } else {
        setRemainingTime(timeDifference)
      }
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [cooldownDate])

  const timeObject = useMemo(() => {
    // GET REMAINING TIME FORMATTED AS D:HH:MM:SS
    // const days = pad(Math.floor(remainingTime / (1000 * 60 * 60 * 24)))
    // const hours = pad(
    //   Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    // )
    // const minutes = pad(
    //   Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
    // )
    // const seconds = pad(Math.floor((remainingTime % (1000 * 60)) / 1000))

    const hours = pad(Math.floor(remainingTime / (1000 * 60 * 60)))
    const minutes = pad(
      Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
    )
    const seconds = pad(Math.floor((remainingTime % (1000 * 60)) / 1000))

    return {
      // days,
      hours,
      minutes,
      seconds,
      remainingTime,
    }
  }, [remainingTime])

  return timeObject
}

const pad = (num: number) => {
  return num.toString().padStart(2, '0')
}
