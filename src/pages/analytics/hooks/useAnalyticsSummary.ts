// 集計ロジック
import { useMemo } from "react"
import type { ChartRow } from "../components/GenreSalesChart"
import type { MonthlyRow } from "../components/MonthlyDetailTable"
import type { AnalyticsItem } from "./useAnalyticsItems"

export function useAnalyticsSummary(
    items: AnalyticsItem[],
    year: number | null,
    month: number
) {
    const soldItems = useMemo(
        () => items.filter((item) => item.status === "売約済" && !!item.soldDate),
        [items]
    )

    const genres = useMemo(() => {
        const set = new Set<string>()
        items.forEach((item) => {
            if (item.genre) set.add(item.genre)
        })
        return Array.from(set)
    }, [items])

    const itemsInPeriod = useMemo(() => {
        if (year === null) return []
        const targetMonth = month - 1

        return items.filter((item) => {
            if (!item.startDate) return false
            const d = new Date(item.startDate)
            return d.getFullYear() === year && d.getMonth() === targetMonth
        })
    }, [items, year, month])

    const soldInPeriod = useMemo(() => {
        if (year === null) return []

        return soldItems.filter((item) => {
            if (!item.soldDate) return false
            const d = new Date(item.soldDate)
            return d.getFullYear() === year && d.getMonth() + 1 === month
        })
    }, [soldItems, year, month])

    const chartData: ChartRow[] = useMemo(
        () =>
            genres.map((genre) => {
                const total = itemsInPeriod.filter((item) => item.genre === genre).length
                const sold = soldInPeriod.filter((item) => item.genre === genre).length
                return { genre, total, sold }
            }),
        [genres, itemsInPeriod, soldInPeriod]
    )

    const monthlyRows: MonthlyRow[] = useMemo(() => {
        if (year === null) return []

        const base: MonthlyRow[] = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            counts: {},
        }))

        soldItems.forEach((item) => {
            if (!item.soldDate) return

            const d = new Date(item.soldDate)
            if (d.getFullYear() !== year) return

            const monthIndex = d.getMonth()
            const genre = item.genre
            const row = base[monthIndex]

            row.counts[genre] = (row.counts[genre] || 0) + 1
        })

        return base
    }, [soldItems, year])

    return {
        soldItems,
        genres,
        itemsInPeriod,
        soldInPeriod,
        chartData,
        monthlyRows,
    }
}