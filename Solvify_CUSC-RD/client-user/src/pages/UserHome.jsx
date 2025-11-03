import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import ParticleBackground from "../components/ParticleBackground";

const UserHome = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        setError("Không thể tải thông tin người dùng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 6,
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        Trang chính của người dùng
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Chào mừng bạn đến với khu vực hồ sơ cá nhân.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {userInfo && (
        <Card
          elevation={4}
          sx={{
            mt: 3,
            borderRadius: 3,
            p: 2,
            background: "linear-gradient(145deg, #f8f8f8, #ffffff)",
          }}
        >
          <CardContent>
            <Stack alignItems="center" spacing={2}>
              <Avatar
                src={userInfo.avatar}
                sx={{ width: 120, height: 120, border: "2px solid #1976d2" }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {userInfo.fullName}
              </Typography>
              <Divider flexItem sx={{ my: 2 }} />

              <Box sx={{ textAlign: "left", width: "100%", px: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <BadgeIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Vai trò:</strong> {userInfo.role}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <EmailIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Email:</strong> {userInfo.email}
                  </Typography>
                </Stack>

                {/* <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <AccountCircleIcon color="primary" />
                  <Typography variant="body1">
                    <strong>ID:</strong> {userInfo._id}
                  </Typography>
                </Stack> */}
              </Box>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => (window.location.href = "/user")}
              >
                Xem hồ sơ chi tiết
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default UserHome;
