import React from "react";
import AppRouter from "./router";
import NavbarWrapper from "./components/NavbarWrapper";
import Footer from "./components/Footer";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="app-container">
      <NavbarWrapper />

      <div className="main-content">
        <AppRouter />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      <Footer />
    </div>
  );
};

export default App;
