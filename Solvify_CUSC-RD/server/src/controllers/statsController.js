const User = require("../models/User");
const Request = require("../models/Request");
const Software = require("../models/Software");
const Seminar = require("../models/Seminar");

// ======================
//  API: /api/stats
// ======================
const getDashboardStats = async (req, res) => {
  try {
    // --- Nhận tham số lọc từ query ---
    const { type, year, quarter, month, date } = req.query;
    let period = req.query.value || req.query.period; // có thể là "Q1-2025", "2025-10", hoặc "2025-10-29"

    let startDate, endDate;

    // --- Xử lý tự động theo định dạng period ---
    if (period) {
      period = period.trim();

      // Định dạng quý: Qx-yyyy
      const quarterMatch = period.match(/^Q([1-4])-(\d{4})$/);
      if (quarterMatch) {
        const q = parseInt(quarterMatch[1]);
        const y = parseInt(quarterMatch[2]);
        const startMonth = (q - 1) * 3;
        startDate = new Date(y, startMonth, 1);
        endDate = new Date(y, startMonth + 3, 0, 23, 59, 59);
      }

      // Định dạng tháng: yyyy-mm
      const monthMatch = period.match(/^(\d{4})-(\d{1,2})$/);
      if (monthMatch) {
        const y = parseInt(monthMatch[1]);
        const m = parseInt(monthMatch[2]) - 1;
        startDate = new Date(y, m, 1);
        endDate = new Date(y, m + 1, 0, 23, 59, 59);
      }

      // Định dạng ngày: yyyy-mm-dd
      const dayMatch = period.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (dayMatch) {
        const y = parseInt(dayMatch[1]);
        const m = parseInt(dayMatch[2]) - 1;
        const d = parseInt(dayMatch[3]);
        startDate = new Date(y, m, d, 0, 0, 0);
        endDate = new Date(y, m, d, 23, 59, 59);
      }
    }

    // --- Giữ lại logic cũ ---
    if (!period) {
      if (type === "month" && month && year) {
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59);
      } else if (type === "quarter" && quarter && year) {
        const qStartMonth = (quarter - 1) * 3;
        startDate = new Date(year, qStartMonth, 1);
        endDate = new Date(year, qStartMonth + 3, 0, 23, 59, 59);
      } else if (type === "year" && year) {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59);
      }
    }

    // --- Tạo filter thời gian cho MongoDB ---
    const dateFilter =
      startDate && endDate
        ? { createdAt: { $gte: startDate, $lte: endDate } }
        : {};

    // --- Đếm tổng (hoặc theo thời gian lọc) ---
    const [userCount, reqCount, softCount, semCount] = await Promise.all([
      User.countDocuments(dateFilter),
      Request.countDocuments(dateFilter),
      Software.countDocuments(dateFilter),
      Seminar.countDocuments(dateFilter),
    ]);

    // --- Dữ liệu mới nhất (chỉ cần top 5) ---
    const [latestSoftwares, latestSeminars, urgentRequests] = await Promise.all(
      [
        Software.find(dateFilter)
          .sort({ createdAt: -1 })
          .limit(5)
          .select("title createdAt"),
        Seminar.find(dateFilter)
          .sort({ createdAt: -1 })
          .limit(5)
          .select("title date location createdAt"),
        Request.find({ ...dateFilter, priority: "urgent" })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("title priority createdAt")
          .populate("userId", "fullName email"),
      ]
    );

    // --- Kết quả trả về ---
    res.json({
      filter: { type, year, quarter, month, period },
      total: {
        users: userCount,
        requests: reqCount,
        softwares: softCount,
        seminars: semCount,
      },
      latestSoftwares,
      latestSeminars,
      urgentRequests,
      timeRange: {
        from: startDate,
        to: endDate,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi getDashboardStats:", error);
    res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

module.exports = { getDashboardStats };
