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

import { ResponsivePie } from '@nivo/pie'

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

export const PieChart = ({ data }: any) => (
  <div style={{ width: '1000px', height: '600px' }}>
    <ResponsivePie
      data={data}
      theme={{
        labels: {
          text: {
            fontSize: '14px',
          },
        },
        legends: {
          text: {
            fontSize: '14px',
          },
        },
      }}
      margin={{ top: 100, right: 150, bottom: 100, left: 0 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#fff"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
      valueFormat={(value) => `${Number(value)} %`}
      tooltip={(data: any) => {
        return (
          <div
            style={{
              background: '#fff',
              color: '#000',
              padding: '9px 12px',
              border: '1px solid #ccc',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                background: data.datum.color,
                width: '10px',
                height: '10px',
              }}
            />
            <div style={{ fontSize: '14px' }}>
              {data.datum.label + ': ' + data.datum.value + '%'}
            </div>
          </div>
        )
      }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={data.map((d: any) => ({
        match: {
          id: d.id,
        },
        id: Math.random() > 0.5 ? 'dots' : 'lines',
      }))}
      legends={[
        {
          anchor: 'right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemWidth: 150,
          itemHeight: 20,
          itemTextColor: '#ddd',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 15,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#fff',
              },
            },
          ],
        },
      ]}
    />
  </div>
)
