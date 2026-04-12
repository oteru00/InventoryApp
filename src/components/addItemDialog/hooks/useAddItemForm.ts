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

    // ダイアログが開いたタイミングで、編集か新規追加かを判定し、フォームの状態を適切な初期値にリセットする処理
    useEffect(() => {
        if (!open) return //ダイアログが開かれていないときは処理を実行しない。論理否定（NOT）演算子

        if (initialItem) { //initialItem(アイテム情報) があるかどうかで処理を分岐。あれば編集(if)、なければ新規追加(else)
            setTitle(initialItem.title) //既存のデータをフォームにセット
            setPrice(String(initialItem.price)) //number（数値）のまま渡すと 警告や不整合を起こすかも、安全のために string（文字列）に変換
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
        } else { //全ての値を空にする
            setTitle("")
            setPrice("")
            setStartDate("")
            setSoldDate("")
            setImage("")
            setMarketplaces({ mercari: false, yahoo: false, rakuma: false, instagram: false })
            setSelectedGenre(genres[0] ?? "")
            setNewGenre("")
        }

        setError(null) //以前のエラーメッセージを消す
    }, [open, initialItem, genres]) //動作タイミング指定(ダイアログを開いた時、編集対象が変わった時、ジャンル一覧が更新された時)

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
