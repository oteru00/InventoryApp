import './App.css'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from './const/const'
import Inventory from './pages/Inventory/Inventory'
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import Header from './components/header/Header'
import { useState } from 'react'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ProtectedRoute from './auth/ProtectedRoute'
import { useAuth } from './auth/useAuth'
import { AuthProvider } from './auth/AuthContext'
import { Navigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "./firebase"

function AppInner() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleClickAddProduct = () => {
    if (location.pathname !== ROUTES.INVENTORY) {
      navigate(ROUTES.INVENTORY)
    }
    setIsAddOpen(true)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate(ROUTES.LOGIN)
    } catch (e) {
      console.error(e)
      alert("ログアウトに失敗しました")
    }
  }

  return (
    <>
      {user && (
        <Header
          onClickAddProduct={handleClickAddProduct}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />

        <Route
          path={ROUTES.INVENTORY}
          element={
            <ProtectedRoute>
              <Inventory
                isAddOpen={isAddOpen}
                onCloseAdd={() => setIsAddOpen(false)}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ANALYTICS}
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  )
}