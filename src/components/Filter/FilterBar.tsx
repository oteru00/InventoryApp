// src/components/Filter/FilterBar.tsx
import styles from "./FilterBar.module.css";

type Status = "販売中" | "売約済" | "保留";
type Marketplace = "mercari" | "yahoo" | "rakuma" | "instagram";

export type FilterState = {
    keyword: string;
    genre: string;
    status: Status[];
    marketplaces: Marketplace[];
    priceMin: string;
    priceMax: string;
    hasImage: "all" | "yes" | "no";
    discounted: "all" | "yes" | "no";
};

type Props = {
    value: FilterState;
    onChange: (next: FilterState) => void;
    genres: string[];
};

export default function FilterBar({ value, onChange, genres }: Props) {
    const handleStatusToggle = (s: Status) => {
        const exists = value.status.includes(s);
        const next = exists
            ? value.status.filter((x) => x !== s)
            : [...value.status, s];
        onChange({ ...value, status: next });
    };

    const handleMarketplaceToggle = (p: Marketplace) => {
        const exists = value.marketplaces.includes(p);
        const next = exists
            ? value.marketplaces.filter((x) => x !== p)
            : [...value.marketplaces, p];
        onChange({ ...value, marketplaces: next });
    };

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
        });
    };

    return (
        <section className={styles.wrapper}>
            {/* 上段：ジャンル／状態／出品先／価格 */}
            <div className={styles.row}>
                {/* ジャンル */}
                <div className={styles.group}>
                    <label className={styles.label}>ジャンル</label>
                    <select
                        className={styles.select}
                        value={value.genre}
                        onChange={(e) =>
                            onChange({ ...value, genre: e.target.value })
                        }
                    >
                        <option value="">すべて</option>
                        {genres.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 状態 */}
                <div className={styles.group}>
                    <label className={styles.label}>状態</label>
                    <div className={styles.checkboxRow}>
                        {(["販売中", "売約済", "保留"] as Status[]).map((s) => (
                            <label key={s} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={value.status.includes(s)}
                                    onChange={() => handleStatusToggle(s)}
                                />
                                <span>{s}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 出品先 */}
                <div className={styles.group}>
                    <label className={styles.label}>出品先</label>
                    <div className={styles.checkboxRow}>
                        {(
                            ["mercari", "yahoo", "rakuma", "instagram"] as Marketplace[]
                        ).map((p) => (
                            <label key={p} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={value.marketplaces.includes(p)}
                                    onChange={() => handleMarketplaceToggle(p)}
                                />
                                <span>{p}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 価格 */}
                <div className={styles.group}>
                    <label className={styles.label}>価格</label>
                    <div className={styles.priceRow}>
                        <input
                            className={styles.input}
                            placeholder="最小"
                            value={value.priceMin}
                            onChange={(e) =>
                                onChange({
                                    ...value,
                                    priceMin: e.target.value.replace(/[^0-9]/g, ""),
                                })
                            }
                        />
                        <span className={styles.tilde}>~</span>
                        <input
                            className={styles.input}
                            placeholder="最大"
                            value={value.priceMax}
                            onChange={(e) =>
                                onChange({
                                    ...value,
                                    priceMax: e.target.value.replace(/[^0-9]/g, ""),
                                })
                            }
                        />
                    </div>
                </div>
            </div>

            {/* 下段：画像／値下げ ＋ クリアボタン */}
            <div className={styles.rowBottom}>
                <div className={styles.group}>
                    <label className={styles.label}>画像</label>
                    <select
                        className={styles.select}
                        value={value.hasImage}
                        onChange={(e) =>
                            onChange({
                                ...value,
                                hasImage: e.target.value as FilterState["hasImage"],
                            })
                        }
                    >
                        <option value="all">すべて</option>
                        <option value="yes">あり</option>
                        <option value="no">なし</option>
                    </select>
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>値下げ</label>
                    <select
                        className={styles.select}
                        value={value.discounted}
                        onChange={(e) =>
                            onChange({
                                ...value,
                                discounted: e.target.value as FilterState["discounted"],
                            })
                        }
                    >
                        <option value="all">すべて</option>
                        <option value="yes">値下げ済み</option>
                        <option value="no">未実施</option>
                    </select>
                </div>

                <div className={styles.clearWrapper}>
                    <button className={styles.clearButton} onClick={handleClear}>
                        条件クリア
                    </button>
                </div>
            </div>
        </section>
    );
}
