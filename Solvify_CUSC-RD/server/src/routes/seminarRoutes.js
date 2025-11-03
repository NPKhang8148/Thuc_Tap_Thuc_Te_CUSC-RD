/**
 * @swagger
 * tags:
 *   name: Seminars
 *   description: API quản lý các sự kiện, hội thảo và gửi email mời tham dự
 */

/**
 * @swagger
 * /api/seminars:
 *   post:
 *     summary: Tạo hội thảo mới
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
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Hội thảo chuyển đổi số 2025"
 *               description:
 *                 type: string
 *                 example: "Giới thiệu công nghệ mới trong lĩnh vực AI và Big Data"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-20T09:00:00Z"
 *               location:
 *                 type: string
 *                 example: "Trung tâm hội nghị quốc gia"
 *               speaker:
 *                 type: string
 *                 example: "TS. Nguyễn Văn A"
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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại (mặc định 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng hội thảo mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách hội thảo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "670aa9d912ed7e41f9d0c513"
 *                   title:
 *                     type: string
 *                     example: "Hội thảo chuyển đổi số 2025"
 *                   date:
 *                     type: string
 *                     example: "2025-10-20T09:00:00Z"
 *                   location:
 *                     type: string
 *                     example: "Trung tâm hội nghị quốc gia"
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một hội thảo
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
 *         description: Thông tin chi tiết hội thảo
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
 *                 example: "Hội thảo AI mở rộng 2025"
 *               description:
 *                 type: string
 *                 example: "Cập nhật xu hướng mới về trí tuệ nhân tạo"
 *               location:
 *                 type: string
 *                 example: "TP. Hồ Chí Minh"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
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
 *         description: ID của hội thảo cần gửi thư mời
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
 *                 example: ["user1@gmail.com", "user2@gmail.com"]
 *     responses:
 *       200:
 *         description: Gửi email mời tham dự thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/seminars/{id}/speaker:
 *   post:
 *     summary: Gửi email cho diễn giả hội thảo
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
 *               - speakerEmail
 *             properties:
 *               speakerEmail:
 *                 type: string
 *                 example: "speaker@example.com"
 *               message:
 *                 type: string
 *                 example: "Kính gửi diễn giả, xin vui lòng xác nhận tham gia hội thảo."
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
 *         description: Tổng số hội thảo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 25
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
 *         description: Giới hạn số lượng hội thảo trả về
 *     responses:
 *       200:
 *         description: Danh sách hội thảo mới nhất
 *       500:
 *         description: Lỗi server
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
} = require("../controllers/seminarController");

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
