import { useMemo, useState } from "react"
import type { FilterState, InventoryItem } from "../types"
import { isDiscountedToday } from "../utils/inventory"

export const useInventoryFilters = (items: InventoryItem[], todayYmd: string) => {
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
            if (filters.status.length > 0 && !filters.status.includes(item.status)) {
                return false
            }

            // 出品先（OR）
            if (filters.marketplaces.length > 0) {
                const hasAnyMarket = filters.marketplaces.some((key) => item.marketplaces?.[key])
                if (!hasAnyMarket) return false
            }

            // 価格
            const toNumberOrNull = (s: string) => {
                const t = s.trim()
                if (!t) return null
                const n = Number(t.replace(/,/g, ""))
                return Number.isFinite(n) ? n : null
            }

            const priceMin = toNumberOrNull(filters.priceMin)
            const priceMax = toNumberOrNull(filters.priceMax)
            if (priceMin != null && item.price < priceMin) return false
            if (priceMax != null && item.price > priceMax) return false

            // 画像
            if (filters.hasImage === "yes" && !item.image) return false
            if (filters.hasImage === "no" && item.image) return false

            // 値下げ（今日実施したか）
            if (filters.discounted !== "all") {
                const discountedToday = isDiscountedToday(item, todayYmd)
                if (filters.discounted === "yes" && !discountedToday) return false
                if (filters.discounted === "no" && discountedToday) return false
            }

            return true
        })
    }, [items, filters, todayYmd])

    return { filters, setFilters, filteredItems }
}
