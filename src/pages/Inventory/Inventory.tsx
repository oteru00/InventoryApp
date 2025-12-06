import { useMemo, useState, useEffect } from "react"
import AddItemDialog, { type AddItemPayload } from "../../components/addItemDialog/AddItemDialog"
import FilterBar from "../../components/Filter/FilterBar"
import styles from "./Inventory.module.css"
import { TEXTS } from "../../const/texts"
import {
  addDoc,
  collection,
  serverTimestamp,
  orderBy,
  query,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore"
import { db } from "../../firebase"

type InventoryProps = {
  isAddOpen: boolean
  onCloseAdd: () => void
}

type InventoryItem = {
  id: string
  sku: string
  title: string
  genre: string
  status: "販売中" | "売約済" | "保留"
  price: number
  soldDate?: string
  discountDate?: string
  image?: string
  marketplaces?: {
    mercari?: boolean
    yahoo?: boolean
    rakuma?: boolean
    instagram?: boolean
  }
}

type FilterState = {
  keyword: string
  genre: string
  status: ("販売中" | "売約済" | "保留")[]
  marketplaces: ("mercari" | "yahoo" | "rakuma" | "instagram")[]
  priceMin: string
  priceMax: string
  hasImage: "all" | "yes" | "no"
  discounted: "all" | "yes" | "no"
}

const GENRES = ["アウター", "トップス", "ボトムス"] as const

// 管理番号プレビュー用
const skuPreview = (genre: string) => {
  const index = GENRES.indexOf(genre as (typeof GENRES)[number])
  const num = index >= 0 ? index + 1 : 1
  return `${genre}-${String(num).padStart(3, "0")}`
}

// 値下げ日の更新（※使うタイミングが来たら呼び出す）
const handleUpdateDiscount = async (itemId: string, todayYmd: string) => {
  const ref = doc(db, "inventoryItems", itemId)

  await updateDoc(ref, {
    discountDate: todayYmd,
    updatedAt: serverTimestamp(),
  })
}

export default function Inventory({ isAddOpen, onCloseAdd }: InventoryProps) {
  // 在庫データ
  const [items, setItems] = useState<InventoryItem[]>([])
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  // Firestore からリアルタイム購読
  useEffect(() => {
    const q = query(
      collection(db, "inventoryItems"),
      orderBy("createdAt", "desc"),
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      const result: InventoryItem[] = snap.docs.map((docSnap) => {
        const data = docSnap.data() as any
        return {
          id: docSnap.id,
          sku: data.sku,
          title: data.title,
          genre: data.genre,
          status: data.status,
          price: data.price,
          soldDate: data.soldDate,
          discountDate: data.discountDate,
          image: data.image,
          marketplaces: data.marketplaces,
        }
      })
      setItems(result)
    })

    // アンマウント時に購読解除
    return () => unsubscribe()
  }, [])

  // 絞り込み条件
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    genre: "",
    status: [],
    marketplaces: [],
    priceMin: "",
    priceMax: "",
    hasImage: "all",
    discounted: "all",
  })

  // 絞り込みロジック
  const filteredItems = useMemo(() => {
    const q = filters.keyword.trim().toLowerCase()

    return items.filter((item) => {
      // キーワード（SKU / タイトル）
      if (q) {
        const hit =
          item.sku.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q)
        if (!hit) return false
      }

      // ジャンル
      if (filters.genre && item.genre !== filters.genre) return false

      // 状態
      if (
        filters.status.length > 0 &&
        !filters.status.includes(item.status)
      ) {
        return false
      }

      // 出品先（OR）
      if (filters.marketplaces.length > 0) {
        const hasAnyMarket = filters.marketplaces.some((key) =>
          item.marketplaces?.[key],
        )
        if (!hasAnyMarket) return false
      }

      // 価格
      const priceMin = filters.priceMin ? Number(filters.priceMin) : null
      const priceMax = filters.priceMax ? Number(filters.priceMax) : null
      if (priceMin != null && item.price < priceMin) return false
      if (priceMax != null && item.price > priceMax) return false

      // 画像
      if (filters.hasImage === "yes" && !item.image) return false
      if (filters.hasImage === "no" && item.image) return false

      // 値下げ（discountDate の有無で判定）
      if (filters.discounted === "yes" && !item.discountDate) return false
      if (filters.discounted === "no" && item.discountDate) return false

      return true
    })
  }, [items, filters])

  // 商品追加ダイアログから受け取ったデータを Firestore に保存
  const handleAdd = async (payload: AddItemPayload) => {
    try {
      const sku = skuPreview(payload.genre)

      const docData: any = {
        ...payload,
        sku,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Firestore に undefined を送らないように削除する
      Object.keys(docData).forEach((key) => {
        if (docData[key] === undefined) {
          delete docData[key]
        }
      })

      const ref = await addDoc(collection(db, "inventoryItems"), docData)

      // リアルタイム反映
      setItems((prev) => [{ id: ref.id, ...docData }, ...prev])

      console.log("商品を追加しました:", ref.id)
    } catch (error) {
      console.error("追加エラー:", error)
      alert("商品の追加に失敗しました")
    }
  }

  const handleUpdate = async (id: string, payload: AddItemPayload) => {
    try {
      const ref = doc(db, "inventoryItems", id)
      await updateDoc(ref, {
        title: payload.title,
        genre: payload.genre,
        status: payload.status,
        price: payload.price,
        soldDate: payload.soldDate ?? null,
        discountDate: payload.discountDate ?? null,
        image: payload.image ?? null,
        marketplaces: payload.marketplaces ?? {},
        updatedAt: serverTimestamp(),
      })
      setEditingItem(null)
    } catch (error) {
      console.error("更新エラー:", error)
      alert("商品の更新に失敗しました")
    }
  }

  // ==== 日付ユーティリティ ====
  const getLocalYmd = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  const daysBetween = (aYmd?: string, bYmd?: string) => {
    if (!aYmd || !bYmd) return Number.POSITIVE_INFINITY
    const a = new Date(`${aYmd}T00:00:00`)
    const b = new Date(`${bYmd}T00:00:00`)
    return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
  }

  const isDiscountedOn = (item: InventoryItem, ymd: string) =>
    !!item.discountDate && item.discountDate === ymd

  const isStaleFor3Days = (item: InventoryItem, todayYmd: string) => {
    // 値下げ日が無い or 3日以上前なら「サボり」
    if (!item.discountDate) return true
    return daysBetween(item.discountDate, todayYmd) >= 3
  }

  // ==== ステータスバッジ ====
  const StatusBadge = ({ status }: { status: InventoryItem["status"] }) => {
    let className = styles.statusHold
    if (status === "販売中") className = styles.statusOnSale
    if (status === "売約済") className = styles.statusSold

    return (
      <span className={`${styles.statusBadge} ${className}`}>
        {status}
      </span>
    )
  }

  // ==== 出品先のカラードット ====
  const MarketIcons = ({
    marketplaces,
  }: {
    marketplaces?: InventoryItem["marketplaces"]
  }) => {
    const m = marketplaces ?? {}
    const entries = [
      { key: "mercari", className: styles.marketMercari },
      { key: "yahoo", className: styles.marketYahoo },
      { key: "rakuma", className: styles.marketRakuma },
      { key: "instagram", className: styles.marketInstagram },
    ] as const

    return (
      <div className={styles.marketDots} aria-label="出品先">
        {entries.map(({ key, className }) => (
          <span
            key={key}
            className={`${styles.marketDot} ${m[key] ? className : ""}`}
          />
        ))}
      </div>
    )
  }

  const today = getLocalYmd()

  return (
    <main className={styles.wrapper}>
      <h2 className={styles.title}>{TEXTS.INVENTORY_TITLE}</h2>

      {/* 絞り込みエリア */}
      <FilterBar
        value={filters}
        onChange={setFilters}
        genres={GENRES as unknown as string[]}
      />

      {/* テーブルエリア */}
      <section className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>{TEXTS.TABLE_IMAGE}</th>
              <th className={styles.th}>{TEXTS.TABLE_SKU_STATUS}</th>
              <th className={styles.th}>{TEXTS.TABLE_TITLE}</th>
              <th className={styles.th}>{TEXTS.TABLE_GENRE}</th>
              <th className={styles.th}>{TEXTS.TABLE_MARKETPLACES}</th>
              <th className={styles.th}>{TEXTS.TABLE_PRICE}</th>
              <th className={styles.th}>{TEXTS.TABLE_DISCOUNT_TODAY}</th>
              <th className={styles.th}>{TEXTS.TABLE_LAST_DISCOUNT}</th>
              <th className={styles.th}>{TEXTS.TABLE_EDIT}</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const discountedToday = isDiscountedOn(item, today)
              const stale = isStaleFor3Days(item, today)

              return (
                <tr
                  key={item.id}
                  className={`${styles.row} ${stale ? styles.rowStale : ""}`}
                >
                  {/* 画像 */}
                  <td className={styles.td}>
                    <div className={styles.imageBox}>
                      {item.image ? (
                        <img src={item.image} alt={item.title} />
                      ) : (
                        "No Image"
                      )}
                    </div>
                  </td>

                  {/* 管理番号 / 状態 */}
                  <td className={styles.td}>
                    <div className={styles.skuText}>{item.sku}</div>
                    <div className={styles.statusWrapper}>
                      <StatusBadge status={item.status} />
                    </div>
                  </td>

                  {/* タイトル */}
                  <td className={styles.tdTitle}>{item.title}</td>

                  {/* ジャンル */}
                  <td className={styles.td}>{item.genre}</td>

                  {/* 出品先 */}
                  <td className={styles.td}>
                    <MarketIcons marketplaces={item.marketplaces} />
                  </td>

                  {/* 価格 */}
                  <td className={styles.tdPrice}>
                    ¥{item.price.toLocaleString()}
                  </td>

                  {/* 今日の値下げ */}
                  <td className={styles.td}>
                    <span
                      className={`${styles.discountBadge} ${discountedToday
                          ? styles.discountDone
                          : styles.discountNone
                        }`}
                    >
                      {discountedToday ? "本日実施" : "未実施"}
                    </span>
                  </td>

                  {/* 最終値下げ日 */}
                  <td className={styles.tdLastDiscount}>
                    {item.discountDate ?? "―"}
                  </td>

                  {/* 編集 */}
                  <td className={styles.tdEdit}>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => setEditingItem(item)}
                    >
                      {TEXTS.TABLE_EDIT_BUTTON}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <p className={styles.emptyMessage}>該当する在庫はありません</p>
        )}
      </section>

      {/* 追加用 */}
      <AddItemDialog
        open={isAddOpen}
        onClose={onCloseAdd}
        onAdd={handleAdd}
        genres={GENRES as unknown as string[]}
        skuPreview={skuPreview}
        mode="add"
      />

      {/* 編集用 */}
      <AddItemDialog
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        onAdd={(payload) => {
          if (!editingItem) return
          handleUpdate(editingItem.id, payload)
        }}
        genres={GENRES as unknown as string[]}
        skuPreview={skuPreview}
        mode="edit"
        initialItem={
          editingItem
            ? {
              title: editingItem.title,
              genre: editingItem.genre,
              status: editingItem.status,
              price: editingItem.price,
              soldDate: editingItem.soldDate,
              discountDate: editingItem.discountDate,
              image: editingItem.image,
              marketplaces: editingItem.marketplaces,
            }
            : undefined
        }
      />
    </main>
  )
}
