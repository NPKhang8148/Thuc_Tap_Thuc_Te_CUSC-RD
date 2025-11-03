// middlewares/verifyAdminToken.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const verifyAdminToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token không được cung cấp" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Token không hợp lệ hoặc admin không tồn tại" });
    }

    req.admin = admin; // gắn thông tin admin vào req
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = verifyAdminToken;
