import {
  differenceInMinutes,
  isSameDay,
  endOfDay,
  startOfDay,
  isSameWeek,
  endOfWeek,
  startOfWeek,
  isSameMonth,
  endOfMonth,
  startOfMonth,
} from 'date-fns'
import millify from 'millify'

export const shorten = (str: string) => {
  if (!str || str.length <= 15) return str
  const first = str.substring(0, 6)
  const last = str.substring(str.length - 6)
  return first + '...' + last
}

export const truncate = (str: string, length: number) => {
  if (str.length <= length) return str
  const first = str.substring(0, length)
  return first + '...'
}

export const millifyText = (num: number) => {
  return millify(num, {
    precision: 2,
    lowercase: false,
  })
}

export const getRiskScoreColor = (riskScore: number) => {
  switch (riskScore) {
    case 1:
      return 'text-green-400'
    case 2:
      return 'text-blue'
    case 3:
      return 'text-orange'
    case 4:
      return 'text-red-500'
    case 5:
      return 'text-red'
    default:
      return 'text-green-400'
  }
}

export const getChartOptions = (min: number | string, max: number | string) => {
  const minDate = new Date(min)
  const maxDate = new Date(max)
  const diffInMins = differenceInMinutes(maxDate, minDate)

  // TODO: Optimize useQuery Fetch Cache
  // If by month, use a 3months fetch
  // If it's overlapped by a previous fetch, don't fetch
  if (diffInMins < 60 * 48) {
    // Calculate which one is closer to the next day if min and max is not on the same day
    const isSameDay_ = isSameDay(minDate, maxDate)
    if (isSameDay_) {
      return {
        max: endOfDay(maxDate).getTime(),
        min: startOfDay(minDate).getTime(),
        type: '15m',
      }
    } else {
      const diffToMin = differenceInMinutes(endOfDay(minDate), minDate)
      const diffToMax = differenceInMinutes(maxDate, startOfDay(maxDate))
      if (diffToMin < diffToMax) {
        return {
          max: endOfDay(maxDate).getTime(),
          min: startOfDay(minDate).getTime(),
          type: '15m',
        }
      } else {
        return {
          max: endOfDay(maxDate).getTime(),
          min: startOfDay(minDate).getTime(),
          type: '15m',
        }
      }
    }
  } else if (diffInMins < 60 * 24 * 14) {
    const isSameWeek_ = isSameWeek(minDate, maxDate)
    if (isSameWeek_) {
      return {
        max: endOfWeek(maxDate).getTime(),
        min: startOfWeek(minDate).getTime(),
        type: '1H',
      }
    } else {
      const diffToMin = differenceInMinutes(endOfWeek(minDate), minDate)
      const diffToMax = differenceInMinutes(maxDate, startOfWeek(maxDate))
      if (diffToMin < diffToMax) {
        return {
          max: endOfWeek(maxDate).getTime(),
          min: startOfWeek(minDate).getTime(),
          type: '1H',
        }
      } else {
        return {
          max: endOfWeek(maxDate).getTime(),
          min: startOfWeek(minDate).getTime(),
          type: '1H',
        }
      }
    }
  } else {
    const isSameMonth_ = isSameMonth(minDate, maxDate)
    if (isSameMonth_) {
      return {
        max: endOfMonth(maxDate).getTime(),
        min: startOfMonth(minDate).getTime(),
        type: '1D',
      }
    } else {
      const diffToMin = differenceInMinutes(endOfMonth(minDate), minDate)
      const diffToMax = differenceInMinutes(maxDate, startOfMonth(maxDate))
      if (diffToMin < diffToMax) {
        return {
          max: endOfMonth(maxDate).getTime(),
          min: startOfMonth(minDate).getTime(),
          type: '1D',
        }
      } else {
        return {
          max: endOfMonth(maxDate).getTime(),
          min: startOfMonth(minDate).getTime(),
          type: '1D',
        }
      }
    }
  }
}

export const numberFormatter = (
  val: number | string | { _hex: number },
  decimalValueDisplay: boolean = false
): string | number => {
  let formatValue = val

  if (typeof formatValue === 'string') {
    if (Number.isNaN(formatValue)) {
      return formatValue || 0
    }
    formatValue = Number(formatValue) || 0
  }

  if (typeof formatValue === 'object' && '_hex' in formatValue) {
    formatValue = formatValue._hex / 1
  }

  if (formatValue && formatValue > 1) {
    return Intl.NumberFormat('en-US').format(+formatValue.toFixed(2))
  }

  if (formatValue && formatValue < 1) {
    return decimalValueDisplay
      ? formatValue.toFixed(3)
      : Intl.NumberFormat('en-US').format(+formatValue.toFixed(5))
  }

  return formatValue || 0
}
