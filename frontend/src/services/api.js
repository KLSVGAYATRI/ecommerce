import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => { if (err.response?.status === 401) { localStorage.removeItem('token'); } return Promise.reject(err); }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getFeatured = () => API.get('/products/featured');
export const getCategories = () => API.get('/products/categories');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Cart
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const updateCartItem = (productId, data) => API.put(`/cart/${productId}`, data);
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete('/cart/clear');

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getUserOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get('/orders/all');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Admin
export const getDashboard = () => API.get('/admin/dashboard');
export const getUsers = () => API.get('/admin/users');

// Profile
export const updateProfile = (data) => API.put('/users/profile', data);
export const getWishlist = () => API.get('/users/wishlist');
export const addToWishlist = (product_id) => API.post('/users/wishlist', { product_id });
export const removeFromWishlist = (productId) => API.delete(`/users/wishlist/${productId}`);

export default API;
