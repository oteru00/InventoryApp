type Props = {
    styles: Record<string, string>
    label: string
    genres: string[]
    newGenre: string
    selectedGenre: string
    newPlaceholder: string
    selectPlaceholder: string
    onChangeNewGenre: (v: string) => void
    onChangeSelectedGenre: (v: string) => void
}

export default function GenreField({
    styles,
    label,
    genres,
    newGenre,
    selectedGenre,
    newPlaceholder,
    selectPlaceholder,
    onChangeNewGenre,
    onChangeSelectedGenre,
}: Props) {
    const disabledSelect = newGenre.trim().length > 0

    return (
        <div className={styles.fieldFull}>
            <label className={styles.label}>{label}</label>

            <input
                className={styles.input}
                type="text"
                value={newGenre}
                placeholder={newPlaceholder}
                onChange={(e) => onChangeNewGenre(e.target.value)}
            />

            <select
                className={styles.select}
                value={selectedGenre}
                onChange={(e) => onChangeSelectedGenre(e.target.value)}
                disabled={disabledSelect}
            >
                <option value="">{selectPlaceholder}</option>
                {genres.map((g) => (
                    <option key={g} value={g}>
                        {g}
                    </option>
                ))}
            </select>
        </div>
    )
}
