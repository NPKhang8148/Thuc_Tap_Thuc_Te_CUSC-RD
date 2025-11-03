import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("/bg1.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(10px)",
            color: "#222",
          }}
        >
          <Typography variant="h5" align="center" fontWeight="bold" mb={3}>
            ĐĂNG NHẬP
          </Typography>

          <Box component="form" onSubmit={handleLogin} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Mật khẩu"
                variant="outlined"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 99 }}
                  >
                    Đăng nhập
                  </Button>
                </Grid>
                <Grid item>
                  <Link
                    to="#"
                    style={{ color: "#26c4dc", textDecoration: "underline" }}
                  >
                    Quên mật khẩu?
                  </Link>
                </Grid>
              </Grid>
            </Stack>
          </Box>

          <Box mt={5} textAlign="center">
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Đăng ký
            </Typography>
            <Typography variant="body2" mb={2}>
              Tạo tài khoản để theo dõi các chuyên đề, yêu cầu khách hàng dễ
              dàng hơn.
            </Typography>
            <Stack spacing={2}>
              <Button
                fullWidth
                component={Link}
                to="/register"
                variant="outlined"
                sx={{ borderColor: "#222", color: "#222", borderRadius: 99 }}
              >
                Tạo tài khoản
              </Button>
              <Button
                fullWidth
                component={Link}
                to="/"
                variant="text"
                sx={{ color: "#222", borderRadius: 99 }}
              >
                Quay về trang chủ
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
