// src/pages/Inventory/components/Filter/types.ts
export type Status = "販売中" | "売約済"
export type Marketplace = "mercari" | "yahoo" | "rakuma" | "instagram"

export type FilterState = {
    keyword: string
    genre: string
    status: Status[]
    marketplaces: Marketplace[]
    priceMin: string
    priceMax: string
    hasImage: "all" | "yes" | "no"
    discounted: "all" | "yes" | "no"
}
