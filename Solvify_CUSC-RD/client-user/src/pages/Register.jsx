import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    avatar: "", // chỉ để preview ảnh
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setForm({ ...form, avatar: previewUrl }); // Chỉ để hiển thị preview
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);

      if (avatarFile) {
        formData.append("avatar", avatarFile); // Gửi file ảnh
      }

      await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      alert("Đăng ký thất bại!");
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("/bg2.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        py: 8,
      }}
    >
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            ĐĂNG KÝ
          </Typography>
          <Typography variant="body2" mt={1}>
            Bạn đã có tài khoản?{" "}
            <Link to="/login" style={{ color: "#1976d2" }}>
              Đăng nhập tại đây
            </Link>
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            border: "1px solid #ddd",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            THÔNG TIN CÁ NHÂN
          </Typography>

          <TextField
            label="Họ và tên"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <FormControl variant="outlined" fullWidth required>
            <InputLabel>Mật khẩu</InputLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Mật khẩu"
            />
          </FormControl>

          <FormControl variant="outlined" fullWidth required>
            <InputLabel>Nhập lại mật khẩu</InputLabel>
            <OutlinedInput
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Nhập lại mật khẩu"
            />
          </FormControl>

          <TextField
            select
            name="role"
            value={form.role}
            onChange={handleChange}
            label="Loại tài khoản"
            fullWidth
            required
          >
            <MenuItem value="user">Người dùng</MenuItem>
          </TextField>

          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={form.avatar}
              alt="avatar"
              sx={{ width: 56, height: 56 }}
            />
            <Button variant="contained" component="label">
              Tải ảnh đại diện
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleAvatarChange}
              />
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="warning"
            sx={{ fontWeight: "bold", py: 1.5 }}
          >
            Đăng ký
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
