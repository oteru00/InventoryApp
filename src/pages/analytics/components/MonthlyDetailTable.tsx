import styles from "../AnalyticsPage.module.css"

export type MonthlyRow = {
  month: number
  counts: Record<string, number>
}

type Props = {
  year: number | null
  genres: string[]
  monthlyRows: MonthlyRow[]
}

export default function MonthlyDetailTable({ year, genres, monthlyRows }: Props) {
  return (
    <section className={styles.listSection}>
      <h3 className={styles.sectionTitle}>月別詳細データ（{year}年）</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>月</th>
            {genres.map((g) => (
              <th key={g}>{g}</th>
            ))}
            <th>合計</th>
          </tr>
        </thead>

        <tbody>
          {monthlyRows.map((row) => {
            const monthTotal = genres.reduce(
              (sum, g) => sum + (row.counts[g] || 0),
              0,
            )

            return (
              <tr key={row.month}>
                <td>{row.month}月</td>
                {genres.map((g) => (
                  <td key={g}>{row.counts[g] ? row.counts[g] : "−"}</td>
                ))}
                <td>{monthTotal || "−"}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
