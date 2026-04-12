import styles from "../FilterBar.module.css"

type Option<T extends string> = { value: T; label: string }

type Props<T extends string> = {
    label: string
    values: T[]
    onToggle: (v: T) => void
    options: Option<T>[]
}

export default function FilterCheckboxGroup<T extends string>({
    label,
    values,
    onToggle,
    options,
}: Props<T>) {
    return (
        <div className={styles.group}>
            <label className={styles.label}>{label}</label>
            <div className={styles.checkboxRow}>
                {options.map((opt) => (
                    <label key={opt.value} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={values.includes(opt.value)}
                            onChange={() => onToggle(opt.value)}
                        />
                        <span>{opt.label}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}
