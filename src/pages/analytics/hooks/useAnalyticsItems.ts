// Firestore取得
import { useEffect, useState } from "react"
import { collection, onSnapshot, query, Timestamp, where } from "firebase/firestore"
import { db } from "../../../firebase"
import { useAuth } from "../../../auth/useAuth"

export type AnalyticsItem = {
    id: string
    title: string
    genre: string
    status: "販売中" | "売約済" | "保留"
    price: number
    startDate?: string
    soldDate?: string
    createdAt: Timestamp | string
}

export function useAnalyticsItems() {
    const [items, setItems] = useState<AnalyticsItem[]>([])
    const { user, loading } = useAuth()

    useEffect(() => {
        if (loading) return

        if (!user) {
            setItems([])
            return
        }

        const q = query(
            collection(db, "inventoryItems"),
            where("userId", "==", user.uid)
        )

        const unsubscribe = onSnapshot(q, (snap) => {
            const result: AnalyticsItem[] = snap.docs.map((docSnap) => {
                const data = docSnap.data() as any

                return {
                    id: docSnap.id,
                    title: data.title ?? "",
                    genre: data.genre ?? "",
                    status: data.status ?? "販売中",
                    price: typeof data.price === "number" ? data.price : 0,
                    startDate: data.startDate,
                    soldDate: data.soldDate,
                    createdAt: data.createdAt,
                }
            })

            setItems(result)
        })

        return () => unsubscribe()
    }, [user, loading])

    return { items, loading }
}