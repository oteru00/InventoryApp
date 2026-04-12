import { TEXTS } from "../../const/texts"
import styles from "./AddItemDialog.module.css"

import type { AddItemDialogMode, AddItemPayload } from "./types"
import { useAddItemForm } from "./hooks/useAddItemForm"
import { useImageUpload } from "./hooks/useImageUpload"

import DialogShell from "./components/DialogShell"
import ImageUploaderField from "./components/ImageUploaderField"
import TitleField from "./components/TitleField"
import GenreField from "./components/GenreField"
import PriceField from "./components/PriceField"
import MarketplaceCheckboxGroup from "./components/MarketplaceCheckboxGroup"
import DateRangeFields from "./components/DateRangeFields"
import SkuPreview from "./components/SkuPreview"

type AddItemDialogProps = {
    open: boolean
    onClose: () => void
    onAdd: (payload: AddItemPayload) => void
    genres: string[]
    skuPreview: (genre: string) => string
    mode?: AddItemDialogMode
    initialItem?: AddItemPayload
}

export default function AddItemDialog({
    open,
    onClose,
    onAdd,
    genres,
    skuPreview,
    mode = "add",
    initialItem,
}: AddItemDialogProps) {
    const isEdit = mode === "edit"

    const form = useAddItemForm({
        open,
        genres,
        skuPreview,
        initialItem,
        texts: {
            errorUploading: TEXTS.ERROR_UPLOADING,
            errorRequired: TEXTS.ERROR_REQUIRED,
            skuPreviewEmpty: TEXTS.SKU_PREVIEW_EMPTY,
        },
    })
    const uploader = useImageUpload({ maxSizeMB: 10, folder: "inventory-images" })

    if (!open) return null

    //画像のアップロード
    const handlePickFile = async (file: File) => {    //File 型のファイルを受け取り、非同期処理(async)する関数を定義
        form.setError(null) //前回のフォームが残らないようにエラーをリセット
        uploader.setError(null) //アップロード側も一度エラーをリセット

        try { //tryで処理が成功した場合と失敗した場合の処理を分けている
            const url = await uploader.upload(file) //awaitで非同期にして処理が完了した時にfileを受け取るようにしている
            form.setImage(url) //アップロードされた画像をフォームに保存
        } catch (e) { //失敗した際の処理
            const message = e instanceof Error ? e.message : TEXTS.ERROR_REQUIRED
            form.setError(message) //
        }
    }

    const handleSubmit = () => {
        const validationError = form.validate({ uploading: uploader.uploading })
        if (validationError) {
            form.setError(validationError)
            return
        }

        onAdd(form.buildPayload())
        onClose()
    }

    const dialogTitle = isEdit ? TEXTS.ADD_DIALOG_TITLE_EDIT : TEXTS.ADD_DIALOG_TITLE_ADD

    return (
        <DialogShell
            styles={styles}
            title={dialogTitle}
            onClose={onClose}
            footer={
                <>
                    <button className={styles.cancelButton} onClick={onClose}>
                        {TEXTS.ADD_DIALOG_CANCEL}
                    </button>
                    <button className={styles.addButton} onClick={handleSubmit} disabled={uploader.uploading}>
                        {isEdit ? TEXTS.ADD_DIALOG_ADD : TEXTS.ADD_DIALOG_SAVE}
                    </button>
                </>
            }
        >
            <ImageUploaderField
                styles={styles}
                label={TEXTS.LABEL_IMAGE}
                imageUrl={form.image}
                uploading={uploader.uploading}
                uploadingText={TEXTS.IMAGE_UPLOADING}
                noImageText={TEXTS.IMAGE_NO_IMAGE}
                onPickFile={handlePickFile}
            />

            <TitleField
                styles={styles}
                label={TEXTS.LABEL_TITLE}
                placeholder={TEXTS.TITLE_PLACEHOLDER}
                value={form.title}
                onChange={form.setTitle}
            />

            <GenreField
                styles={styles}
                label={TEXTS.LABEL_GENRE}
                genres={genres}
                newGenre={form.newGenre}
                selectedGenre={form.selectedGenre}
                newPlaceholder={TEXTS.GENRE_NEW_PLACEHOLDER}
                selectPlaceholder={TEXTS.GENRE_SELECT_PLACEHOLDER}
                onChangeNewGenre={form.setNewGenre}
                onChangeSelectedGenre={form.setSelectedGenre}
            />

            <PriceField
                styles={styles}
                label={TEXTS.LABEL_PRICE}
                placeholder={TEXTS.PRICE_PLACEHOLDER}
                value={form.price}
                onChange={form.setPrice}
            />

            <MarketplaceCheckboxGroup
                styles={styles}
                label={TEXTS.LABEL_MARKETPLACE}
                marketplaces={form.marketplaces}
                itemLabels={{
                    mercari: TEXTS.MARKET_MERCARI,
                    yahoo: TEXTS.MARKET_YAHOO,
                    rakuma: TEXTS.MARKET_RAKUMA,
                    instagram: TEXTS.MARKET_INSTAGRAM,
                }}
                onToggle={form.toggleMarketplace}
            />

            <DateRangeFields
                styles={styles}
                startLabel={TEXTS.LABEL_START_DATE}
                soldLabel={TEXTS.LABEL_SOLD_DATE}
                startDate={form.startDate}
                soldDate={form.soldDate}
                onChangeStartDate={form.setStartDate}
                onChangeSoldDate={form.setSoldDate}
            />

            <SkuPreview styles={styles} label={TEXTS.LABEL_SKU_PREVIEW} value={form.previewSku} />

            {(form.error || uploader.error) && <p className={styles.error}>{form.error ?? uploader.error}</p>}
        </DialogShell>
    )
}
