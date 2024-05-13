import { format } from 'date-fns'
import * as Papa from 'papaparse'

export const convertToCSV = (data: any) => {
  const csv = Papa.unparse([data])
  const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const csvUrl = URL.createObjectURL(csvBlob)
  const link = document.createElement('a')
  link.setAttribute(
    'download',
    'output' + format(new Date(), 'yyyy-MM-dd-HH:mm:ss') + '.csv'
  )
  link.setAttribute('href', csvUrl)
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(csvUrl)
  document.body.removeChild(link)
}
