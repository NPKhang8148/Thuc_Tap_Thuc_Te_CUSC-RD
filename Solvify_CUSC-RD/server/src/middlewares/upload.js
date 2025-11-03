// middlewares/upload.js
const multer = require("multer");

// Cấu hình multer để lưu ảnh vào bộ nhớ
const storage = multer.memoryStorage(); // ảnh sẽ nằm trong req.file.buffer

const upload = multer({ storage });

module.exports = upload;
