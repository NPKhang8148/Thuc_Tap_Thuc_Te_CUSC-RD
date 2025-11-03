/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: API quản lý yêu cầu từ người dùng và quản trị viên
 */

/**
 * @swagger
 * /api/requests/user:
 *   post:
 *     summary: Người dùng gửi yêu cầu mới
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
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
 *                 example: "Yêu cầu hỗ trợ kỹ thuật"
 *               description:
 *                 type: string
 *                 example: "Tôi gặp lỗi khi đăng sản phẩm"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "high"
 *     responses:
 *       201:
 *         description: Gửi yêu cầu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/my:
 *   get:
 *     summary: Người dùng xem danh sách yêu cầu của chính mình
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách yêu cầu của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "66bfae12a9d21a14e17b3b90"
 *                   title:
 *                     type: string
 *                     example: "Cần hỗ trợ cập nhật đơn hàng"
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   priority:
 *                     type: string
 *                     example: "high"
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/count:
 *   get:
 *     summary: Admin xem tổng số yêu cầu
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Tổng số yêu cầu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRequests:
 *                   type: integer
 *                   example: 124
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/urgent:
 *   get:
 *     summary: Admin lấy danh sách các yêu cầu khẩn cấp
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách yêu cầu khẩn cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "66bfae12a9d21a14e17b3b90"
 *                   title:
 *                     type: string
 *                     example: "Sự cố thanh toán"
 *                   priority:
 *                     type: string
 *                     example: "high"
 *       401:
 *         description: Không có quyền truy cập
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
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tất cả yêu cầu
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Admin xem chi tiết yêu cầu theo ID
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của yêu cầu
 *     responses:
 *       200:
 *         description: Thông tin chi tiết yêu cầu
 *       404:
 *         description: Không tìm thấy yêu cầu
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Admin tạo yêu cầu mới
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
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
 *                 example: "Tạo yêu cầu kiểm tra hệ thống"
 *               description:
 *                 type: string
 *                 example: "Yêu cầu kiểm tra server định kỳ"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "medium"
 *     responses:
 *       201:
 *         description: Tạo yêu cầu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/{id}:
 *   put:
 *     summary: Admin cập nhật yêu cầu theo ID
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
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
 *               status:
 *                 type: string
 *                 example: "resolved"
 *               priority:
 *                 type: string
 *                 example: "low"
 *               note:
 *                 type: string
 *                 example: "Đã xử lý xong yêu cầu"
 *     responses:
 *       200:
 *         description: Cập nhật yêu cầu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy yêu cầu
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requests/{id}:
 *   delete:
 *     summary: Admin xóa yêu cầu theo ID
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
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
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
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
} = require("../controllers/requestController");

const verifyToken = require("../middlewares/verifyToken"); // middleware cho user
const verifyAdminToken = require("../middlewares/verifyAdminToken"); // middleware cho admin

const router = express.Router();

// --- User ---
router.post("/user", verifyToken, createRequestByUser); // User gửi yêu cầu
router.get("/my", verifyToken, getMyRequests); // User xem yêu cầu của mình

// --- Admin ---
router.get("/count", verifyAdminToken, getRequestCount); // Đếm tổng số yêu cầu
router.get("/urgent", verifyAdminToken, getUrgentRequests); // Lấy yêu cầu khẩn cấp

router.get("/", verifyAdminToken, getRequests); // Admin xem tất cả yêu cầu
router.get("/:id", verifyAdminToken, getRequestById); // Admin xem chi tiết 1 yêu cầu
router.post("/", verifyAdminToken, createRequest); // Admin tạo yêu cầu (nếu cần)
router.put("/:id", verifyAdminToken, updateRequest); // Admin cập nhật yêu cầu
router.delete("/:id", verifyAdminToken, deleteRequest); // Admin xóa yêu cầu

module.exports = router;
