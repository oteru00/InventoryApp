type Props = {
    styles: Record<string, string>
    label: string
    placeholder: string
    value: string
    onChange: (v: string) => void
}

export default function PriceField({ styles, label, placeholder, value, onChange }: Props) {
    return (
        <div className={styles.fieldFull}>
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <input
                    className={styles.input}
                    type="text"
                    inputMode="numeric"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
                />
            </div>
        </div>
    )
}
