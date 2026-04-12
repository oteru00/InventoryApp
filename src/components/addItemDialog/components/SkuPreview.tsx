type Props = {
    styles: Record<string, string>
    label: string
    value: string
}

export default function SkuPreview({ styles, label, value }: Props) {
    return (
        <div className={styles.fieldFull}>
            <span className={styles.skuLabel}>{label}</span>
            <span className={styles.skuValue}>{value}</span>
        </div>
    )
}

