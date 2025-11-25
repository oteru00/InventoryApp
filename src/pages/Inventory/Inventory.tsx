import { useMemo, useState, useEffect } from "react"
import AddItemDialog from "../../components/addItemDialog/AddItemDialog"
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
  status: string[]
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
  })

  // 絞り込みロジック
  const filteredItems = useMemo(() => {
    const q = filters.keyword.trim().toLowerCase()

    return items.filter((item) => {
      if (q) {
        const hit =
          item.sku.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q)
        if (!hit) return false
      }

      if (filters.genre && item.genre !== filters.genre) return false

      if (filters.status.length > 0 && !filters.status.includes(item.status)) {
        return false
      }

      return true
    })
  }, [items, filters])

  // 商品追加ダイアログから受け取ったデータを Firestore に保存
  const handleAdd = async (payload: AddItemPayload) => {
    try {
      const sku = skuPreview(payload.genre)

      const docData = {
        ...payload,
        sku,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await addDoc(collection(db, "inventoryItems"), docData)

      // 一覧は onSnapshot で勝手に更新されるので setItems は不要
      onCloseAdd()
      console.log("商品を追加しました")
    } catch (error) {
      console.error("追加エラー:", error)
      alert("商品の追加に失敗しました")
    }
  }

  return (
    <main className={styles.wrapper}>
      <h2 className={styles.title}>{TEXTS.INVENTORY_TITLE}</h2>

      {/* 絞り込みエリア */}
      <FilterBar value={filters} onChange={setFilters} genres={GENRES} />

      {/* テーブルエリア */}
      <section className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{TEXTS.TABLE_IMAGE}</th>
              <th>{TEXTS.TABLE_SKU_STATUS}</th>
              <th>{TEXTS.TABLE_TITLE}</th>
              <th>{TEXTS.TABLE_GENRE}</th>
              <th>{TEXTS.TABLE_PRICE}</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className={styles.row}>
                <td>
                  <div className={styles.imageBox}>
                    {item.image ? <img src={item.image} alt={item.title} /> : "No Image"}
                  </div>
                </td>
                <td>
                  <div>{item.sku}</div>
                  <div>{item.status}</div>
                </td>
                <td>{item.title}</td>
                <td>{item.genre}</td>
                <td>¥{item.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <p>該当する在庫はありません</p>
        )}
      </section>

      <AddItemDialog
        open={isAddOpen}
        onClose={onCloseAdd}
        onAdd={handleAdd}
        genres={GENRES}
        skuPreview={skuPreview}
      />
    </main>
  )
}
