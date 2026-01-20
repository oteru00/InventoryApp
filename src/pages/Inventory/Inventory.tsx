import AddItemDialog from "../../components/addItemDialog/AddItemDialog"
import FilterBar from "./components/Filter/FilterBar"
import styles from "./Inventory.module.css"
import { TEXTS } from "../../const/texts"

import type { InventoryProps } from "./types"
import { getLocalYmd } from "./utils/inventory"
import InventoryTable from "./components/InventoryTable"
import { useInventoryItems } from "./hooks/useInventoryItems"
import { useInventoryFilters } from "./hooks/useInventoryFilters"

export default function InventoryPage({ isAddOpen, onCloseAdd }: InventoryProps) {
  const todayYmd = getLocalYmd()

  const {
    items,
    genres,
    skuPreview,
    editingItem,
    setEditingItem,
    addItem,
    updateItem,
    deleteItem,
  } = useInventoryItems()

  const { filters, setFilters, filteredItems } = useInventoryFilters(items, todayYmd)

  return (
    <main className={styles.wrapper}>
      <h2 className={styles.title}>{TEXTS.INVENTORY_TITLE}</h2>

      {/* 絞り込み */}
      <FilterBar value={filters} onChange={(next) => setFilters(next)} genres={genres} />

      {/* テーブル */}
      <InventoryTable
        items={filteredItems}
        todayYmd={todayYmd}
        onEdit={(item) => setEditingItem(item)}
        onDelete={(item) => {
          // deleteItem 内で「売約済不可」もconfirmも全部やる
          deleteItem(item).catch((e) => {
            console.error("削除エラー:", e)
            alert("商品の削除に失敗しました")
          })
        }}
      />

      {/* 追加 */}
      <AddItemDialog
        open={isAddOpen}
        onClose={onCloseAdd}
        onAdd={(payload) => {
          addItem(payload as any).catch((e) => {
            console.error("追加エラー:", e)
            alert("商品の追加に失敗しました")
          })
        }}
        genres={genres}
        skuPreview={skuPreview}
        mode="add"
      />

      {/* 編集 */}
      <AddItemDialog
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        onAdd={(payload) => {
          if (!editingItem) return
          updateItem(editingItem.id, payload as any).catch((e) => {
            console.error("更新エラー:", e)
            alert("商品の更新に失敗しました")
          })
        }}
        genres={genres}
        skuPreview={skuPreview}
        mode="edit"
        initialItem={
          editingItem
            ? {
              title: editingItem.title,
              genre: editingItem.genre,
              price: editingItem.price,
              startDate: editingItem.startDate,
              soldDate: editingItem.soldDate,
              image: editingItem.image,
              marketplaces: editingItem.marketplaces,
            }
            : undefined
        }
      />
    </main>
  )
}
