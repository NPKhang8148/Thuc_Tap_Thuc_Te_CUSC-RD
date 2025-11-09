/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Quản lý danh mục phần mềm
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Categories]
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
 *                 example: Ứng dụng di động
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy tất cả danh mục
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách tất cả danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết danh mục theo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Thông tin danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Cập nhật thông tin danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ứng dụng web
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục (chỉ khi không có phần mềm trực thuộc)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần xóa
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *       400:
 *         description: Không thể xóa vì danh mục có phần mềm trực thuộc
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của danh mục
 *         name:
 *           type: string
 *           description: Tên danh mục
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Ngày tạo
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Ngày cập nhật
 *       example:
 *         _id: "671c7f9c89a4b52cf8132a11"
 *         name: "Ứng dụng di động"
 *         createdAt: "2025-11-05T08:30:00Z"
 *         updatedAt: "2025-11-06T09:15:00Z"
 */

const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  getCategoryById,
  deleteCategory,
} = require("../controllers/categoryController");

// Tạo danh mục
router.post("/", createCategory);

// Lấy tất cả danh mục
router.get("/", getAllCategories);

// Lấy danh mục theo ID
router.get("/:id", getCategoryById);

// Cập nhật danh mục
router.put("/:id", updateCategory);

// Xóa danh mục (chỉ khi không có phần mềm trực thuộc)
router.delete("/:id", deleteCategory);

module.exports = router;
