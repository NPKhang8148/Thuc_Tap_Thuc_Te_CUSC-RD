const Seminar = require("../models/Seminar");
const nodemailer = require("nodemailer");

// Tạo mới seminar
exports.createSeminar = async (req, res) => {
  try {
    const seminar = new Seminar(req.body);
    await seminar.save();
    res.status(201).json(seminar);
  } catch (err) {
    console.error("❌ Lỗi tạo seminar:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Lấy danh sách seminar
exports.getSeminars = async (req, res) => {
  try {
    const includeHidden = req.query.includeHidden === "true";

    const filter = includeHidden ? {} : { hidden: false };

    const seminars = await Seminar.find(filter).select(
      "title date startTime endTime location speakers inviteEmails hidden createdAt"
    );

    res.json(seminars);
  } catch (err) {
    console.error("❌ Lỗi getSeminars:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết seminar
exports.getSeminarById = async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id);
    if (!seminar)
      return res.status(404).json({ error: "Không tìm thấy seminar" });
    res.json(seminar);
  } catch (err) {
    console.error("❌ Lỗi getSeminarById:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật seminar
exports.updateSeminar = async (req, res) => {
  try {
    const seminar = await Seminar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!seminar)
      return res.status(404).json({ error: "Không tìm thấy seminar" });
    res.json(seminar);
  } catch (err) {
    console.error("❌ Lỗi updateSeminar:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Xóa seminar
exports.deleteSeminar = async (req, res) => {
  try {
    const seminar = await Seminar.findByIdAndDelete(req.params.id);
    if (!seminar)
      return res.status(404).json({ error: "Không tìm thấy seminar" });
    res.json({ message: "Đã xóa seminar" });
  } catch (err) {
    console.error("❌ Lỗi deleteSeminar:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Gửi mail mời tham dự (cho người tham gia)
exports.sendInviteEmails = async (req, res) => {
  const { emails } = req.body;
  const seminar = await Seminar.findById(req.params.id);
  if (!seminar)
    return res.status(404).json({ error: "Không tìm thấy seminar" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: emails,
    subject: `📢 Mời tham dự chuyên đề: ${seminar.title}`,
    text: `Xin chào,

Bạn được mời tham dự chuyên đề: "${seminar.title}"

⏰ Thời gian: ${new Date(seminar.date).toLocaleDateString()}
Từ ${seminar.startTime} đến ${seminar.endTime}
🏛️ Địa điểm: ${seminar.location}

Nội dung:
${
  seminar.content
    ?.filter((c) => c.type === "text")
    .map((c) => "- " + c.value)
    .join("\n") || "Chưa có mô tả chi tiết"
}

Trân trọng,
Ban tổ chức.
`,
  };

  try {
    await transporter.sendMail(mailOptions);

    const emailList = Array.isArray(emails) ? emails : [emails];
    seminar.inviteEmails = [...(seminar.inviteEmails || []), ...emailList];
    await seminar.save();

    res.json({
      message: "✅ Đã gửi mail mời tham dự",
      inviteEmails: seminar.inviteEmails,
    });
  } catch (err) {
    console.error("❌ Lỗi sendInviteEmails:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Gửi mail cho diễn giả (nếu sau này cần bật lại)
exports.sendSpeakerEmail = async (req, res) => {
  const seminar = await Seminar.findById(req.params.id);
  if (!seminar)
    return res.status(404).json({ error: "Không tìm thấy seminar" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    for (const speaker of seminar.speakers) {
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: speaker.email,
        subject: `🎤 Thư mời diễn giả: ${seminar.title}`,
        text: `Kính gửi ${speaker.name}${
          speaker.code ? ` (Mã số: ${speaker.code})` : ""
        },

Chúng tôi trân trọng mời bạn tham gia báo cáo tại chuyên đề "${seminar.title}"
vào ngày ${new Date(seminar.date).toLocaleDateString()}
từ ${seminar.startTime} đến ${seminar.endTime}
tại ${seminar.location}.

Trân trọng!`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: "✅ Đã gửi thư mời cho tất cả diễn giả" });
  } catch (err) {
    console.error("❌ Lỗi sendSpeakerEmail:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Đếm số lượng seminar trong DB
exports.countSeminars = async (req, res) => {
  try {
    const count = await Seminar.countDocuments();
    res.json({ totalSeminars: count });
  } catch (err) {
    console.error("❌ Lỗi countSeminars:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Lấy các seminar mới nhất
exports.getLatestSeminars = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const latest = await Seminar.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("title date location createdAt");
    res.json(latest);
  } catch (err) {
    console.error("❌ Lỗi getLatestSeminars:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Toggle hidden (ẩn/hiện seminar)
exports.toggleHiddenSeminar = async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id);
    if (!seminar)
      return res.status(404).json({ error: "Không tìm thấy seminar" });

    seminar.hidden = !seminar.hidden;
    await seminar.save();

    res.json({
      message: `✅ Seminar đã được ${seminar.hidden ? "ẩn" : "hiện"}`,
      hidden: seminar.hidden,
    });
  } catch (err) {
    console.error("❌ Lỗi toggleHiddenSeminar:", err.message);
    res.status(500).json({ error: err.message });
  }
};
