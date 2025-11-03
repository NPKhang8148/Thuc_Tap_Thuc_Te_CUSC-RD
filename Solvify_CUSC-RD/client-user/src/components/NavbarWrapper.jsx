import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
  const location = useLocation();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "white", 
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Navbar />
    </div>
  );
};

export default NavbarWrapper;
