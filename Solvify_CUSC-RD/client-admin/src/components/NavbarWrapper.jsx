import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const NavbarWrapper = () => {
  const location = useLocation();

  // Nếu không muốn Navbar hiện ở trang login/register:
  // if (location.pathname === '/login' || location.pathname === '/register') {
  //   return null;
  // }

  return <Navbar />;
};

export default NavbarWrapper;
