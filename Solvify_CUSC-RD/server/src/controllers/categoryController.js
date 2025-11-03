const Category = require("../models/Category");

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
