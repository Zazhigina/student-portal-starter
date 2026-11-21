import { Routes, Route } from 'react-router-dom'
import { Theme, presetGpnDefault } from '@consta/uikit/Theme'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'

// Маршруты ниже — минимальный каркас. Добавляйте страницы своего проекта по карте экранов из блюпринта.
function App() {
  return (
    <Theme preset={presetGpnDefault}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Theme>
  )
}

export default App
