/**
 * @swagger
 * tags:
 *   name: Tools
 *   description: API quản lý công cụ
 */

/**
 * @swagger
 * /tools:
 *   get:
 *     summary: Lấy danh sách tất cả công cụ
 *     tags: [Tools]
 *     responses:
 *       200:
 *         description: Danh sách công cụ
 *   post:
 *     summary: Tạo mới một công cụ
 *     tags: [Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tool'
 *     responses:
 *       201:
 *         description: Tạo công cụ thành công
 */

/**
 * @swagger
 * /tools/{id}:
 *   get:
 *     summary: Lấy chi tiết công cụ theo ID
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin công cụ
 *       404:
 *         description: Không tìm thấy
 *   put:
 *     summary: Cập nhật công cụ theo ID
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tool'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 *   delete:
 *     summary: Xóa công cụ theo ID
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy
 */

const express = require("express");
const router = express.Router();
const toolController = require("../controllers/toolController");

router.get("/", toolController.getTools);
router.get("/:id", toolController.getToolById);
router.post("/", toolController.createTool);
router.put("/:id", toolController.updateTool);
router.delete("/:id", toolController.deleteTool);

module.exports = router;
