import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/orders';

export const getOrders = async (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateOrderStatus = async (id, action, token) => {
  return axios.put(`${API_URL}/${id}/${action}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
