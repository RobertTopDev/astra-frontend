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
  ySymbol?: string[]
}

export default function TokenDistributeChart({
  isTitle,
  xSymbol,
  ySymbol,
}: Props) {
  const options: ChartOptions<'bar'> = {
    responsive: true,

    plugins: {
      legend: {
        display: false,
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
      bg: 'cyan',
    },
    {
      bg: 'red',
    },
    {
      bg: 'blue',
    },
    {
      bg: 'green',
    },
    {
      bg: 'yellow',
    },
    {
      bg: 'purple',
    },
    {
      bg: 'orange',
    },
    {
      bg: 'black',
    },
    {
      bg: 'white',
    },
    {
      bg: 'cyan',
    },
  ]
  const data = {
    labels: ySymbol,
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
