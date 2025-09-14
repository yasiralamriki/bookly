import '../../App.css'
import { useEffect, useState } from 'react'
import { Pie, PieChart } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatNumberByLocale } from '@/lib/locale'
import { useTranslation } from 'react-i18next'

const chartConfig = {
  books: {
    label: "Books",
  },
  author1: {
    label: "Author 1",
    color: "var(--chart-1)",
  },
  author2: {
    label: "Author 2",
    color: "var(--chart-2)",
  },
  author3: {
    label: "Author 3",
    color: "var(--chart-3)",
  },
  author4: {
    label: "Author 4",
    color: "var(--chart-4)",
  },
  author5: {
    label: "Author 5",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

interface Book {
  id: number
  date: number
  title: string
  author: string
  notes: string[]
}

interface ChartData {
  author: string
  books: number
  formattedBooks: string
  fill: string
}

function Data() {
  const [chartData, setChartData] = useState<ChartData[]>([])

  const { t, i18n } = useTranslation();

  // Custom label function to display formatted numbers
  const renderCustomLabel = (entry: ChartData) => {
    return entry.formattedBooks;
  };

  useEffect(() => {
    fetch('/api/books')
      .then((response) => response.json())
      .then((data) => {
        // Process data for chart: count books by author
        const authorCounts = data.reduce((acc: Record<string, number>, book: Book) => {
          const author = book.author
          acc[author] = (acc[author] || 0) + 1
          return acc
        }, {})
        // Convert to chart data format with colors
        const processedData = Object.entries(authorCounts).map(([author, count], index) => ({
          author,
          books: count as number,
          formattedBooks: formatNumberByLocale(count as number, i18n.language),
          fill: `var(--chart-${(index % 5) + 1})`
        }))

        setChartData(processedData)
      })
      .catch((error) => console.error('Error fetching books:', error))
  }, [i18n.language])

  return (
    <div className="container grid grid-cols-3 grid-rows-3 gap-24 mx-auto pt-32">
      <div>
        <h1 className="text-2xl font-bold mb-4">{t('book_distribution_by_author')}</h1>
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie 
              data={chartData} 
              dataKey="books" 
              label={renderCustomLabel}
              nameKey="author" 
            />
          </PieChart>
        </ChartContainer>
      </div>
      <h1 className="text-2xl font-bold mb-4">Data Page Placeholder</h1>
      <h1 className="text-2xl font-bold mb-4">Data Page Placeholder</h1>
      <h1 className="text-2xl font-bold mb-4">Data Page Placeholder</h1>
      <h1 className="text-2xl font-bold mb-4">Data Page Placeholder</h1>
      <h1 className="text-2xl font-bold mb-4">Data Page Placeholder</h1>
      <h1 className="text-2xl font-bold mb-4">Data Page Placeholder</h1>
      <h1 className="text-2xl font-bold mb-4">Data Page Placeholder</h1>
      <h1 className="text-2xl font-bold mb-4">Data Page Placeholder</h1>
    </div>
  )
}

export default Data
