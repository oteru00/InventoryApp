import {useMemo, useState, useEffect } from "react"
import AddItemDialog from "../../components/addItemDialog/AddItemDialog"
import FilterBar from "../../components/Filter/FilterBar"
import styles from "./Inventory.module.css"
import { TEXTS } from "../../const/texts"
import { addDoc, collection, serverTimestamp, getDocs, orderBy, query, onSnapshot } from "firebase/firestore"
import { db } from "../../firebase"

const handleAdd = async (payload: AddItemPayload) => {
  const sku = skuPreview(payload.genre)
  const docData = {
    ...payload,
    sku,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const ref = await addDoc(collection(db, "inventoryItems"), docData)

  setItems((prev) => [
    { id: ref.id, ...docData, },
    ...prev,
  ])

  onCloseAdd()
}


type InventoryProps = {
  isAddOpen: boolean
  onCloseAdd: () => void
}

type InventoryItem = {
  id: number
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

const GENRES = ["アウター", "トップス", "ボトムス"]

const skuPreview = (genre: string) => {
  const index = GENRES.indexOf(genre as (typeof GENRES)[number])
  const num = index >= 0 ? index + 1 : 1
  return `${genre}-${String(num).padStart(3, "0")}`
}


export default function Inventory({ isAddOpen, onCloseAdd }: InventoryProps) {
  // 在庫データ
  const [items, setItems] = useState<InventoryItem[]>([])


  useEffect(() => {
    const q = query(
      collection(db, "inventoryItems"),
      orderBy("createdAt", "desc"),
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      const result: InventoryItem[] = snap.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
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

  // 商品追加ダイアグから受けとるデータ
  const handleAdd = (payload: AddItemPayload) => {
    const nextId = Date.now()
    const nextSku = skuPreview(payload.genre)

    const newItem: InventoryItem = {
      id: nextId,
      sku: nextSku,
      title: payload.title,
      genre: payload.genre,
      status: payload.status,
      price: payload.price,
      soldDate: payload.soldDate,
      discountDate: payload.discountDate,
      image: payload.image,
      marketplaces: payload.marketplaces ?? {},
    }
    setItems((prev) => [newItem, ...prev])
    onCloseAdd()
  }

  return (
    <>
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
                    <div className={styles.imageBox}>No Image</div>
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
    </>
  )
}
