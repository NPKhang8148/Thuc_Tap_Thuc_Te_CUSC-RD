// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");

// Multer config (upload avatar vào RAM)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Đăng ký với upload ảnh đại diện
router.post("/register", upload.single("avatar"), register);

// Đăng nhập
router.post("/login", login);

// Lấy thông tin profile
router.get("/profile", getProfile);

module.exports = router;
