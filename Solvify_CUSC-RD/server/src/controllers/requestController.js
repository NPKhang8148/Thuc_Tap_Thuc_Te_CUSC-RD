const Request = require("../models/Request");

// Lấy toàn bộ yêu cầu (Admin)
const getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("userId", "fullName email") // lấy tên user gửi
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy yêu cầu theo ID
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "userId",
      "fullName email"
    );
    if (!request)
      return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo yêu cầu mới (Admin)
const createRequest = async (req, res) => {
  try {
    const newRequest = new Request({
      ...req.body,
      createdBy: "admin",
    });
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Lỗi khi tạo request:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật yêu cầu (Admin)
const updateRequest = async (req, res) => {
  try {
    const updated = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa yêu cầu
const deleteRequest = async (req, res) => {
  try {
    const deleted = await Request.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User gửi yêu cầu
const createRequestByUser = async (req, res) => {
  try {
    const newRequest = new Request({
      ...req.body,
      userId: req.user._id,
      createdBy: "user",
    });
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// User xem yêu cầu đã gửi
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đếm tổng số yêu cầu
const getRequestCount = async (req, res) => {
  try {
    const count = await Request.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy yêu cầu khẩn cấp (ưu tiên)-cần xử lý gấp (gần deadline), giới hạn theo ?limit=5
const getUrgentRequests = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    // Chỉ lấy yêu cầu chưa hoàn thành hoặc bị hủy, sắp theo deadline gần nhất
    const urgentRequests = await Request.find({
      status: { $in: ["pending", "in-progress"] },
      deadline: { $ne: null },
    })
      .sort({ deadline: 1 }) // gần deadline nhất lên đầu
      .limit(limit)
      .populate("userId", "fullName email");

    res.json(urgentRequests);
  } catch (err) {
    console.error("❌ Lỗi khi lấy yêu cầu cấp bách:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Toggle hidden (ẩn/hiện)
const toggleHidden = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    }

    request.hidden = !request.hidden;
    await request.save();

    res.json({ message: "Cập nhật trạng thái thành công", hidden: request.hidden });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  createRequestByUser,
  getMyRequests,
  getRequestCount,
  getUrgentRequests,
  toggleHidden,
};
