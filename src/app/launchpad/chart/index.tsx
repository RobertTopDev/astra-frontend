// import { Bar } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartOptions,
//   Scale,
//   CoreScaleOptions,
// } from 'chart.js'

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// type Props = {
//   isTitle: boolean
//   xSymbol: number[]
//   ySymbol?: string[]
// }

// export default function TokenDistributeChart({
//   isTitle,
//   xSymbol,
//   ySymbol,
// }: Props) {
//   const options: ChartOptions<'bar'> = {
//     responsive: true,

//     plugins: {
//       legend: {
//         display: false,
//       },
//       title: {
//         display: isTitle ? true : false,
//         text: 'Documented Token Distribution',
//         font: {
//           size: 25,
//         },
//         color: '#fff',
//         padding: {
//           bottom: 30,
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         border: {
//           color: '#fff',
//         },
//         ticks: {
//           color: '#fff',
//         },
//       },
//       y: {
//         grid: {
//           color: '#9f9d9d',
//           tickColor: 'transparent',
//           tickWidth: 2,
//         },
//         border: {
//           color: '#fff',
//         },
//         ticks: {
//           color: '#fff',
//           callback: function (
//             this: Scale<CoreScaleOptions>,
//             tickValue: string | number
//           ) {
//             // Assuming you still want to format numbers by appending a '%'
//             // Ensure you only attempt to format if `tickValue` is a number
//             if (typeof tickValue === 'number') {
//               return `${tickValue}%`
//             }
//             // Return the tickValue unmodified if it's not a number
//             return tickValue
//           },
//         },
//       },
//     },
//   }
//   const labels = [
//     {
//       bg: 'cyan',
//     },
//     {
//       bg: 'red',
//     },
//     {
//       bg: 'blue',
//     },
//     {
//       bg: 'green',
//     },
//     {
//       bg: 'yellow',
//     },
//     {
//       bg: 'purple',
//     },
//     {
//       bg: 'orange',
//     },
//     {
//       bg: 'black',
//     },
//     {
//       bg: 'white',
//     },
//     {
//       bg: 'cyan',
//     },
//   ]
//   const data = {
//     labels: ySymbol,
//     datasets: [
//       {
//         data: xSymbol,
//         backgroundColor: labels.map((label) => label.bg),
//         xAxisId: 'x',
//         yAxisId: 'y',
//         barPercentage: 0.7,
//       },
//     ],
//   }

//   return <Bar options={options} data={data} />
// }

import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  isTitle: boolean
  xSymbol: number[]
  ySymbol?: string[]
}

export default function TokenDistributeChart({
  isTitle,
  xSymbol,
  ySymbol,
}: Props) {
  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#fff', // Set the legend text color to white
        },
      },
      title: {
        display: isTitle ? true : false,
        text: 'Documented Token Distribution',
        font: {
          size: 25,
        },
        color: '#fff',
        padding: {
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset
            const dataIndex = tooltipItem.dataIndex
            const value = dataset.data[dataIndex]
            const total = dataset.data.reduce((sum, value) => sum + value, 0)
            const percentage = ((value / total) * 100).toFixed(2)
            return ` ${tooltipItem.label} (${percentage}%)`
          },
        },
      },
    },
  }

  const labels = [
    'cyan',
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'orange',
    'black',
    'white',
  ]
  const data = {
    labels: ySymbol || labels, // Fallback to default labels if ySymbol is not provided
    datasets: [
      {
        data: xSymbol,
        backgroundColor: labels,
      },
    ],
  }

  return <Pie options={options} data={data} />
}
