import type { Timestamp } from "firebase/firestore"

export type InventoryProps = {
    isAddOpen: boolean
    onCloseAdd: () => void
}

export type ItemStatus = "販売中" | "売約済"

export type InventoryItem = {
    id: string
    sku: string
    title: string
    genre: string
    status: ItemStatus
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
    createdAt?: Timestamp
    updatedAt?: Timestamp
    discountedAt?: Timestamp
}

// フィルター（保留なし）
export type FilterState = {
    keyword: string
    genre: string
    status: ItemStatus[]
    marketplaces: ("mercari" | "yahoo" | "rakuma" | "instagram")[]
    priceMin: string
    priceMax: string
    hasImage: "all" | "yes" | "no"
    discounted: "all" | "yes" | "no"
}

export const DEFAULT_GENRES = ["アウター", "トップス", "ボトムス"] as const
