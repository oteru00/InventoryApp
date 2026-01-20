type Props = {
    styles: Record<string, string>
    startLabel: string
    soldLabel: string
    startDate: string
    soldDate: string
    onChangeStartDate: (v: string) => void
    onChangeSoldDate: (v: string) => void
}

export default function DateRangeFields({
    styles,
    startLabel,
    soldLabel,
    startDate,
    soldDate,
    onChangeStartDate,
    onChangeSoldDate,
}: Props) {
    return (
        <div className={styles.twoCols}>
            <div className={styles.field}>
                <label className={styles.label}>{startLabel}</label>
                <input className={styles.input} type="date" value={startDate} onChange={(e) => onChangeStartDate(e.target.value)} />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>{soldLabel}</label>
                <input className={styles.input} type="date" value={soldDate} onChange={(e) => onChangeSoldDate(e.target.value)} />
            </div>
        </div>
    )
}
