import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Courses from './pages/Courses'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/courses" replace /> : <Login />
      } />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/courses" element={<Courses />} />
          <Route path="/" element={<Navigate to="/courses" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
