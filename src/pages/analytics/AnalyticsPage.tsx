import { useEffect, useMemo, useState } from "react"
import styles from "./AnalyticsPage.module.css"
import { db } from "../../firebase"
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore"
import GenreSalesChart, { type ChartRow } from "./components/GenreSalesChart"
import MonthlyDetailTable, { type MonthlyRow } from "./components/MonthlyDetailTable"
import { TEXTS } from "../../const/texts"

// アイテム情報の型
type InventoryItem = {
  id: string
  title: string
  genre: string
  status: "販売中" | "売約済"
  price: number
  startDate?: Timestamp | string
  soldDate?: Timestamp | string
  createdAt: Timestamp | string
}

// ★ Timestamp / string を JS Date に変換（混在対応）
const toJsDate = (v?: Timestamp | string | null): Date | null => {
  if (!v) return null

  if (typeof v === "string") {
    const s = v.trim()
    if (!s) return null
    const d = new Date(s) // "YYYY-MM-DD" 想定
    return Number.isNaN(d.getTime()) ? null : d
  }

  // Firestore Timestamp
  return v.toDate()
}

export default function AnalyticsPage() {
  //itemsの商品情報を取得。取得したデータをグラフ等に使用するため
  const [items, setItems] = useState<InventoryItem[]>([]) //InventoryItem[]の状態をitemsとして持ち、更新したいときは新しい配列を作ってsetItemsで入れ替える

  //ページ表示時に Firestore と接続する
  useEffect(() => { //Firestoreとの接続やデータ取得は「描画後」に行うべき副作用のため、useEffectを使用
    const q = query(collection(db, "inventoryItems"), orderBy("createdAt", "desc"))//collectionで inventoryItems を指定し、createdAt の新しい順で取得するための監視条件 q を作っている

    const unsubscribe = onSnapshot(q, (snap) => { //onSnapshotで q（監視条件）をずっと見張って、その結果をその都度 snap として受け取る
      const result: InventoryItem[] = snap.docs.map((docSnap) => { //snap.docs(Firestoreのドキュメント一覧)をmapでdocSnapとして1件ずつ取り出してInventoryItem[]としてresultにまとめている
        const data = docSnap.data() as any //docSnapから、data()(フィールドの中身)だけを取り出してdataに入れる。Firestoreのdata()は型が分からないためas anyで何が入って言い方の上書き
        return {
          id: docSnap.id,
          title: data.title ?? "",
          genre: data.genre ?? "",
          status: data.status ?? "販売中",
          price: typeof data.price === "number" ? data.price : 0,
          startDate: data.startDate,
          soldDate: data.soldDate,
          createdAt: data.createdAt,
        }
      })
      setItems(result) //整形した在庫データ配列を state に保存して画面を更新している
    })

    return () => unsubscribe() //コンポーネントが消えたときに Firestore の監視を解除するようにしている
  }, []) //開いた時だけ動いてほしいので空

  // 売約済み & soldDate があるものだけを取得
  const soldItems = useMemo(() => { //useMemoでの計算結果をsoldItemsとして記憶。不要な再計算を防ぐために useMemo を使用
    return items.filter((item) => { //itemsの中から、条件に合うitemだけをfilterで残す
      if (item.status !== "売約済") return false //itemのstatusが売約済と!==で等しくないかを確認して等しくなければ除外する
      return !!toJsDate(item.soldDate) //itemの中のsoldDateをtoJsDateでJS用に変換できたら true、できなければ false を返している
    })
  }, [items]) //items が変わったときだけ計算

  // ジャンル一覧作成
  const genres = useMemo(() => { //このページを開いたときだけでいいからuseMemoで計算
    const set = new Set<string>() //string（文字列）だけを入れられる、重複しない Set を、新しく空の状態で1つ作る,(ジャンルが重複しないように)
    items.forEach((item) => { //itemsの中身(item)を1件ずつ取り出して順番に処理(forEach)するループ
      const g = (item.genre ?? "").trim() //item.genre があればそれを使い、なければ空文字にして、前後の空白を削った文字列(trim)を g に入れる
      if (g) set.add(g) //g が空じゃなければ、その文字列を Set に追加する
    })
    return Array.from(set) //setを配列に変換してReactで扱いやすい形にして返している
  }, [items]) //itemsが変わった時に

  // 年の候補（売約済みの soldDate から）
  const yearOptions = useMemo(() => {
    const years = new Set<number>() 
    soldItems.forEach((item) => {
      const d = toJsDate(item.soldDate)
      if (!d) return
      years.add(d.getFullYear())
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
      const d = toJsDate(item.startDate)
      if (!d) return false
      return d.getFullYear() === year && d.getMonth() === targetMonth
    })
  }, [items, year, month])

  // 対象年・月の売約済み（soldDate ベース）
  const soldInPeriod = useMemo(() => {
    if (year === null) return []
    const targetMonth = month - 1

    return soldItems.filter((item) => {
      const d = toJsDate(item.soldDate)
      if (!d) return false
      return d.getFullYear() === year && d.getMonth() === targetMonth
    })
  }, [soldItems, year, month])

  // グラフ用データ
  const chartData: ChartRow[] = useMemo(() => {
    return genres.map((g) => {
      const total = itemsInPeriod.filter((i) => i.genre === g).length
      const sold = soldInPeriod.filter((i) => i.genre === g).length
      return { genre: g, total, sold }
    })
  }, [itemsInPeriod, soldInPeriod, genres])

  // 月別表用データ（指定年の売約済み集計）
  const monthlyRows: MonthlyRow[] = useMemo(() => {
    if (year === null) return []

    const base: MonthlyRow[] = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      counts: {},
    }))

    soldItems.forEach((item) => {
      const d = toJsDate(item.soldDate)
      if (!d) return
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
      <h2 className={styles.title}>{TEXTS.ANALYTICS_TITLE}</h2>

      {/* 年・月セレクト */}
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

      {/* グラフ */}
      <GenreSalesChart year={year} month={month} chartData={chartData} />

      {/* 月別表 */}
      <MonthlyDetailTable year={year} genres={genres} monthlyRows={monthlyRows} />
    </main>
  )
}
