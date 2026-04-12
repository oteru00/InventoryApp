
import type { InventoryItem, ItemStatus } from "../types"

export type AddItemPayload = {
    title: string
    genre: string
    price: number
    startDate?: string
    soldDate?: string
    image?: string
    marketplaces?: {
        mercari?: boolean
        yahoo?: boolean
        rakuma?: boolean
        instagram?: boolean
    }
}

export const getLocalYmd = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}

export const isDiscountedToday = (item: InventoryItem, todayYmd: string) => {
    if (!item.discountedAt) return false
    const d = item.discountedAt.toDate()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}` === todayYmd
}

// statusをpayloadから受け取らず、soldDateから決める（正規化）
export const normalize = (payload: AddItemPayload) => {
    const trimOrUndef = (v?: string) => {
        const t = v?.trim()
        return t ? t : undefined
    }
    const startDate = trimOrUndef(payload.startDate)
    const soldDate = trimOrUndef(payload.soldDate)
    const status: ItemStatus = soldDate ? "売約済" : "販売中"
    return { startDate, soldDate, status }
}

// SKU採番（items依存なので pure に）
export const nextSkuFromItems = (items: InventoryItem[], genre: string) => {
    const prefix = `${genre}-`
    const nums = items
        .map((i) => i.sku)
        .filter((sku) => sku?.startsWith(prefix))
        .map((sku) => Number(sku.replace(prefix, "")))
        .filter((n) => Number.isFinite(n))

    const next = (nums.length ? Math.max(...nums) : 0) + 1
    return `${genre}-${String(next).padStart(3, "0")}`
}
