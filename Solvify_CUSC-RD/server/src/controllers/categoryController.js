const Category = require("../models/Category");
const Software = require("../models/Software"); // cần import để kiểm tra phần mềm trực thuộc

// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Kiểm tra xem danh mục có tồn tại không
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    // Kiểm tra xem có phần mềm nào thuộc danh mục này không
    const relatedSoftwares = await Software.find({ category: categoryId });
    if (relatedSoftwares.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa danh mục vì vẫn còn phần mềm trực thuộc.",
      });
    }

    // Nếu không có phần mềm trực thuộc thì cho phép xóa
    await Category.findByIdAndDelete(categoryId);

    res.json({ message: "Xóa danh mục thành công." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};