/**
 * @swagger
 * tags:
 *   name: Softwares
 *   description: API quản lý các phần mềm của trung tâm công nghệ
 */

/**
 * @swagger
 * /api/software/add:
 *   post:
 *     summary: Thêm mới một phần mềm
 *     tags: [Softwares]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phần mềm quản lý học tập LMS"
 *               description:
 *                 type: string
 *                 example: "Hệ thống hỗ trợ học tập trực tuyến"
 *               version:
 *                 type: string
 *                 example: "v2.1.0"
 *               category:
 *                 type: string
 *                 example: "Giáo dục"
 *               developer:
 *                 type: string
 *                 example: "Trung tâm Công nghệ XYZ"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Thêm phần mềm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/software:
 *   get:
 *     summary: Lấy danh sách tất cả phần mềm
 *     tags: [Softwares]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số lượng phần mềm mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách phần mềm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "670bb6e8912ed7e41f9d0c514"
 *                   name:
 *                     type: string
 *                     example: "Phần mềm kế toán 2025"
 *                   category:
 *                     type: string
 *                     example: "Tài chính"
 *                   version:
 *                     type: string
 *                     example: "1.2.3"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/software/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một phần mềm
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phần mềm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết phần mềm
 *       404:
 *         description: Không tìm thấy phần mềm
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/software/{id}:
 *   put:
 *     summary: Cập nhật thông tin phần mềm
 *     tags: [Softwares]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phần mềm cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phần mềm kế toán Pro"
 *               description:
 *                 type: string
 *                 example: "Phiên bản nâng cấp với nhiều tính năng hơn"
 *               version:
 *                 type: string
 *                 example: "v3.0.0"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật phần mềm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy phần mềm
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/software/{id}:
 *   delete:
 *     summary: Xóa phần mềm theo ID
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phần mềm cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa phần mềm thành công
 *       404:
 *         description: Không tìm thấy phần mềm
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/software/count:
 *   get:
 *     summary: Đếm tổng số phần mềm
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: Tổng số phần mềm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 45
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/software/latest:
 *   get:
 *     summary: Lấy danh sách phần mềm mới nhất
 *     tags: [Softwares]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Số lượng phần mềm mới nhất cần lấy
 *     responses:
 *       200:
 *         description: Danh sách phần mềm mới nhất
 *       500:
 *         description: Lỗi server
 */


const express = require("express");
const multer = require("multer");
const {
  addSoftware,
  getAllSoftware,
  updateSoftware,
  deleteSoftware,
  getSoftwareById,
  getSoftwareCount,
  getLatestSoftwares,
} = require("../controllers/softwareController");

const router = express.Router();

// Lưu tạm file vào thư mục uploads
const upload = multer({ dest: "uploads/" });

router.post(
  "/add",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "file", maxCount: 1 },
  ]),
  addSoftware
);

router.get("/", getAllSoftware);
router.get("/:id", getSoftwareById);
router.put(
  "/:id",
  upload.fields([{ name: "images" }, { name: "file" }]),
  updateSoftware
);
router.delete("/:id", deleteSoftware);
// Đếm tổng số phần mềm
router.get("/count", getSoftwareCount);

// Lấy danh sách phần mềm mới nhất
router.get("/latest", getLatestSoftwares);

module.exports = router;
