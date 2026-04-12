import styles from "../Inventory.module.css"
import type { ItemStatus } from "../types"


export default function StatusBadge({ status }: { status: ItemStatus }) {
    const className = status === "売約済" ? styles.statusSold : styles.statusOnSale
    return <span className={`${styles.statusBadge} ${className}`}>{status}</span>
}
