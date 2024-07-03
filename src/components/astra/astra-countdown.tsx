'use client'
import React, { useEffect, useMemo, useState } from 'react'

type TAstraCountdownProps = {
  cooldownDate?: Date
  refetch?: () => void
  className?: string
}

const AstraCountdown = ({
  cooldownDate,
  refetch: refetchDatas,
  className,
}: TAstraCountdownProps) => {
  const [remainingTime, setRemainingTime] = useState(0)

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

  const timeFormatted = useMemo(() => {
    // GET REMAINING TIME FORMATTED AS D:HH:MM:SS
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000)
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }, [remainingTime])

  return <span className={className}>{timeFormatted}</span>
}

export { AstraCountdown }
