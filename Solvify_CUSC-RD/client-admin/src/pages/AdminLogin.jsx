// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/admins/login", {
        email,
        password,
      });

      const { token, admin } = res.data;
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminInfo", JSON.stringify(admin));

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Lỗi đăng nhập");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        // backgroundImage: `url("https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1920&q=80")`, // ảnh nền
        backgroundImage: 'url("/bg2.jpg")', // ảnh nền
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 400,
          bgcolor: "rgba(255, 255, 255, 0.3)", // trắng mờ
          backdropFilter: "blur(10px)", // hiệu ứng mờ nền
          borderRadius: 3,
          boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Đăng nhập Admin
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          color="primary"
          sx={{
            mt: 2,
            mb: 2,
            fontWeight: "bold",
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#115293" },
          }}
          onClick={handleLogin}
        >
          ĐĂNG NHẬP
        </Button>

        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Button component={Link} to="/register" color="secondary">
            Đăng ký tài khoản Admin
          </Button>

          <Button component={Link} to="/dashboard" color="success">
            Vào trang Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminLogin;
