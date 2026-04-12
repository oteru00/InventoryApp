type Props = {
    styles: Record<string, string>
    label: string
    imageUrl: string
    uploading: boolean
    uploadingText: string
    noImageText: string
    onPickFile: (file: File) => void
}

export default function ImageUploaderField({
    styles,
    label,
    imageUrl,
    uploading,
    uploadingText,
    noImageText,
    onPickFile,
}: Props) {
    return (
        <div className={styles.fieldFull}>
            <label className={styles.label}>{label}</label>

            <div className={styles.imageRow}>
                <div className={styles.imagePreview}>
                    {imageUrl ? <img src={imageUrl} alt="preview" /> : noImageText}
                </div>

                <input
                    className={styles.input}
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        e.currentTarget.value = ""
                        if (!file) return
                        onPickFile(file)
                    }}
                />
            </div>

            {uploading && <p>{uploadingText}</p>}
        </div>
    )
}
