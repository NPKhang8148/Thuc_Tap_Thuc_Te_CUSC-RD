const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true }, // đường dẫn tool
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tool", toolSchema);

