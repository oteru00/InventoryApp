import { useEffect, useMemo, useState } from "react"
import type { AddItemPayload, Marketplaces } from "../types"

type Params = {
    open: boolean
    genres: string[]
    skuPreview: (genre: string) => string
    initialItem?: AddItemPayload
    texts?: {
        errorUploading: string
        errorRequired: string
        skuPreviewEmpty: string
    }
}

export function useAddItemForm({ open, genres, skuPreview, initialItem }: Params) {
    const [title, setTitle] = useState("")
    const [newGenre, setNewGenre] = useState("")
    const [selectedGenre, setSelectedGenre] = useState("")
    const [price, setPrice] = useState("")
    const [startDate, setStartDate] = useState("")
    const [soldDate, setSoldDate] = useState("")
    const [image, setImage] = useState("")
    const [marketplaces, setMarketplaces] = useState<Marketplaces>({
        mercari: false,
        yahoo: false,
        rakuma: false,
        instagram: false,
    })
    const [error, setError] = useState<string | null>(null)

    // open時に初期化
    useEffect(() => {
        if (!open) return

        if (initialItem) {
            setTitle(initialItem.title)
            setPrice(String(initialItem.price))
            setStartDate(initialItem.startDate ?? "")
            setSoldDate(initialItem.soldDate ?? "")
            setImage(initialItem.image ?? "")
            setMarketplaces({
                mercari: !!initialItem.marketplaces?.mercari,
                yahoo: !!initialItem.marketplaces?.yahoo,
                rakuma: !!initialItem.marketplaces?.rakuma,
                instagram: !!initialItem.marketplaces?.instagram,
            })
            setSelectedGenre(initialItem.genre ?? "")
            setNewGenre("")
        } else {
            setTitle("")
            setPrice("")
            setStartDate("")
            setSoldDate("")
            setImage("")
            setMarketplaces({ mercari: false, yahoo: false, rakuma: false, instagram: false })
            setSelectedGenre(genres[0] ?? "")
            setNewGenre("")
        }

        setError(null)
    }, [open, initialItem, genres])

    const finalGenre = useMemo(() => newGenre.trim() || selectedGenre.trim(), [newGenre, selectedGenre])

    const previewSku = useMemo(() => {
        return finalGenre ? skuPreview(finalGenre) : "ジャンルを選択してください"
    }, [finalGenre, skuPreview])

    const toggleMarketplace = (key: keyof Marketplaces) => {
        setMarketplaces((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const validate = (params?: { uploading?: boolean }) => {
        if (params?.uploading) return "画像アップロード中です。完了してから登録してください。"
        if (!title.trim() || !finalGenre || !price) return "タイトル・ジャンル・価格は必須です"
        if (Number.isNaN(Number(price))) return "価格が不正です"
        return null
    }

    const buildPayload = (): AddItemPayload => {
        return {
            title: title.trim(),
            genre: finalGenre,
            price: Number(price),
            startDate: startDate || undefined,
            soldDate: soldDate || undefined,
            image: image || undefined,
            marketplaces,
        }
    }

    return {
        // values
        title,
        newGenre,
        selectedGenre,
        price,
        startDate,
        soldDate,
        image,
        marketplaces,
        error,
        finalGenre,
        previewSku,

        // setters
        setTitle,
        setNewGenre,
        setSelectedGenre,
        setPrice,
        setStartDate,
        setSoldDate,
        setImage,
        setMarketplaces,
        setError,

        // actions
        toggleMarketplace,
        validate,
        buildPayload,
    }
}
