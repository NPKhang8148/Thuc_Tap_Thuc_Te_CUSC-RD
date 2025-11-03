/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API quản lý danh mục sản phẩm
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
 *                 example: "Thực phẩm bổ sung"
 *               description:
 *                 type: string
 *                 example: "Các sản phẩm hỗ trợ dinh dưỡng thể hình"
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "66c70d92a7f5f5e4bcd128ab"
 *                   name:
 *                     type: string
 *                     example: "Whey Protein"
 *                   description:
 *                     type: string
 *                     example: "Sản phẩm bổ sung protein chất lượng cao"
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy thông tin danh mục theo ID
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
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "66c70d92a7f5f5e4bcd128ab"
 *                 name:
 *                   type: string
 *                   example: "Dụng cụ tập luyện"
 *                 description:
 *                   type: string
 *                   example: "Các thiết bị hỗ trợ luyện tập thể hình"
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
 *         description: ID của danh mục cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phụ kiện gym"
 *               description:
 *                 type: string
 *                 example: "Các loại dây kháng lực, găng tay, đai lưng..."
 *     responses:
 *       200:
 *         description: Cập nhật danh mục thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */


const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  getCategoryById,
} = require('../controllers/categoryController');

// Tạo danh mục
router.post('/', createCategory);

// Lấy tất cả danh mục
router.get('/', getAllCategories);

// Lấy danh mục theo ID
router.get('/:id', getCategoryById);

// Cập nhật danh mục
router.put('/:id', updateCategory);

module.exports = router;
