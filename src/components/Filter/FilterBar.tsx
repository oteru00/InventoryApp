import styles from "./FilterBar.module.css"

export type FilterState = {
    keyword: string
    genre: string
    status: string[]
}

type FilterBarPops = {
    value: FilterState
    onChange: (next: FilterState) => void
    genres: string[]
}

export default function FilterBar({ value, onChange, genres }: FilterBarPops) {
    const handleChange = (patch: Partial<FilterState>) => {
        onChange({ ...value, ...patch })
    }

    const toggleStatus = (status: string) => {
        const exists = value.status.includes(status)
        const nextStatus = exists
            ? value.status.filter((s) => s !== status)
            : [...value.status, status]

        handleChange({ status: nextStatus })
    }
    return (
        <section className={styles.wrapper}>
            {/* キーワード検索 */}
            <div className={styles.field}>
                <label className={styles.label}>キーワード</label>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="SKU/タイトルで絞り込み"
                    value={value.keyword}
                    onChange={(e) => handleChange({ keyword: e.target.value })}
                />
            </div>
            {/* ジャンル */}
            <div className={styles.field}>
                <label className={styles.label}>ジャンル</label>
                <select
                    className={styles.select}
                    value={value.genre}
                    onChange={(e) => handleChange({ genre: e.target.value })}
                >
                    <option value="">すべて</option>
                    {genres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>
            {/* 状態 */}
            <div className={styles.filed}>
                <label className={styles.label}>状態</label>
                <div className={styles.statusGroup}>
                    {["販売中", "売約中", "保留"].map((s) => (
                        <label key={s} className={styles.checkboxLabel}>
                            <input
                                type="text"
                                checked={value.status.includes(s)}
                                onChange={() => toggleStatus(s)}
                            />
                            <span>{s}</span>
                        </label>
                    ))}
                </div>
            </div>
            {/* 条件クリア */}
            <div className="styles fieldRight">
                <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() =>
                        onChange({
                            keyword: "",
                            genre: "",
                            status: [],
                        })
                    }
                >
                    条件クリア
                </button>
            </div>
        </section>
    )
}
