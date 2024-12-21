import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Header } from "./components/Header";
import { ManageCourses } from "./pages/admin/ManageCourses";
import { CourseDetailAdmin } from "./pages/admin/CourseDetailAdmin";
import { RootRedirect } from "./components/RootRedirect";

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
        <Route
          path="/admin/courses/:courseId"
          element={
            <ProtectedRoute adminOnly>
              <CourseDetailAdmin />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<RootRedirect />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
