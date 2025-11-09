/**
 * @swagger
 * tags:
 *   name: Seminars
 *   description: Quản lý hội thảo, gửi thư mời và điều khiển hiển thị
 */

/**
 * @swagger
 * /api/seminars/{id}/toggle-hidden:
 *   patch:
 *     summary: Ẩn hoặc hiện hội thảo (admin)
 *     tags: [Seminars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của hội thảo cần ẩn/hiện
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái hiển thị thành công
 *       404:
 *         description: Không tìm thấy hội thảo
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars:
 *   post:
 *     summary: Tạo mới một hội thảo
 *     tags: [Seminars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Hội thảo công nghệ AI 2025"
 *               description:
 *                 type: string
 *                 example: "Giới thiệu các xu hướng AI trong lĩnh vực phần mềm"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-15T08:00:00Z"
 *               location:
 *                 type: string
 *                 example: "Trung tâm công nghệ ABC"
 *               speaker:
 *                 type: string
 *                 example: "TS. Nguyễn Văn An"
 *     responses:
 *       201:
 *         description: Tạo hội thảo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars:
 *   get:
 *     summary: Lấy danh sách tất cả hội thảo
 *     tags: [Seminars]
 *     responses:
 *       200:
 *         description: Danh sách hội thảo
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết hội thảo theo ID
 *     tags: [Seminars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của hội thảo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của hội thảo
 *       404:
 *         description: Không tìm thấy hội thảo
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars/{id}:
 *   put:
 *     summary: Cập nhật thông tin hội thảo
 *     tags: [Seminars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của hội thảo cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Hội thảo cập nhật xu hướng AI"
 *               description:
 *                 type: string
 *                 example: "Cập nhật xu hướng mới trong trí tuệ nhân tạo"
 *               location:
 *                 type: string
 *                 example: "Phòng họp B, Trung tâm công nghệ"
 *               speaker:
 *                 type: string
 *                 example: "PGS. Trần Minh Đức"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy hội thảo
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars/{id}:
 *   delete:
 *     summary: Xóa hội thảo theo ID
 *     tags: [Seminars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của hội thảo cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa hội thảo thành công
 *       404:
 *         description: Không tìm thấy hội thảo
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars/{id}/invite:
 *   post:
 *     summary: Gửi email mời tham dự hội thảo
 *     tags: [Seminars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của hội thảo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emails
 *             properties:
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1@example.com", "user2@example.com"]
 *     responses:
 *       200:
 *         description: Gửi email mời thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars/{id}/speaker:
 *   post:
 *     summary: Gửi email mời cho diễn giả
 *     tags: [Seminars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của hội thảo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               speakerEmail:
 *                 type: string
 *                 example: "speaker@example.com"
 *     responses:
 *       200:
 *         description: Gửi email cho diễn giả thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars/count/all:
 *   get:
 *     summary: Đếm tổng số hội thảo
 *     tags: [Seminars]
 *     responses:
 *       200:
 *         description: Trả về số lượng hội thảo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 12
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars/latest/all:
 *   get:
 *     summary: Lấy danh sách hội thảo mới nhất
 *     tags: [Seminars]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Giới hạn số lượng hội thảo hiển thị
 *     responses:
 *       200:
 *         description: Danh sách hội thảo mới nhất
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Seminar:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         speaker:
 *           type: string
 *         hidden:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "6730b7a6e90f15c7c4b9d112"
 *         title: "Hội thảo Công nghệ Mới 2025"
 *         description: "Giới thiệu về các xu hướng công nghệ AI và IoT"
 *         date: "2025-11-20T09:00:00Z"
 *         location: "Hội trường Trung tâm Công nghệ XYZ"
 *         speaker: "TS. Lê Minh Tâm"
 *         hidden: false
 *         createdAt: "2025-10-25T08:30:00Z"
 *         updatedAt: "2025-10-30T10:45:00Z"
 */

const express = require("express");
const router = express.Router();
const {
  createSeminar,
  getSeminars,
  getSeminarById,
  updateSeminar,
  deleteSeminar,
  sendInviteEmails,
  sendSpeakerEmail,
  countSeminars,
  getLatestSeminars,
  toggleHiddenSeminar,
} = require("../controllers/seminarController");

// Route mới: ẩn/hiện seminar
router.patch("/:id/toggle-hidden", toggleHiddenSeminar);

// CRUD
router.post("/", createSeminar);
router.get("/", getSeminars);
router.get("/:id", getSeminarById);
router.put("/:id", updateSeminar);
router.delete("/:id", deleteSeminar);

// gửi mail mời tham dự
router.post("/:id/invite", sendInviteEmails);

// gửi mail cho diễn giả
router.post("/:id/speaker", sendSpeakerEmail);

// API mới
router.get("/count/all", countSeminars); // GET /api/seminars/count
router.get("/latest/all", getLatestSeminars); // GET /api/seminars/latest?limit=5

module.exports = router;
//console.log("✅ seminarRoutes loaded");
