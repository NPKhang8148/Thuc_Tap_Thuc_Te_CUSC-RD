const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("decoded JWT:", decoded); // debug

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    //  Gắn cả user object và id để tiện dùng phía controller
    req.user = {
      _id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (err) {
    console.error("Lỗi xác thực token:", err.message);
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user?.role !== "user") {
    return res.status(403).json({
      message: "Chỉ user mới có quyền thực hiện hành động này",
    });
  }
  next();
};

module.exports = { authenticate, isAdmin, isUser };
