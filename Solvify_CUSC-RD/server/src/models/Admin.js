const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: String,
});

module.exports = mongoose.model('Admin', adminSchema);