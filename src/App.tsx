import './App.css'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from './const/const'
import Inventory from './pages/Inventory/Inventory'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import Header from './components/header/Header'
import { useState } from 'react'

function AppInner() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  // 在庫ページ以外で押されたら在庫ページに飛ぶ
  const handleClickAddProduct = () => {
    if (location.pathname !== ROUTES.INVENTORY) {
      navigate(ROUTES.INVENTORY)
    }
    setIsAddOpen(true)
  }

  return (
    <>
      <Header onClickAddProduct={handleClickAddProduct} />

      <Routes>
        <Route path={ROUTES.INVENTORY} element={<Inventory isAddOpen={isAddOpen} onCloseAdd={() => setIsAddOpen(false)} />} />
        <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Routes>
    </>
  )
}
export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}

