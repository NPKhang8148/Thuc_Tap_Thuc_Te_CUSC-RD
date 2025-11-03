const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // thêm createdAt, updatedAt tự động
);

module.exports = mongoose.model("Category", categorySchema);
