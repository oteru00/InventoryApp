// FilterBar.tsx
import styles from "./FilterBar.module.css"
import { TEXTS } from "../../../../const/texts"

import type { FilterState, Marketplace, Status } from "./types"
import {
    MARKET_OPTIONS,
    STATUS_OPTIONS,
    HAS_IMAGE_OPTIONS,
    DISCOUNTED_OPTIONS,
} from "./constants"

import FilterSelect from "./components/FilterSelect"
import FilterCheckboxGroup from "./components/FilterCheckboxGroup"
import PriceRangeInput from "./components/PriceRangeInput"
import FilterActions from "./components/FilterActions"

type Props = {
    value: FilterState
    onChange: (next: FilterState) => void
    genres: string[]
}

export default function FilterBar({ value, onChange, genres }: Props) {
    const toggle = <T extends string>(arr: T[], v: T) =>
        arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

    const handleClear = () => {
        onChange({
            keyword: "",
            genre: "",
            status: [],
            marketplaces: [],
            priceMin: "",
            priceMax: "",
            hasImage: "all",
            discounted: "all",
        })
    }

    const genreOptions = [
        { value: "", label: TEXTS.FILTER_ALL },
        ...genres.map((g) => ({ value: g, label: g })),
    ]

    return (
        <section className={styles.wrapper}>
            {/* 上段 */}
            <div className={styles.row}>
                <FilterSelect
                    label={TEXTS.LABEL_GENRE}
                    value={value.genre}
                    onChange={(genre) => onChange({ ...value, genre })}
                    options={genreOptions}
                />

                <FilterCheckboxGroup<Status>
                    label={TEXTS.FILTER_STATUS_LABEL}
                    values={value.status}
                    onToggle={(s) => onChange({ ...value, status: toggle(value.status, s) })}
                    options={STATUS_OPTIONS}
                />

                <FilterCheckboxGroup<Marketplace>
                    label={TEXTS.LABEL_MARKETPLACE}
                    values={value.marketplaces}
                    onToggle={(p) =>
                        onChange({ ...value, marketplaces: toggle(value.marketplaces, p) })
                    }
                    options={MARKET_OPTIONS}
                />

                <PriceRangeInput
                    label={TEXTS.LABEL_PRICE}
                    minValue={value.priceMin}
                    maxValue={value.priceMax}
                    onMinChange={(priceMin) => onChange({ ...value, priceMin })}
                    onMaxChange={(priceMax) => onChange({ ...value, priceMax })}
                />
            </div>

            {/* 下段 */}
            <div className={styles.rowBottom}>
                <FilterSelect
                    label={TEXTS.LABEL_IMAGE}
                    value={value.hasImage}
                    onChange={(hasImage) => onChange({ ...value, hasImage })}
                    options={HAS_IMAGE_OPTIONS as any}
                />

                <FilterSelect
                    label={TEXTS.FILTER_DISCOUNT_LABEL}
                    value={value.discounted}
                    onChange={(discounted) => onChange({ ...value, discounted })}
                    options={DISCOUNTED_OPTIONS as any}
                />

                <FilterActions onClear={handleClear} />
            </div>
        </section>
    )
}
