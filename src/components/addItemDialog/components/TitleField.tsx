type Props = {
    styles: Record<string, string>
    label: string
    placeholder: string
    value: string
    onChange: (v: string) => void
}

export default function TitleField({ styles, label, placeholder, value, onChange }: Props) {
    return (
        <div className={styles.fieldFull}>
            <label className={styles.label}>{label}</label>
            <input
                className={styles.input}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}
