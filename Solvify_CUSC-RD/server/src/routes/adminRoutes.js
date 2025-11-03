/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API quản lý tài khoản quản trị viên (Admin)
 */

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Đăng ký tài khoản admin mới
 *     tags: [Admin]
 *     description: Tạo mới một tài khoản admin với thông tin cá nhân và ảnh đại diện tùy chọn.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: admin123
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện (tùy chọn)
 *     responses:
 *       201:
 *         description: Tạo admin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo admin thành công
 *                 admin:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 671bcb4e2d5aaf1234567890
 *                     fullName:
 *                       type: string
 *                       example: Nguyễn Văn A
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     avatar:
 *                       type: string
 *                       example: uploads/1730471012345-avatar.png
 *       400:
 *         description: Email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email đã tồn tại
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi server
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Đăng nhập tài khoản admin
 *     tags: [Admin]
 *     description: Xác thực tài khoản admin và trả về JWT token nếu đăng nhập thành công.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thành công
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 admin:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 671bcb4e2d5aaf1234567890
 *                     fullName:
 *                       type: string
 *                       example: Nguyễn Văn A
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     avatar:
 *                       type: string
 *                       example: uploads/1730471012345-avatar.png
 *       401:
 *         description: Sai mật khẩu hoặc tài khoản không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sai mật khẩu
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi server
 */


// routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Admin = require('../models/Admin');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Đăng ký Admin
router.post('/register', upload.single('avatar'), async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const avatar = req.file ? req.file.filename : null;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      fullName,
      email,
      password: hashedPassword,
      avatar,
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Tạo admin thành công', admin: newAdmin });
  } catch (error) {
    console.error('❌ Lỗi tạo admin:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Đăng nhập Admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Sai mật khẩu' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ message: 'Đăng nhập thành công', token, admin });
  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
