import styles from "../FilterBar.module.css"
import { TEXTS } from "../../../../../const/texts"

type Props = {
    label: string
    minValue: string
    maxValue: string
    onMinChange: (v: string) => void
    onMaxChange: (v: string) => void
}

export default function PriceRangeInput({
    label,
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
}: Props) {
    const onlyDigits = (s: string) => s.replace(/[^0-9]/g, "")

    return (
        <div className={styles.group}>
            <label className={styles.label}>{label}</label>
            <div className={styles.priceRow}>
                <input
                    className={styles.input}
                    placeholder={TEXTS.FILTER_PRICE_MIN}
                    value={minValue}
                    inputMode="numeric"
                    onChange={(e) => onMinChange(onlyDigits(e.target.value))}
                />
                <span className={styles.tilde}>~</span>
                <input
                    className={styles.input}
                    placeholder={TEXTS.FILTER_PRICE_MAX}
                    value={maxValue}
                    inputMode="numeric"
                    onChange={(e) => onMaxChange(onlyDigits(e.target.value))}
                />
            </div>
        </div>
    )
}
