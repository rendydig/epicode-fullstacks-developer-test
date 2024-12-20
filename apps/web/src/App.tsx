import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Courses from './pages/Courses'
import { CourseDetail } from './pages/CourseDetail'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Header } from './components/Header'
import { ManageCourses } from './pages/admin/ManageCourses'

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute adminOnly>
              <ManageCourses />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/courses" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
