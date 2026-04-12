import styles from "../Inventory.module.css"
import type { InventoryItem } from "../types"

export default function MarketIcons({
    marketplaces,
}: {
    marketplaces?: InventoryItem["marketplaces"]
}) {
    const m = marketplaces ?? {}
    const entries = [
        { key: "mercari", className: styles.marketMercari },
        { key: "yahoo", className: styles.marketYahoo },
        { key: "rakuma", className: styles.marketRakuma },
        { key: "instagram", className: styles.marketInstagram },
    ] as const

    return (
        <div className={styles.marketDots} aria-label="出品先">
            {entries.map(({ key, className }) => (
                <span key={key} className={`${styles.marketDot} ${m[key] ? className : ""}`} />
            ))}
        </div>
    )
}
