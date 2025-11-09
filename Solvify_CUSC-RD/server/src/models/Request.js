const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // tên yêu cầu
    content: { type: String, required: true }, // nội dung
    customer: { type: String, required: true }, // tên khách hàng/công ty
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user gửi yêu cầu
    createdBy: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    }, // ai đã tạo yêu cầu
    assignedTo: { type: String, default: "Chưa phân công" }, // nhân viên/phòng ban phụ trách
    deadline: { type: Date },
    startDate: { type: Date }, // ngày bắt đầu xử lý
    endDate: { type: Date }, // ngày hoàn thành
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "canceled"],
      default: "pending",
    },
    // Thêm mới
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
