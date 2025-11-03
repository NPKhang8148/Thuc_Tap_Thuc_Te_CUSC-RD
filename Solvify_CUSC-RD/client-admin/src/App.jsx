// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Trang chủ chuyển hướng về dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard chỉ vào được khi đã đăng nhập */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Đăng nhập / Đăng ký */}
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/register" element={<AdminRegister />} />

      {/* 404 fallback */}
      <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
    </Routes>
  );
}

export default App;
