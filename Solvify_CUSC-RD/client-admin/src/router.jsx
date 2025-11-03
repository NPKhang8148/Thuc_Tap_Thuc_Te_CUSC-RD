// src/router.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';

function AppRouter() {
  return (
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/register" element={<AdminRegister />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
  );
}

export default AppRouter;
