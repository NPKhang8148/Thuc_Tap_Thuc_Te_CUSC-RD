// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Box,
  Avatar,
  Typography,
  Divider,
  Grid,
  Paper,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

import BuildIcon from "@mui/icons-material/Build";
import TerminalIcon from "@mui/icons-material/Terminal";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

import UserManagement from "./UserManagement";
import SoftwareManagement from "./SoftwareManagement";
import ToolManagement from "./ToolManagement";
import SeminarManagement from "./SeminarManagement";
import CategoryManagement from "./CategoryManagement";
import RequestsPage from "./RequestsPage";
import RequestDetail from "./RequestDetail";
import DashboardStats from "./DashboardStats";

const drawerWidth = 260;

function DashboardHome() {
  const [dateTime, setDateTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Vị trí của bạn");
  const [timeZones, setTimeZones] = useState({});

  // Cập nhật thời gian theo giây
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Lấy vị trí thực tế của admin (dựa theo tọa độ trình duyệt)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            // API Open-Meteo để lấy thời tiết theo vị trí hiện tại
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const data = await res.json();
            setWeather(data.current_weather);

            // API Nominatim để lấy tên địa điểm
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const geoData = await geoRes.json();
            setCity(
              geoData.address.city ||
                geoData.address.town ||
                geoData.address.state ||
                "Khu vực của bạn"
            );
          } catch (err) {
            console.error("Lỗi khi lấy dữ liệu thời tiết:", err);
          }
        },
        (err) => {
          console.warn("Không thể lấy vị trí:", err);
          setCity("Hà Nội");
          fetchWeatherFallback(); // fallback
        }
      );
    } else {
      setCity("Hà Nội");
      fetchWeatherFallback(); // fallback
    }

    // fallback cho Hà Nội
    async function fetchWeatherFallback() {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=21.0285&longitude=105.8542&current_weather=true"
      );
      const data = await res.json();
      setWeather(data.current_weather);
    }
  }, []);

  // Thêm các múi giờ thế giới
  useEffect(() => {
    const cities = {
      "Hà Nội": "Asia/Ho_Chi_Minh",
      Tokyo: "Asia/Tokyo",
      London: "Europe/London",
      "New York": "America/New_York",
      Sydney: "Australia/Sydney",
    };

    const updateTimeZones = () => {
      const now = new Date();
      const tzTimes = {};
      for (const [city, tz] of Object.entries(cities)) {
        tzTimes[city] = now.toLocaleTimeString("vi-VN", { timeZone: tz });
      }
      setTimeZones(tzTimes);
    };

    updateTimeZones();
    const interval = setInterval(updateTimeZones, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tổng Quan Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Ngày & Giờ hiện tại */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: "center" , height: 130}}>
            <Typography variant="h6">⏰ Ngày & Giờ hiện tại</Typography>
            <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
              {dateTime.toLocaleTimeString()}
            </Typography>
            <Typography variant="body1">
              {dateTime.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Paper>
        </Grid>

        {/* Thời tiết theo vị trí thực tế */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: "center" , height: 130}}>
            <Typography variant="h6">🌦 Thời tiết tại {city}</Typography>
            {weather ? (
              <>
                <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                  {weather.temperature}°C
                </Typography>
                <Typography variant="body2">
                  Gió: {weather.windspeed} km/h
                </Typography>
                <Typography variant="body2">
                  Hướng gió: {weather.winddirection}°
                </Typography>
              </>
            ) : (
              <Typography variant="body2">Đang tải...</Typography>
            )}
          </Paper>
        </Grid>

        {/* Nhiều múi giờ thế giới */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: "center" , height: 130 }}>
            <Typography variant="h6">🌐 Múi giờ các thành phố lớn</Typography>
            {Object.entries(timeZones).map(([city, time]) => (
              <Typography key={city} variant="body2">
                <strong>{city}:</strong> {time}
              </Typography>
            ))}
          </Paper>
        </Grid>

        {/* Bản đồ Việt Nam */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">🗺️ Bản đồ Việt Nam</Typography>
            <Box
              sx={{ mt: 1, borderRadius: 2, overflow: "hidden", height: 500 }}
            >
              <iframe
                title="Vietnam Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14937.262066728195!2d105.7687553!3d10.0412216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1svi!2s!4v1761622869004!5m2!1svi!2s"
                width="1000"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </Box>
          </Paper>
        </Grid>

        {/* Bản đồ Thế giới */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">🌍 Bản đồ Thế giới</Typography>
            <Box
              sx={{ mt: 1, borderRadius: 2, overflow: "hidden", height: 500 }}
            >
              <iframe
                title="World Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26243670.277542014!2d-33.489078!3d15.1135709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zV29ybGQ!5e0!3m2!1sen!2s!4v1700000000001"
                width="1000"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("adminToken");

  const adminInfo = {
    name: "Admin",
    avatarUrl: "/avatars/avatar-anh-meo-cute-5.jpg",
  };

  const menuItems = [
    {
      text: "Trang chủ Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      text: "Quản lý người dùng",
      path: "/dashboard/users",
      icon: <PeopleIcon />,
    },
    {
      text: "Quản lý phần mềm",
      path: "/dashboard/softwares",
      icon: <TerminalIcon />,
    },
    { text: "Quản lý tool", path: "/dashboard/tools", icon: <BuildIcon /> },
    {
      text: "Quản lý chuyên đề",
      path: "/dashboard/seminars",
      icon: <EventNoteIcon />,
    },
    {
      text: "Quản lý danh mục",
      path: "/dashboard/categories",
      icon: <CategoryIcon />,
    },
    {
      text: "Quản lý yêu cầu",
      path: "/dashboard/requests",
      icon: <RequestPageIcon />,
    },
    {
      text: "Quản lý thống kê",
      path: "/dashboard/stats",
      icon: <LeaderboardIcon />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const handleLogin = () => navigate("/login");

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <Toolbar />
          <Box sx={{ textAlign: "center", my: 2 }}>
            {isLoggedIn ? (
              <>
                <Avatar
                  src={adminInfo.avatarUrl}
                  sx={{ width: 64, height: 64, mx: "auto", mb: 1 }}
                />
                <Typography variant="subtitle1">{adminInfo.name}</Typography>
              </>
            ) : (
              <Typography variant="subtitle1">Chưa đăng nhập</Typography>
            )}
          </Box>
          <Divider />
          {isLoggedIn && (
            <List>
              {menuItems.map((item, index) => (
                <ListItemButton key={index} onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>

        <Box sx={{ px: 2, mb: 2 }}>
          <Divider sx={{ mb: 1 }} />
          <ListItemButton onClick={isLoggedIn ? handleLogout : handleLogin}>
            <ListItemIcon>
              {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
            </ListItemIcon>
            <ListItemText primary={isLoggedIn ? "Đăng xuất" : "Đăng nhập"} />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Nội dung chính */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="softwares" element={<SoftwareManagement />} />
          <Route path="tools" element={<ToolManagement />} />
          <Route path="seminars" element={<SeminarManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="requests/:id" element={<RequestDetail />} />
          <Route path="stats" element={<DashboardStats />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
