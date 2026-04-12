import styles from "../AnalyticsPage.module.css"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

export type ChartRow = {
  genre: string
  total: number
  sold: number
}

type Props = {
  year: number | null
  month: number
  chartData: ChartRow[]
}

export default function GenreSalesChart({ year, month, chartData }: Props) {
  return (
    <section className={styles.chartSection}>
      <h3 className={styles.sectionTitle}>
        ジャンル別販売数（{year}年 {month}月）
      </h3>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="genre" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" name="出品数" fill="#b46b4e" />
            <Bar dataKey="sold" name="売約済み" fill="#5b8a72"    />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
