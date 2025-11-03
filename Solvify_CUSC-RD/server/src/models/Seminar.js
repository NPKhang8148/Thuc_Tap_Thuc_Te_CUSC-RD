const mongoose = require("mongoose");

// Schema cho diễn giả
const speakerSchema = new mongoose.Schema({
  code: { type: String }, // Mã số diễn giả (không bắt buộc)
  name: { type: String, required: true }, // Tên diễn giả
  email: { type: String, required: true }, // Email diễn giả
});

// Schema cho nội dung chuyên đề (văn bản, ảnh, video)
const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "image", "video"],
    default: "text",
  },
  value: { type: String, required: true }, // Có thể là nội dung văn bản, link ảnh hoặc link video
});

// Schema chính cho Seminar
const seminarSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Tiêu đề chuyên đề
  date: { type: Date, required: true }, // Ngày tổ chức
  startTime: { type: String, required: true }, // Giờ bắt đầu (hh:mm)
  endTime: { type: String, required: true }, // Giờ kết thúc (hh:mm)
  location: { type: String, required: true }, // Địa điểm tổ chức
  speakers: [speakerSchema], // Danh sách diễn giả (tên, mã, email)
  content: [contentSchema], // Nội dung chuyên đề (text / image / video)
  inviteEmails: [{ type: String }], // Danh sách email được mời
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Seminar", seminarSchema);
