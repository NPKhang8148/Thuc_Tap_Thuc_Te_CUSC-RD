// src/pages/AdminRegister.jsx
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    role: 'admin'
  });

  const [previewAvatar, setPreviewAvatar] = useState(null); // dùng để hiển thị ảnh
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, avatar: file });
      setPreviewAvatar(URL.createObjectURL(file)); // tạo URL tạm để xem trước ảnh
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', form.fullName);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('role', form.role);
    if (form.avatar) {
      formData.append('avatar', form.avatar);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/admins/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Đăng ký admin thành công!');
      console.log('📥 Phản hồi:', res.data);
      // Điều hướng sau đăng ký thành công
      navigate('/login');
    } catch (err) {
      console.error('❌ Lỗi đăng ký:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Đăng ký thất bại!');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Đăng ký Admin
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
          <TextField
            label="Họ và tên"
            name="fullName"
            fullWidth
            margin="normal"
            required
            value={form.fullName}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            required
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Mật khẩu"
            name="password"
            fullWidth
            margin="normal"
            required
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            fullWidth
            margin="normal"
            required
            type={showConfirmPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Avatar Upload */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button variant="outlined" component="label">
              Tải ảnh Avatar
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </Button>
            {form.avatar && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Đã chọn: {form.avatar.name}
              </Typography>
            )}
            {previewAvatar && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Avatar
                  src={previewAvatar}
                  alt="Avatar Preview"
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
            )}
          </Box>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
            Đăng ký
          </Button>

          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Button component={Link} to="/login" color="primary">
              Đã có tài khoản? Đăng nhập
            </Button>
            <Button component={Link} to="/dashboard" color="success">
              Tới trang Admin Dashboard
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminRegister;