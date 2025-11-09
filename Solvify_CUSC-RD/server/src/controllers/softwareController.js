const Software = require("../models/Software");
const Category = require("../models/Category");
const fs = require("fs");
const mammoth = require("mammoth");

// Thêm mới Software
const addSoftware = async (req, res) => {
  try {
    let content = req.body.content || "";

    // Nếu có file Word, extract text
    if (req.files && req.files.file && req.files.file.length > 0) {
      const filePath = req.files.file[0].path;
      const result = await mammoth.extractRawText({ path: filePath });
      content = result.value.trim();
      fs.unlinkSync(filePath);
    }

    // Xử lý ảnh upload
    const images = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
      req.files.images.forEach((file) => {
        const base64Image = `data:${file.mimetype};base64,${fs
          .readFileSync(file.path)
          .toString("base64")}`;
        images.push(base64Image);
        fs.unlinkSync(file.path);
      });
    }

    //  Kiểm tra category hợp lệ
    let categoryId = null;
    if (
      req.body.category &&
      req.body.category !== "undefined" &&
      req.body.category !== ""
    ) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({ message: "Danh mục không tồn tại" });
      }
      categoryId = category._id;
    }

    //  Ép url thành string chuẩn
    let url = "";
    if (req.body.url && req.body.url !== "undefined") {
      url = String(req.body.url).trim();
    }

    const software = new Software({
      title: req.body.title,
      content,
      category: categoryId,
      url,
      images,
      hidden: req.body.hidden ?? false,
    });

    await software.save();
    res.json(software);
  } catch (err) {
    console.error("Error adding software:", err);
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật Software
const updateSoftware = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Nếu có file Word, extract text
    if (req.files && req.files.file && req.files.file.length > 0) {
      const filePath = req.files.file[0].path;
      const result = await mammoth.extractRawText({ path: filePath });
      updateData.content = result.value.trim();
      fs.unlinkSync(filePath);
    }

    // Nếu có ảnh mới
    if (req.files && req.files.images && req.files.images.length > 0) {
      updateData.images = req.files.images.map((file) => {
        const base64Image = `data:${file.mimetype};base64,${fs
          .readFileSync(file.path)
          .toString("base64")}`;
        fs.unlinkSync(file.path);
        return base64Image;
      });
    }

    //  Kiểm tra category hợp lệ
    if (
      updateData.category &&
      updateData.category !== "undefined" &&
      updateData.category !== ""
    ) {
      const category = await Category.findById(updateData.category);
      if (!category) {
        return res.status(400).json({ message: "Danh mục không tồn tại" });
      }
      updateData.category = category._id;
    } else {
      delete updateData.category;
    }

    //  Ép url về String chuẩn
    if (updateData.url && updateData.url !== "undefined") {
      updateData.url = String(updateData.url).trim();
    }

    // xử lý hidden
    if (updateData.hidden !== undefined) {
      updateData.hidden =
        updateData.hidden === "true" || updateData.hidden === true;
    }

    const software = await Software.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!software) {
      return res.status(404).json({ message: "Không tìm thấy phần mềm" });
    }
    res.json(software);
  } catch (err) {
    console.error("Error updating software:", err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả Software (có thể lọc theo category)
const getAllSoftware = async (req, res) => {
  try {
    const { categoryId, includeHidden } = req.query;

    const filter = {};

    if (categoryId) filter.category = categoryId;

    // Nếu không gửi includeHidden → mặc định không trả software.hidden = true
    if (!includeHidden || includeHidden === "false") {
      filter.hidden = false;
    }

    const list = await Software.find(filter).populate("category", "name");
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa Software
const deleteSoftware = async (req, res) => {
  try {
    await Software.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết 1 phần mềm theo id
const getSoftwareById = async (req, res) => {
  try {
    const includeHidden = req.query.includeHidden === "true";

    const software = await Software.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!software) {
      return res.status(404).json({ message: "Không tìm thấy phần mềm" });
    }

    // chặn người dùng truy cập phần mềm bị ẩn
    if (software.hidden && !includeHidden) {
      return res.status(403).json({ message: "Phần mềm đã bị ẩn" });
    }

    res.json(software);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đếm tổng số phần mềm trong cơ sở dữ liệu
const getSoftwareCount = async (req, res) => {
  try {
    const count = await Software.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách phần mềm mới nhất (giới hạn theo query limit)
const getLatestSoftwares = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const softwares = await Software.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("title createdAt");
    res.json(softwares);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addSoftware,
  getAllSoftware,
  updateSoftware,
  deleteSoftware,
  getSoftwareById,
  getSoftwareCount,
  getLatestSoftwares,
};
