import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-gray-100 border-b shadow-sm px-6 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left Links */}
        <div className="flex gap-6 items-center font-medium text-gray-800">
          <Link to="/" className="hover:text-blue-600">Trang Chủ</Link>

          {/* Danh mục có submenu */}
          <div className="relative">
            <button onClick={() => setOpenMenu(!openMenu)} className="hover:text-blue-600">
             Danh mục sản phẩm
            </button>
            {openMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white border shadow-lg rounded-md z-50 w-56">
                <Link to="/products/whey" className="block px-4 py-2 hover:bg-gray-100">Whey Protein</Link>
                <Link to="/products/maytap" className="block px-4 py-2 hover:bg-gray-100">Máy tập</Link>
                <Link to="/products/phukien" className="block px-4 py-2 hover:bg-gray-100">Phụ kiện</Link>
                <Link to="/products/vitamin" className="block px-4 py-2 hover:bg-gray-100">Vitamin</Link>
              </div>
            )}
          </div>

          <Link to="/cart" className="hover:text-blue-600">Giỏ hàng</Link>
          <Link to="/blog" className="hover:text-blue-600">Kiến thức</Link>
          <Link to="/about" className="hover:text-blue-600">Giới thiệu</Link>
        </div>

        {/* Right Links */}
        <div className="flex gap-4 items-center text-sm">
          {user ? (
            <>
              <span className="text-gray-700"> Xin chào, <strong>{user.name}</strong></span>
              <button onClick={handleLogout} className="text-red-600 hover:underline">🚪 Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-800 hover:text-blue-600">🔐 Đăng nhập</Link>
              <Link to="/register" className="text-gray-800 hover:text-blue-600">📝 Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
