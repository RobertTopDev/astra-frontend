import React from 'react'

type Props = {
  remainingTime: number
  timeValues: {
    days: string
    hours: string
    minutes: string
    seconds: string
  }
}

const Countdown = ({ remainingTime, timeValues }: Props) => {
  const { days, hours, minutes, seconds } = timeValues

  if (remainingTime > 0) {
    return (
      <div className="flex gap-3 justify-center items-center">
        <div className="p-2 text-3xl rounded-xl bg-[#00E7FF26] text-[#00E7FF]">
          {days}
        </div>
        <span className="text-3xl">:</span>
        <div className="p-2 text-3xl rounded-xl bg-[#00E7FF26] text-[#00E7FF]">
          {hours}
        </div>
        <span className="text-3xl">:</span>
        <div className="p-2 text-3xl rounded-xl bg-[#00E7FF26] text-[#00E7FF]">
          {minutes}
        </div>
        <span className="text-3xl">:</span>
        <div className="p-2 text-3xl rounded-xl bg-[#00E7FF26] text-[#00E7FF]">
          {seconds}
        </div>
      </div>
    )
  }

  // Render zeros when remainingTime is 0 or negative
  return (
    <div className="flex gap-3 justify-center items-center">
      {Array.from({ length: 4 }).map((_, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-3xl">:</span>}
          <div className="p-2 text-3xl rounded-xl bg-[#00E7FF26] text-[#00E7FF]">
            00
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default Countdown
