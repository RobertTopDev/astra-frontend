import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Scale,
  CoreScaleOptions,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type Props = {
  isTitle: boolean
  xSymbol: number[]
}

export default function TokenDistributeChart({ isTitle, xSymbol }: Props) {
  const options: ChartOptions<'bar'> = {
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: isTitle ? true : false,
        text: 'Documented token distribution',
        font: {
          size: 25,
        },
        color: '#fff',
        padding: {
          bottom: 30,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          color: '#fff',
        },
        ticks: {
          color: '#fff',
        },
      },
      y: {
        grid: {
          color: '#9f9d9d',
          tickColor: 'transparent',
          tickWidth: 2,
        },
        border: {
          color: '#fff',
        },
        ticks: {
          color: '#fff',
          callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: string | number
          ) {
            // Assuming you still want to format numbers by appending a '%'
            // Ensure you only attempt to format if `tickValue` is a number
            if (typeof tickValue === 'number') {
              return `${tickValue}%`
            }
            // Return the tickValue unmodified if it's not a number
            return tickValue
          },
        },
      },
    },
  }
  const labels = [
    {
      name: 'Marketing',
      bg: 'cyan',
    },
    {
      name: 'Private Sale',
      bg: 'red',
    },
    {
      name: 'IDO',
      bg: 'blue',
    },
    {
      name: 'Liquidity',
      bg: 'green',
    },
    {
      name: 'Community',
      bg: 'yellow',
    },
    {
      name: 'Advisors',
      bg: 'purple',
    },
    {
      name: 'Ecosystem',
      bg: 'orange',
    },
    {
      name: "KOS's Round",
      bg: 'black',
    },
    {
      name: 'Team',
      bg: 'white',
    },
    {
      name: 'Promo',
      bg: 'cyan',
    },
  ]
  const data = {
    labels: labels.map((label) => label.name),
    datasets: [
      {
        data: xSymbol,
        backgroundColor: labels.map((label) => label.bg),
        xAxisId: 'x',
        yAxisId: 'y',
        barPercentage: 0.7,
      },
    ],
  }

  return <Bar options={options} data={data} />
}
