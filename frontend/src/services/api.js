import axios from 'axios';

// Create axios instance with simple configuration
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
});

// Inventory API
export const getInventory = () => api.get('/inventory').then(res => res.data);
export const addProduct = (name, price, quantity, category) => 
  api.post('/inventory', { name, price, quantity, category }).then(res => res.data);
export const updateStock = (productId, quantityChange) => 
  api.put(`/inventory/${productId}`, { quantityChange }).then(res => res.data);

// Orders API
export const placeOrder = (productId, quantity, customerName, priority) => 
  api.post('/orders', { productId, quantity, customerName, priority }).then(res => res.data);
export const processOrders = (count) => 
  api.post('/orders/process', { count }).then(res => res.data);

// Transactions API
export const getTransactions = (limit) => 
  api.get(`/transactions?limit=${limit}`).then(res => res.data);

// System Status API
export const getStatus = () => api.get('/status').then(res => res.data);

export default api;
