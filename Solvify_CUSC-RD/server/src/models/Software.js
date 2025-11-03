const mongoose = require("mongoose");

const softwareSchema = new mongoose.Schema({
  title: { type: String, required: true }, // tiêu đề
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  content: { type: String }, // nội dung mô tả (từ Word hoặc nhập tay)
  images: [String], // ảnh base64
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Software", softwareSchema);
