/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Quản lý yêu cầu khách hàng (dành cho người dùng và admin)
 */

/**
 * @swagger
 * /api/requests/user:
 *   post:
 *     summary: Người dùng gửi yêu cầu mới
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Yêu cầu thêm chức năng báo cáo
 *               description:
 *                 type: string
 *                 example: Tôi muốn có thêm tính năng xuất báo cáo PDF trong phần mềm.
 *               priority:
 *                 type: string
 *                 enum: [Thấp, Trung bình, Cao, Khẩn cấp]
 *                 example: Cao
 *     responses:
 *       201:
 *         description: Gửi yêu cầu thành công
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/my:
 *   get:
 *     summary: Người dùng xem danh sách yêu cầu của mình
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách yêu cầu của người dùng hiện tại
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/{id}/toggle-hidden:
 *   patch:
 *     summary: Ẩn hoặc hiện yêu cầu (chỉ admin)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của yêu cầu cần ẩn/hiện
 *     responses:
 *       200:
 *         description: Thay đổi trạng thái ẩn/hiện thành công
 *       404:
 *         description: Không tìm thấy yêu cầu
 *       401:
 *         description: Không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/count:
 *   get:
 *     summary: Lấy tổng số lượng yêu cầu (admin)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về tổng số yêu cầu
 *       401:
 *         description: Không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/urgent:
 *   get:
 *     summary: Lấy danh sách các yêu cầu khẩn cấp (admin)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách các yêu cầu khẩn cấp
 *       401:
 *         description: Không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Admin xem tất cả yêu cầu
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tất cả yêu cầu
 *       401:
 *         description: Không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Admin xem chi tiết 1 yêu cầu theo ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của yêu cầu
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của yêu cầu
 *       404:
 *         description: Không tìm thấy yêu cầu
 *       401:
 *         description: Không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Admin tạo yêu cầu mới (tùy chọn)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Yêu cầu cập nhật hệ thống
 *               description:
 *                 type: string
 *                 example: Cần cập nhật bảo mật cho các phần mềm khách hàng.
 *               priority:
 *                 type: string
 *                 enum: [Thấp, Trung bình, Cao, Khẩn cấp]
 *                 example: Trung bình
 *     responses:
 *       201:
 *         description: Tạo yêu cầu thành công
 *       401:
 *         description: Không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/{id}:
 *   put:
 *     summary: Cập nhật yêu cầu (admin)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của yêu cầu cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cập nhật tính năng mới
 *               description:
 *                 type: string
 *                 example: Cập nhật giao diện người dùng và tối ưu hiệu năng.
 *               priority:
 *                 type: string
 *                 enum: [Thấp, Trung bình, Cao, Khẩn cấp]
 *                 example: Cao
 *     responses:
 *       200:
 *         description: Cập nhật yêu cầu thành công
 *       404:
 *         description: Không tìm thấy yêu cầu
 *       401:
 *         description: Không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/{id}:
 *   delete:
 *     summary: Xóa yêu cầu (admin)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của yêu cầu cần xóa
 *     responses:
 *       200:
 *         description: Xóa yêu cầu thành công
 *       404:
 *         description: Không tìm thấy yêu cầu
 *       401:
 *         description: Không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [Thấp, Trung bình, Cao, Khẩn cấp]
 *         user:
 *           type: string
 *           description: ID của người gửi yêu cầu
 *         hidden:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "672b1a2f8c7d9e12f95b4a67"
 *         title: "Yêu cầu hỗ trợ khẩn cấp"
 *         description: "Phần mềm bị lỗi khi xuất báo cáo PDF"
 *         priority: "Khẩn cấp"
 *         user: "671a9e5b32d6ab45c123f6d8"
 *         hidden: false
 *         createdAt: "2025-11-07T08:45:00Z"
 *         updatedAt: "2025-11-07T10:30:00Z"
 */

const express = require("express");
const {
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
} = require("../controllers/requestController");

const verifyToken = require("../middlewares/verifyToken"); // middleware cho user
const verifyAdminToken = require("../middlewares/verifyAdminToken"); // middleware cho admin

const router = express.Router();

// --- User ---
router.post("/user", verifyToken, createRequestByUser); // User gửi yêu cầu
router.get("/my", verifyToken, getMyRequests); // User xem yêu cầu của mình

// Thêm route ẩn/hiện
router.patch("/:id/toggle-hidden", verifyAdminToken, toggleHidden);

// --- Admin ---
router.get("/count", verifyAdminToken, getRequestCount); // Đếm tổng số yêu cầu
router.get("/urgent", verifyAdminToken, getUrgentRequests); // Lấy yêu cầu khẩn cấp

router.get("/", verifyAdminToken, getRequests); // Admin xem tất cả yêu cầu
router.get("/:id", verifyAdminToken, getRequestById); // Admin xem chi tiết 1 yêu cầu
router.post("/", verifyAdminToken, createRequest); // Admin tạo yêu cầu (nếu cần)
router.put("/:id", verifyAdminToken, updateRequest); // Admin cập nhật yêu cầu
router.delete("/:id", verifyAdminToken, deleteRequest); // Admin xóa yêu cầu

module.exports = router;
