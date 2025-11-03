// components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// import './styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/users">Người dùng</Link></li>
        <li><Link to="/products">Sản phẩm</Link></li>
        <li><Link to="/orders">Đơn hàng</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;