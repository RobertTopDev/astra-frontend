import { TIndex } from '@/types'
import minBy from 'lodash/maxBy'
import maxBy from 'lodash/maxBy'
import filter from 'lodash/filter'
import sample from 'lodash/sample'
import sampleSize from 'lodash/sampleSize'
import clone from 'lodash/clone'

export async function getIndices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/indices`, {
    next: { revalidate: 0, tags: ['indices'] },
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  const { data: indices } = (await res.json()) as { data: TIndex[] }

  // const highestEarner = maxBy(
  //   filter(indices, (index) => !!index.NET_PROFIT),
  //   'NET_PROFIT'
  // )
  const highestEarner = maxBy(
    filter(indices, (index) => !!index.TVL),
    'TVL'
  )

  // Remove the highestEarner from the indices array before calculating mostInvested
  const indicesWithoutHighestEarner = highestEarner
    ? filter(
        indices,
        (index) => index.ITOKEN_ADDR !== highestEarner.ITOKEN_ADDR
      )
    : indices
  // const mostInvested = maxBy(
  //   filter(indicesWithoutHighestEarner, (index) => !!index.TVL),
  //   'TVL'
  // )
  const mostInvested = maxBy(
    filter(indicesWithoutHighestEarner, (index) => !!index.ROI),
    'ROI'
  )

  // Remove the highestEarner and mostInvested from the indices array before calculating lowestRisk
  const indicesWithoutHighestEarnerAndMostInvested = mostInvested
    ? filter(
        indicesWithoutHighestEarner,
        (index) => index.ITOKEN_ADDR !== mostInvested.ITOKEN_ADDR
      )
    : indicesWithoutHighestEarner
  // const lowestRisk = minBy(
  //   filter(
  //     indicesWithoutHighestEarnerAndMostInvested,
  //     (index) => !!index.RISK_SCORE
  //   ),
  //   'RISK_SCORE'
  // )
  const lowestRisk = minBy(
    filter(
      indicesWithoutHighestEarnerAndMostInvested,
      (index) => !!index.RISK_SCORE_NEW
    ),
    'RISK_SCORE_NEW'
  )

  const emptyCount = [highestEarner, mostInvested, lowestRisk].filter(
    (d) => !d
  ).length
  const randomItems = sampleUniqueItems(indices, emptyCount) as TIndex[]
  // if empty, return a random indice
  return {
    highestEarner: highestEarner || randomItems.shift(),
    mostInvested: mostInvested || randomItems.shift(),
    lowestRisk: lowestRisk || randomItems.shift(),
    indices,
  }
}

function sampleUniqueItems(array: unknown[], num: number) {
  const newArray = clone(array)

  while (newArray.length < num) {
    const randomItem = sample(array)
    newArray.push(randomItem)
  }

  return sampleSize(newArray, num)
}
