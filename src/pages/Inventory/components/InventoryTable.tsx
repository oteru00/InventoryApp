import styles from "../Inventory.module.css"
import { TEXTS } from "../../../const/texts"
import type { InventoryItem } from "../types"
import { isDiscountedToday } from "../utils/inventory"
import StatusBadge from "./StatusBadge"
import MarketIcons from "./MarketIcons"

type Props = {
    items: InventoryItem[]
    todayYmd: string
    onEdit: (item: InventoryItem) => void
    onDelete: (item: InventoryItem) => void
}

export default function InventoryTable({ items, todayYmd, onEdit, onDelete }: Props) {
    return (
        <section className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <th className={styles.th}>{TEXTS.TABLE_IMAGE}</th>
                        <th className={styles.th}>{TEXTS.TABLE_SKU_STATUS}</th>
                        <th className={styles.th}>{TEXTS.TABLE_TITLE}</th>
                        <th className={styles.th}>{TEXTS.TABLE_GENRE}</th>
                        <th className={styles.th}>{TEXTS.TABLE_MARKETPLACES}</th>
                        <th className={styles.th}>{TEXTS.TABLE_PRICE}</th>
                        <th className={styles.th}>{TEXTS.TABLE_DISCOUNT_TODAY}</th>
                        <th className={styles.th}>{TEXTS.TABLE_EDIT}</th>
                        <th className={styles.th}>{TEXTS.TABLE_DELETE}</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) => {
                        const discountedToday = isDiscountedToday(item, todayYmd)
                        const isSold = item.status === "売約済"

                        return (
                            <tr key={item.id} className={styles.row}>
                                <td className={styles.td}>
                                    <div className={styles.imageBox}>
                                        {item.image ? <img src={item.image} alt={item.title} /> : "No Image"}
                                    </div>
                                </td>

                                <td className={styles.td}>
                                    <div className={styles.skuText}>{item.sku}</div>
                                    <div className={styles.statusWrapper}>
                                        <StatusBadge status={item.status} />
                                    </div>
                                </td>

                                <td className={styles.tdTitle}>{item.title}</td>
                                <td className={styles.td}>{item.genre}</td>

                                <td className={styles.td}>
                                    <MarketIcons marketplaces={item.marketplaces} />
                                </td>

                                <td className={styles.tdPrice}>¥{item.price.toLocaleString()}</td>

                                <td className={styles.td}>
                                    <span
                                        className={`${styles.discountBadge} ${discountedToday ? styles.discountDone : styles.discountNone
                                            }`}
                                    >
                                        {discountedToday ? "本日実施" : "未実施"}
                                    </span>
                                </td>

                                <td className={styles.tdEdit}>
                                    <button
                                        type="button"
                                        className={styles.editButton}
                                        onClick={() => onEdit(item)}
                                    >
                                        {TEXTS.TABLE_EDIT_BUTTON}
                                    </button>
                                </td>

                                <td className={styles.tdEdit}>
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => onDelete(item)}
                                        disabled={isSold}
                                        title={isSold ? "売約済は削除できません" : "削除"}
                                    >
                                        削除
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {items.length === 0 && <p className={styles.emptyMessage}>{TEXTS.NO_DATA}</p>}
        </section>
    )
}
