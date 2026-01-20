import { useEffect, useMemo, useState } from "react"
import styles from "./AnalyticsPage.module.css"
import { db } from "../../firebase"
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore"
import GenreSalesChart, { type ChartRow } from "./components/GenreSalesChart"
import MonthlyDetailTable, { type MonthlyRow } from "./components/MonthlyDetailTable"

// アイテム情報の型
type InventoryItem = {
  id: string
  title: string
  genre: string
  status: "販売中" | "売約済" | "保留"
  price: number
  startDate?: string
  soldDate?: string
  createdAt: Timestamp | string
}

export default function AnalyticsPage() {
  const [items, setItems] = useState<InventoryItem[]>([])

  useEffect(() => {
    const q = query(collection(db, "inventoryItems"), orderBy("soldDate", "asc"))

    const unsubscribe = onSnapshot(q, (snap) => {
      const result: InventoryItem[] = snap.docs.map((docSnap) => {
        const data = docSnap.data() as any
        return {
          id: docSnap.id,
          title: data.title,
          genre: data.genre,
          status: data.status,
          price: data.price,
          startDate: data.startDate,
          soldDate: data.soldDate,
          createdAt: data.createdAt,
        }
      })
      setItems(result)
    })

    return () => unsubscribe()
  }, [])

  // 売約済み & soldDate があるものだけ
  const soldItems = useMemo(
    () => items.filter((item) => item.status === "売約済" && !!item.soldDate),
    [items],
  )

  // ジャンル一覧
  const genres = useMemo(() => {
    const set = new Set<string>()
    items.forEach((item) => {
      if (item.genre) set.add(item.genre)
    })
    return Array.from(set)
  }, [items])

  // 年の候補（売約済みの soldDate から）
  const yearOptions = useMemo(() => {
    const years = new Set<number>()
    soldItems.forEach((item) => {
      if (!item.soldDate) return
      years.add(new Date(item.soldDate).getFullYear())
    })
    const arr = Array.from(years).sort((a, b) => a - b)
    return arr.length > 0 ? arr : [new Date().getFullYear()]
  }, [soldItems])

  const [year, setYear] = useState<number | null>(null)
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)

  // 初期値：一番新しい年
  useEffect(() => {
    if (year === null && yearOptions.length > 0) {
      setYear(yearOptions[yearOptions.length - 1])
    }
  }, [year, yearOptions])

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  // 対象年・月の出品数（startDate ベース）
  const itemsInPeriod = useMemo(() => {
    if (year === null) return []
    const targetMonth = month - 1

    return items.filter((item) => {
      if (!item.startDate) return false
      const d = new Date(item.startDate)
      return d.getFullYear() === year && d.getMonth() === targetMonth
    })
  }, [items, year, month])

  // 対象年・月の売約済み（soldDate ベース）
  const soldInPeriod = useMemo(() => {
    if (year === null) return []
    return soldItems.filter((item) => {
      if (!item.soldDate) return false
      const d = new Date(item.soldDate)
      return d.getFullYear() === year && d.getMonth() + 1 === month
    })
  }, [soldItems, year, month])

  // グラフ用データ
  const chartData: ChartRow[] = useMemo(
    () =>
      genres.map((g) => {
        const total = itemsInPeriod.filter((i) => i.genre === g).length
        const sold = soldInPeriod.filter((i) => i.genre === g).length
        return { genre: g, total, sold }
      }),
    [itemsInPeriod, soldInPeriod, genres],
  )

  // 月別表用データ（指定年の売約済み集計）
  const monthlyRows: MonthlyRow[] = useMemo(() => {
    if (year === null) return []

    const base: MonthlyRow[] = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      counts: {},
    }))

    soldItems.forEach((item) => {
      if (!item.soldDate) return
      const d = new Date(item.soldDate)
      if (d.getFullYear() !== year) return

      const m = d.getMonth() + 1
      const row = base[m - 1]
      const g = item.genre
      row.counts[g] = (row.counts[g] || 0) + 1
    })

    return base
  }, [soldItems, year])

  return (
    <main className={styles.wrapper}>
      <h2 className={styles.title}>販売分析</h2>

      {/* 年・月セレクト（←ここが「絞るUI」） */}
      <section className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.label}>対象年</label>
          <select
            className={styles.select}
            value={year ?? ""}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>対象月</label>
          <select
            className={styles.select}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* グラフ */}
      <GenreSalesChart year={year} month={month} chartData={chartData} />

      {/* 月別表 */}
      <MonthlyDetailTable year={year} genres={genres} monthlyRows={monthlyRows} />
    </main>
  )
}
