import { useEffect, useMemo, useState } from "react"
import {
    addDoc,
    collection,
    deleteDoc,
    deleteField,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore"
import { db } from "../../../firebase"
import type { InventoryItem, ItemStatus } from "../types"
import { normalize, nextSkuFromItems, type AddItemPayload } from "../utils/inventory"
import { DEFAULT_GENRES } from "../types"

/**
 * Firestoreに過去データとして Timestamp が混在していても、
 * UI(= input type="date")で扱える "YYYY-MM-DD" に統一して返す。
 * 今後の保存は normalize() が string を返すので、string保存に揃っていく。
 */
const toDateString = (v: any): string | undefined => {
    if (!v) return undefined

    // string: "YYYY-MM-DD"
    if (typeof v === "string") {
        const s = v.trim()
        return s ? s : undefined
    }

    // Timestamp
    if (v instanceof Timestamp) {
        const d = v.toDate()
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
    }

    return undefined
}

export const useInventoryItems = () => {
    const [items, setItems] = useState<InventoryItem[]>([])
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

    // ジャンル一覧（itemsから生成）
    const genres = useMemo(() => {
        const set = new Set<string>(DEFAULT_GENRES as unknown as string[])
        items.forEach((i) => {
            const g = (i.genre ?? "").trim()
            if (g) set.add(g)
        })
        return Array.from(set)
    }, [items])

    // SKU preview
    const skuPreview = (genre: string) => nextSkuFromItems(items, genre)

    // Firestore購読
    useEffect(() => {
        // ※ soldDate は混在すると orderBy が壊れる可能性があるので createdAt を採用
        const q = query(collection(db, "inventoryItems"), orderBy("createdAt", "desc"))

        const unsubscribe = onSnapshot(q, (snap) => {
            const result: InventoryItem[] = snap.docs.map((docSnap) => {
                const data = docSnap.data() as any

                // ★ここが完成ポイント：Timestamp混在でも必ず "YYYY-MM-DD" に統一
                const startDate = toDateString(data.startDate)
                const soldDate = toDateString(data.soldDate)

                // ★status は payload からではなく soldDate 有無で決める（normalizeと同じ思想）
                const status: ItemStatus = soldDate ? "売約済" : "販売中"

                return {
                    id: docSnap.id,
                    sku: data.sku ?? "",
                    title: data.title ?? "",
                    genre: data.genre ?? "",
                    status,
                    price: typeof data.price === "number" ? data.price : 0,

                    // string統一された値が入る
                    startDate,
                    soldDate,

                    // Timestamp運用のものは Timestamp のまま
                    discountedAt: data.discountedAt instanceof Timestamp ? data.discountedAt : undefined,

                    image: typeof data.image === "string" && data.image.trim() ? data.image : undefined,
                    marketplaces: data.marketplaces ?? {},

                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                }
            })

            setItems(result)
        })

        return () => unsubscribe()
    }, [])

    // 追加
    const addItem = async (payload: AddItemPayload) => {
        const sku = nextSkuFromItems(items, payload.genre)
        const { startDate, soldDate, status } = normalize(payload) // ←ここは string/undefined のはず

        const docData: any = {
            sku,
            title: payload.title,
            genre: payload.genre,
            price: payload.price,
            image: payload.image ?? null,
            marketplaces: payload.marketplaces ?? {},
            status, // 念のため保存（表示にも使える）
            startDate, // "YYYY-MM-DD" | undefined
            soldDate, // "YYYY-MM-DD" | undefined
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }

        // undefinedは消す（Firestoreに不要なフィールドを作らない）
        Object.keys(docData).forEach((k) => docData[k] === undefined && delete docData[k])

        await addDoc(collection(db, "inventoryItems"), docData)
    }

    // 更新
    const updateItem = async (id: string, payload: AddItemPayload) => {
        const ref = doc(db, "inventoryItems", id)
        const current = items.find((x) => x.id === id)

        const nextSkuValue =
            current && current.genre !== payload.genre
                ? nextSkuFromItems(items, payload.genre)
                : current?.sku ?? nextSkuFromItems(items, payload.genre)

        const { startDate, soldDate, status } = normalize(payload)

        const prevPrice = current?.price ?? 0
        const nextPrice = payload.price
        const didDiscount = nextPrice < prevPrice

        const patch: Record<string, any> = {
            title: payload.title,
            genre: payload.genre,
            sku: nextSkuValue,
            price: nextPrice,
            image: payload.image ?? null,
            marketplaces: payload.marketplaces ?? {},

            // ★空ならフィールド削除（"未入力" として扱える）
            startDate: startDate ?? deleteField(),
            soldDate: soldDate ?? deleteField(),

            // ★status は soldDate 有無に同期させる
            status,

            updatedAt: serverTimestamp(),
        }

        if (didDiscount) patch.discountedAt = serverTimestamp()

        await updateDoc(ref, patch)
        setEditingItem(null)
    }

    // 削除（売約済は不可）
    const deleteItem = async (item: InventoryItem) => {
        if (item.status === "売約済") {
            alert("売約済の商品は削除できません。")
            return
        }
        const ok = window.confirm("この商品を削除しますか？\n※元に戻せません")
        if (!ok) return

        await deleteDoc(doc(db, "inventoryItems", item.id))
        setEditingItem(null)
    }

    return {
        items,
        genres,
        skuPreview,

        editingItem,
        setEditingItem,

        addItem,
        updateItem,
        deleteItem,
    }
}
