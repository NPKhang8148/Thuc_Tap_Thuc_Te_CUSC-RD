// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký user
const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const avatarFile = req.file;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      avatar: avatarFile
        ? {
            data: avatarFile.buffer,
            contentType: avatarFile.mimetype,
          }
        : undefined,
    });

    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // const token = jwt.sign(
    //   { id: user._id, role: user.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar?.data
          ? `data:${user.avatar.contentType};base64,${user.avatar.data.toString(
              "base64"
            )}`
          : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

// Lấy thông tin profile
const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Không có token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar?.data
        ? `data:${user.avatar.contentType};base64,${user.avatar.data.toString(
            "base64"
          )}`
        : null,
    });
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ", error: err.message });
  }
};

module.exports = { register, login, getProfile };
