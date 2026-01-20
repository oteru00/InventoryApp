export type AddItemPayload = {
    title: string
    genre: string
    price: number
    startDate?: string
    soldDate?: string
    image?: string
    marketplaces?: Marketplaces
}

export type Marketplaces = {
    mercari?: boolean
    yahoo?: boolean
    rakuma?: boolean
    instagram?: boolean
}

export type AddItemDialogMode = "add" | "edit"
