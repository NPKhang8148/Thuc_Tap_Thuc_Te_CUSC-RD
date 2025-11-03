/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Danh sách user
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Đăng ký user mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User đã được tạo
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Đăng nhập user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */

/**
 * @swagger
 * /api/users/{id}/status:
 *   put:
 *     summary: Khóa/Mở khóa user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái user thành công
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     responses:
 *       200:
 *         description: User đã bị xóa
 */

//userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  registerUser,
  loginUser,
  getUserCount,
} = require("../controllers/userController");

const verifyAdminToken = require("../middlewares/verifyAdminToken"); // Dùng đúng middleware xác thực admin

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin-only routes
router.get("/", verifyAdminToken, getAllUsers);
router.put("/:id/status", verifyAdminToken, toggleBlockUser);
router.delete("/:id", verifyAdminToken, deleteUser);

// Route mới: Đếm số lượng user
router.get("/count", verifyAdminToken, getUserCount);

module.exports = router;
