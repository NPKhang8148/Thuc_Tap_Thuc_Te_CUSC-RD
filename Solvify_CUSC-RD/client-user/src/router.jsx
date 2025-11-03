// client-user/src/router.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserHome from "./pages/UserHome";

import ToolsPage from "@/pages/ToolsPage";
import SoftwareList from "./pages/SoftwareList";
import SoftwareDetail from "./pages/SoftwareDetail";
import About from "./pages/About";
import RequestForm from "./pages/RequestForm";
import MyRequests from "./pages/MyRequests";
import SeminarList from "./pages/SeminarList";
import SeminarDetail from "./pages/SeminarDetail";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<UserHome />} />

      {/*  Thêm route mới */}
      <Route path="/softwares" element={<SoftwareList />} />
      <Route path="/softwares/:id" element={<SoftwareDetail />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/request" element={<RequestForm />} />
      <Route path="/my-request" element={<MyRequests />} />
      <Route path="/seminar" element={<SeminarList />} />
      <Route path="/seminars/:id" element={<SeminarDetail />} />
    </Routes>
  );
};

export default AppRouter;
