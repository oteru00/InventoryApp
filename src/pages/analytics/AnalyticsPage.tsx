import { TEXTS } from "../../const/texts"
import styles from "./AnalyticsPage.module.css"
import GenreSalesChart from "./components/GenreSalesChart"
import MonthlyDetailTable from "./components/MonthlyDetailTable"
import { useAnalyticsItems } from "./hooks/useAnalyticsItems"
import { useAnalyticsPeriod } from "./hooks/useAnalyticsPeriod"
import { useAnalyticsSummary } from "./hooks/useAnalyticsSummary"

export default function AnalyticsPage() {
  const { items } = useAnalyticsItems()

  const soldItems = items.filter((item) => item.status === "売約済" && !!item.soldDate)

  const {
    year,
    setYear,
    month,
    setMonth,
    yearOptions,
    monthOptions,
  } = useAnalyticsPeriod(soldItems)

  const { genres, chartData, monthlyRows } = useAnalyticsSummary(items, year, month)

  return (
    <main className={styles.wrapper}>
      <h2 className={styles.title}>{TEXTS.ANALYTICS_TITLE}</h2>

      <section className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.label}>{TEXTS.ANALYTICSICS_TARGETYEAR}</label>
          <select
            className={styles.select}
            value={year ?? ""}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}{TEXTS.ANALYTICSICS_YEAR}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>{TEXTS.ANALYTICSICS_TARGETMONTH}</label>
          <select
            className={styles.select}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}{TEXTS.ANALYTICSICS_MONTH}
              </option>
            ))}
          </select>
        </div>
      </section>

      <GenreSalesChart year={year} month={month} chartData={chartData} />
      <MonthlyDetailTable year={year} genres={genres} monthlyRows={monthlyRows} />
    </main>
  )
}