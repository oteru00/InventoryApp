import type { Marketplaces } from "../types"

type Props = {
    styles: Record<string, string>
    label: string
    marketplaces: Marketplaces
    itemLabels: Record<keyof Marketplaces, string>
    onToggle: (key: keyof Marketplaces) => void
}

export default function MarketplaceCheckboxGroup({ styles, label, marketplaces, itemLabels, onToggle }: Props) {
    const keys: (keyof Marketplaces)[] = ["mercari", "yahoo", "rakuma", "instagram"]

    return (
        <div className={styles.fieldFull}>
            <label className={styles.label}>{label}</label>

            <div className={styles.marketGroup}>
                {keys.map((key) => (
                    <label key={key} className={styles.checkboxLabel}>
                        <input type="checkbox" checked={!!marketplaces[key]} onChange={() => onToggle(key)} />
                        <span>{itemLabels[key]}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}
