import { useState } from "react"
import styles from "./AddItemDialog.module.css"

type Marketplaces = {
    mercari?: boolean
    yahoo?: boolean
    rakuma?: boolean
    instagram?: boolean
}

export type AddItemPayload = {
    title: string
    genre: string
    status: "販売中" | "売約済" | "保留"
    price: number
    soldDate?: string
    discountDate?: string
    image?: string
    marketplaces?: Marketplaces
}

type AddItemDialogProps = {
    open: boolean
    onClose: () => void
    onAdd: (payload: AddItemPayload) => void
    genres: string[]
    skuPreview: (genre: string) => string
}

export default function AddItemDialog({
    open,
    onClose,
    onAdd,
    genres,
    skuPreview,
}: AddItemDialogProps) {
    const [title, setTitle] = useState("")
    const [genre, setGenre] = useState(genres[0] ?? "")
    const [status, setStatus] = useState<AddItemPayload["status"]>("販売中")
    const [price, setPrice] = useState("")
    const [soldDate, setSoldDate] = useState("")
    const [discountDate, setDiscountDate] = useState("")
    const [image, setImage] = useState("")
    const [marketplaces, setMarketplaces] = useState<Marketplaces>({
        mercari: false,
        yahoo: false,
        rakuma: false,
        instagram: false,
    })
    const [error, setError] = useState<string | null>(null)

    // ダイアログを開いていないときは何も描画しない
    if (!open) return null

    // 出品先のトグル
    const handleToggleMarketplace = (key: keyof Marketplaces) => {
        setMarketplaces((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    // 追加ボタン押下時
    const handleSubmit = () => {
        const trimmedTitle = title.trim()

        if (!trimmedTitle || !genre || !price) {
            setError("タイトル・ジャンル・価格は必須です")
            return
        }

        const payload: AddItemPayload = {
            title: trimmedTitle,
            genre,
            status,
            price: Number(price),
            soldDate: soldDate || undefined,
            discountDate: discountDate || undefined,
            image: image || undefined,
            marketplaces,
        }

        onAdd(payload)

        // フォームをリセット
        setTitle("")
        setGenre(genres[0] ?? "")
        setStatus("販売中")
        setPrice("")
        setSoldDate("")
        setDiscountDate("")
        setImage("")
        setMarketplaces({
            mercari: false,
            yahoo: false,
            rakuma: false,
            instagram: false,
        })
        setError(null)

        onClose()
    }

    const previewSku =
        genre && genres.length > 0
            ? skuPreview(genre)
            : "ジャンルを選択してください"

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                {/* ヘッダー */}
                <div className={styles.header}>
                    <h2 className={styles.title}>商品追加</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>

                {/* 本文 */}
                <div className={styles.body}>
                    {/* 画像 */}
                    <div className={styles.fieldFull}>
                        <label className={styles.label}>商品画像（任意）</label>
                        <div className={styles.imageRow}>
                            <div className={styles.imagePreview}>
                                {image ? <img src={image} alt="preview" /> : "No Image"}
                            </div>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="画像URLを入力（Firebase Storage の URL など）"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 状態 */}
                    <div className={styles.field}>
                        <label className={styles.label}>状態</label>
                        <select
                            className={styles.select}
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value as AddItemPayload["status"])
                            }
                        >
                            <option value="販売中">販売中</option>
                            <option value="売約済">売約済</option>
                            <option value="保留">保留</option>
                        </select>
                    </div>

                    {/* タイトル */}
                    <div className={styles.fieldFull}>
                        <label className={styles.label}>タイトル *</label>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="例: 90s NIKE Track Jacket"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* ジャンル & 価格 */}
                    <div className={styles.twoCols}>
                        <div className={styles.field}>
                            <label className={styles.label}>ジャンル *</label>
                            <select
                                className={styles.select}
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                            >
                                {genres.map((g) => (
                                    <option key={g} value={g}>
                                        {g}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>価格 *</label>
                            <input
                                className={styles.input}
                                type="text"
                                inputMode="numeric"
                                placeholder="例: 6800"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.value.replace(/[^0-9]/g, ""))
                                }
                            />
                        </div>
                    </div>

                    {/* 出品先 */}
                    <div className={styles.fieldFull}>
                        <label className={styles.label}>出品先</label>
                        <div className={styles.marketGroup}>
                            {[
                                { key: "mercari", label: "メルカリ" },
                                { key: "yahoo", label: "ヤフオク" },
                                { key: "rakuma", label: "ラクマ" },
                                { key: "instagram", label: "Instagram" },
                            ].map(({ key, label }) => (
                                <label key={key} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={!!marketplaces[key as keyof Marketplaces]}
                                        onChange={() =>
                                            handleToggleMarketplace(key as keyof Marketplaces)
                                        }
                                    />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 売却日 / 値下げ日 */}
                    <div className={styles.twoCols}>
                        <div className={styles.field}>
                            <label className={styles.label}>売却日（任意）</label>
                            <input
                                className={styles.input}
                                type="date"
                                value={soldDate}
                                onChange={(e) => setSoldDate(e.target.value)}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>最終値下げ日（任意）</label>
                            <input
                                className={styles.input}
                                type="date"
                                value={discountDate}
                                onChange={(e) => setDiscountDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* SKU プレビュー */}
                    <div className={styles.fieldFull}>
                        <span className={styles.skuLabel}>管理番号プレビュー</span>
                        <span className={styles.skuValue}>{previewSku}</span>
                    </div>

                    {/* エラー表示 */}
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                {/* フッター */}
                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        キャンセル
                    </button>
                    <button className={styles.addButton} onClick={handleSubmit}>
                        追加
                    </button>
                </div>
            </div>
        </div>
    )
}
