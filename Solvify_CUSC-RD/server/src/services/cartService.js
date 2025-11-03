// src/services/cartService.js
const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api/cart"; // cập nhật nếu khác

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (userId, productId, quantity = 1) => {
  const res = await axios.post(`${API_BASE_URL}/add`, {
    userId,
    productId,
    quantity,
  });
  return res.data;
};

// Xoá 1 sản phẩm khỏi giỏ hàng
const removeFromCart = async (userId, productId) => {
  const res = await axios.delete(`${API_BASE_URL}/remove`, {
    data: {
      userId,
      productId,
    },
  });
  return res.data;
};

// Lấy giỏ hàng của 1 user
const getCart = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}/${userId}`);
  return res.data;
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
