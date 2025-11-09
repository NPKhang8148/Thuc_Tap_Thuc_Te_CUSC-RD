/**
 * @swagger
 * tags:
 *   name: Tools
 *   description: Quản lý công cụ và trạng thái hiển thị của chúng
 */

/**
 * @swagger
 * /api/tools:
 *   get:
 *     summary: Lấy danh sách tất cả công cụ
 *     tags: [Tools]
 *     responses:
 *       200:
 *         description: Danh sách công cụ được lấy thành công
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/tools/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một công cụ
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của công cụ cần xem
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết công cụ
 *       404:
 *         description: Không tìm thấy công cụ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/tools:
 *   post:
 *     summary: Tạo mới một công cụ
 *     tags: [Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Figma"
 *               description:
 *                 type: string
 *                 example: "Công cụ thiết kế giao diện UI/UX"
 *               link:
 *                 type: string
 *                 example: "https://www.figma.com"
 *               category:
 *                 type: string
 *                 example: "Thiết kế"
 *     responses:
 *       201:
 *         description: Tạo công cụ thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/tools/{id}:
 *   put:
 *     summary: Cập nhật thông tin công cụ
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của công cụ cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Figma Pro"
 *               description:
 *                 type: string
 *                 example: "Phiên bản nâng cấp của Figma với nhiều tính năng"
 *               link:
 *                 type: string
 *                 example: "https://www.figma.com/pro"
 *               category:
 *                 type: string
 *                 example: "Thiết kế"
 *     responses:
 *       200:
 *         description: Cập nhật công cụ thành công
 *       404:
 *         description: Không tìm thấy công cụ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/tools/{id}:
 *   delete:
 *     summary: Xóa một công cụ
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của công cụ cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa công cụ thành công
 *       404:
 *         description: Không tìm thấy công cụ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/tools/{id}/toggle:
 *   put:
 *     summary: Ẩn hoặc hiển thị công cụ
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của công cụ cần thay đổi trạng thái hiển thị
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái hiển thị thành công
 *       404:
 *         description: Không tìm thấy công cụ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tool:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         link:
 *           type: string
 *         category:
 *           type: string
 *         visible:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "6730c2b9e90f15c7c4b9d220"
 *         name: "Postman"
 *         description: "Công cụ test API hiệu quả cho lập trình viên backend"
 *         link: "https://www.postman.com"
 *         category: "Phát triển"
 *         visible: true
 *         createdAt: "2025-10-25T08:30:00Z"
 *         updatedAt: "2025-10-30T10:45:00Z"
 */

const express = require("express");
const router = express.Router();
const toolController = require("../controllers/toolController");

router.get("/", toolController.getTools);
router.get("/:id", toolController.getToolById);
router.post("/", toolController.createTool);
router.put("/:id", toolController.updateTool);
router.delete("/:id", toolController.deleteTool);

// Route ẩn/hiện tool
router.put("/:id/toggle", toolController.toggleVisibility);

module.exports = router;
