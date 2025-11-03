// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // dùng để nhận buffer từ file gửi lên
const uploadToCloudinary = require("../middlewares/upload");

router.post("/image", upload.single("image"), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: "Lỗi upload ảnh", error: err.message });
  }
});

module.exports = router;
