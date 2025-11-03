const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Đăng ký user
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      avatar: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : undefined,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Đăng nhập user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa" });
    }

    res.json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Khóa hoặc mở khóa tài khoản user
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: user.isBlocked ? "Đã khóa user" : "Đã mở khóa user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "User không tồn tại" });
    res.json({ message: "Xóa user thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đếm tổng số user
exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
