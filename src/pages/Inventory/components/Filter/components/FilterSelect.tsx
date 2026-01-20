import styles from "../FilterBar.module.css"

type Option = { value: string; label: string }

type Props<T extends string> = {
    label: string
    value: T
    onChange: (v: T) => void
    options: Option[]
}

export default function FilterSelect<T extends string>({
    label,
    value,
    onChange,
    options,
}: Props<T>) {
    return (
        <div className={styles.group}>
            <label className={styles.label}>{label}</label>
            <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value as T)}>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
