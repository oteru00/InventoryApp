
import styles from "../FilterBar.module.css"
import { TEXTS } from "../../../../../const/texts"

type Props = {
    onClear: () => void
}

export default function FilterActions({ onClear }: Props) {
    return (
        <div className={styles.clearWrapper}>
            <button type="button" className={styles.clearButton} onClick={onClear}>
                {TEXTS.FILTER_CLEAR}
            </button>
        </div>
    )
}
