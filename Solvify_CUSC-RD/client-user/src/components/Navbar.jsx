import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  InputBase,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LoginIcon from "@mui/icons-material/Login";
import InfoIcon from "@mui/icons-material/Info";
import BuildIcon from "@mui/icons-material/Build";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import EventNoteIcon from "@mui/icons-material/EventNote";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { alpha } from "@mui/material/styles";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchQuery, setSearchQuery] = useState("");
  const [productAnchorEl, setProductAnchorEl] = useState(null);
  const [avatarMenuAnchorEl, setAvatarMenuAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lấy danh mục từ backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/softwares?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/softwares");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProductMenuOpen = (event) =>
    setProductAnchorEl(event.currentTarget);
  const handleProductMenuClose = () => setProductAnchorEl(null);
  const handleAvatarMenuOpen = (event) =>
    setAvatarMenuAnchorEl(event.currentTarget);
  const handleAvatarMenuClose = () => setAvatarMenuAnchorEl(null);
  const handleCategoryClick = (categoryId) => {
    handleProductMenuClose();
    navigate("/softwares", { state: { categoryId } });
  };

  const toggleDrawer = (open) => () => setMobileOpen(open);

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: 2,
        }}
      >
        {/* Logo và Menu Icon (Mobile) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/Logo-Solvify.svg"
              alt="Solvify"
              style={{ height: 60, width: "auto" }}
            />
          </Link>
        </Box>

        {/* Menu Desktop */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Box>
            <Button
              color="inherit"
              onClick={handleProductMenuOpen}
              startIcon={<StorefrontIcon />}
              endIcon={<ExpandMoreIcon />}
              sx={{
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                textTransform: "none",
                "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                  marginTop: "0 !important",
                  marginBottom: "0 !important",
                },
              }}
            >
              Danh mục phần mềm
            </Button>
            <Menu
              anchorEl={productAnchorEl}
              open={Boolean(productAnchorEl)}
              onClose={handleProductMenuClose}
              PaperProps={{
                sx: {
                  width: 250,
                  bgcolor: "#111",
                  color: "#fff",
                  mt: 1,
                  borderRadius: 2,
                  overflow: "hidden",
                },
              }}
              MenuListProps={{ sx: { py: 0 } }}
              transformOrigin={{ horizontal: "left", vertical: "top" }}
              anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            >
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <Box key={cat._id}>
                    <MenuItem
                      onClick={() => handleCategoryClick(cat._id)}
                      sx={{
                        py: 1.2,
                        px: 2,
                        "&:hover": { bgcolor: "#333" },
                      }}
                    >
                      <Typography variant="body1">
                        {cat.name || cat.title || "Không có tên"}
                      </Typography>
                    </MenuItem>
                    {index < categories.length - 1 && (
                      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                    )}
                  </Box>
                ))
              ) : (
                <MenuItem disabled>Không có danh mục</MenuItem>
              )}
            </Menu>
          </Box>

          <Button
            component={Link}
            to="/tools"
            startIcon={<BuildIcon />}
            color="inherit"
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "none",
              gap: 0.5,
              "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                marginTop: "0 !important",
                marginBottom: "0 !important",
              },
            }}
          >
            Tools
          </Button>
          <Button
            component={Link}
            to="/seminar"
            startIcon={<EventNoteIcon />}
            color="inherit"
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "none",
              gap: 0.5,
              "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                marginTop: "0 !important",
                marginBottom: "0 !important",
              },
            }}
          >
            Chuyên đề
          </Button>
          <Button
            component={Link}
            to="/request"
            startIcon={<RequestQuoteIcon />}
            color="inherit"
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "none",
              gap: 0.5,
              "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                marginTop: "0 !important",
                marginBottom: "0 !important",
              },
            }}
          >
            Yêu cầu
          </Button>
          <Button
            component={Link}
            to="/about"
            startIcon={<InfoIcon />}
            color="inherit"
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "none",
              gap: 0.5,
              "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                marginTop: "0 !important",
                marginBottom: "0 !important",
              },
            }}
          >
            Giới thiệu
          </Button>
        </Box>

        {/* Ô tìm kiếm + user */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: alpha("#000", 0.05),
              borderRadius: 1,
              px: 1,
              mr: 1,
              width: { xs: "130px", sm: "180px", md: "220px" },
            }}
          >
            <InputBase
              placeholder="Tìm phần mềm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ ml: 1, flex: 1, color: "#000" }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Box>

          {user ? (
            <>
              <IconButton onClick={handleAvatarMenuOpen} size="small">
                <img
                  src={user.avatar}
                  alt="avatar"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ccc",
                  }}
                />
              </IconButton>
              <Typography
                variant="body1"
                color="textPrimary"
                sx={{
                  whiteSpace: "nowrap",
                  display: { xs: "none", sm: "block" },
                }}
              >
                <strong>{user.fullName}</strong>
              </Typography>
              <Menu
                anchorEl={avatarMenuAnchorEl}
                open={Boolean(avatarMenuAnchorEl)}
                onClose={handleAvatarMenuClose}
              >
                <MenuItem
                  component={Link}
                  to="/user"
                  onClick={handleAvatarMenuClose}
                >
                  👤 Hồ sơ
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleAvatarMenuClose();
                    handleLogout();
                  }}
                >
                  🚪 Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                startIcon={<LoginIcon />}
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                Đăng nhập
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="primary"
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                Đăng ký
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Drawer Mobile */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 260 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} to="/softwares">
              <StorefrontIcon sx={{ mr: 1 }} />
              <ListItemText primary="Danh mục phần mềm" />
            </ListItem>
            <ListItem button component={Link} to="/tools">
              <BuildIcon sx={{ mr: 1 }} />
              <ListItemText primary="Tools" />
            </ListItem>
            <ListItem button component={Link} to="/seminar">
              <EventNoteIcon sx={{ mr: 1 }} />
              <ListItemText primary="Chuyên đề" />
            </ListItem>
            <ListItem button component={Link} to="/request">
              <RequestQuoteIcon sx={{ mr: 1 }} />
              <ListItemText primary="Yêu cầu" />
            </ListItem>
            <ListItem button component={Link} to="/about">
              <InfoIcon sx={{ mr: 1 }} />
              <ListItemText primary="Giới thiệu" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
