const Tool = require("../models/Tool");

// Lấy danh sách tools
exports.getTools = async (req, res) => {
  try {
    const tools = await Tool.find();
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tools", error });
  }
};

// Lấy chi tiết 1 tool
exports.getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: "Tool not found" });
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tool", error });
  }
};

// Thêm tool
exports.createTool = async (req, res) => {
  try {
    const { name, description, url } = req.body;
    const newTool = new Tool({ name, description, url });
    await newTool.save();
    res.status(201).json(newTool);
  } catch (error) {
    res.status(400).json({ message: "Error creating tool", error });
  }
};

// Sửa tool (Không cho frontend tự ý thay đổi hidden)
exports.updateTool = async (req, res) => {
  try {
    const { hidden, ...safeBody } = req.body; // chặn hidden từ client

    const updatedTool = await Tool.findByIdAndUpdate(
      req.params.id,
      safeBody,
      { new: true }
    );

    if (!updatedTool)
      return res.status(404).json({ message: "Tool not found" });

    res.json(updatedTool);
  } catch (error) {
    res.status(400).json({ message: "Error updating tool", error });
  }
};

// Xóa tool
exports.deleteTool = async (req, res) => {
  try {
    const deletedTool = await Tool.findByIdAndDelete(req.params.id);
    if (!deletedTool)
      return res.status(404).json({ message: "Tool not found" });
    res.json({ message: "Tool deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tool", error });
  }
};

// Toggle ẩn / hiện tool
exports.toggleVisibility = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: "Tool not found" });

    tool.hidden = !tool.hidden;
    await tool.save();

    res.json({
      message: tool.hidden ? "Tool is now hidden" : "Tool is now visible",
      tool
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling visibility", error });
  }
};
