import React from "react";
import { Box, Grid, Typography, IconButton, Link } from "@mui/material";
import { Facebook, YouTube, Instagram } from "@mui/icons-material";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const Footer = () => {
  const address = "Số 01 Lý Tự Trọng, phường Ninh Kiều, TP Cần Thơ";

  // Hàm mở Google Maps đúng địa chỉ
  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      address
    )}`;
    window.open(mapUrl, "_blank"); // mở trong tab mới
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#2a2d2f",
        color: "white",
        mt: "auto",
        pt: 4,
        pb: 6,
      }}
    >
      <Grid container spacing={4} justifyContent="center" px={6}>
        {/* Giới thiệu */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            GIỚI THIỆU CHUNG
          </Typography>
          <Typography variant="body2">Giới thiệu về CUSC</Typography>
          <Typography variant="body2">Quy định chung</Typography>
          <Typography variant="body2">Nội quy trung tâm</Typography>
        </Grid>

        {/* Chính sách */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            CHÍNH SÁCH CHUNG
          </Typography>
          <Typography variant="body2">Chính sách dữ liệu</Typography>
          <Typography variant="body2">Chính sách bảo mật</Typography>
          <Typography variant="body2">Chính sách kinh doanh</Typography>
          <Typography variant="body2">Chính sách bảo trì</Typography>
        </Grid>

        {/* Địa chỉ */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ĐỊA CHỈ TRUNG TÂM
          </Typography>
          <Typography variant="body2">
            <LocationOnIcon
              fontSize="small"
              sx={{ verticalAlign: "middle", mr: 0.5 }}
            />
            {address}
            {/* Nút chỉ đường */}
            <Link
              component="button"
              onClick={handleOpenMap}
              sx={{
                color: "#ffc107",
                ml: 1,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              • Chỉ đường
            </Link>
          </Typography>
        </Grid>

        {/* Liên hệ */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📞 Liên hệ tư vấn
          </Typography>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <PhoneInTalkIcon sx={{ mr: 1 }} /> (0292) 3731072
          </Typography>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <MailOutlineIcon sx={{ mr: 1 }} /> Email: cusc@ctu.edu.vn
          </Typography>

          <Typography gutterBottom>Theo dõi chúng tôi tại</Typography>
          <Box>
            <IconButton color="inherit">
              <Facebook />
            </IconButton>
            <IconButton color="inherit">
              <YouTube />
            </IconButton>
            <IconButton color="inherit">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                alt="Zalo"
                height="20"
              />
            </IconButton>
            <IconButton color="inherit">
              <Instagram />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
