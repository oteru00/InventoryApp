import { Navigate } from "react-router-dom"
import { useAuth } from "./useAuth"
import { ROUTES } from "../const/const" 

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth()

    if (loading) return <div>読み込み中...</div>

    if (!user) return <Navigate to={ROUTES.LOGIN} replace />

    return <>{children}</>
}