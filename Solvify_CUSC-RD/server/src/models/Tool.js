const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true }, // Đường dẫn tool
  hidden: { type: Boolean, default: false },   // Thêm trường ẩn/hiện
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tool", toolSchema);
