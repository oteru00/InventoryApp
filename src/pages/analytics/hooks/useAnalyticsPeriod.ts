// 年月の状態管理
import { useEffect, useMemo, useState } from "react"
import type { AnalyticsItem } from "./useAnalyticsItems"

export function useAnalyticsPeriod(soldItems: AnalyticsItem[]) {
    const yearOptions = useMemo(() => {
        const years = new Set<number>()

        soldItems.forEach((item) => {
            if (!item.soldDate) return
            years.add(new Date(item.soldDate).getFullYear())
        })

        const arr = Array.from(years).sort((a, b) => a - b)
        return arr.length > 0 ? arr : [new Date().getFullYear()]
    }, [soldItems])

    const [year, setYear] = useState<number | null>(null)
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1)

    useEffect(() => {
        if (year === null && yearOptions.length > 0) {
            setYear(yearOptions[yearOptions.length - 1])
        }
    }, [year, yearOptions])

    const monthOptions = useMemo(
        () => Array.from({ length: 12 }, (_, i) => i + 1),
        []
    )

    return {
        year,
        setYear,
        month,
        setMonth,
        yearOptions,
        monthOptions,
    }
}