import axios from 'axios';
import { Product, Order, Transaction, SystemStatus, NewProduct, StockUpdate } from '@/types';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to the server. Please ensure the backend is running on port 5001.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Endpoint not found. Please check the API configuration.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw error;
  }
);

// Helpers
const toClientStatus = (data: any): SystemStatus => ({
  totalProducts: data.total_products ?? data.totalProducts ?? 0,
  pendingOrders: data.pending_orders ?? data.pendingOrders ?? 0,
  backorders: data.backorders ?? 0,
  readyForDelivery: data.items_ready_for_delivery ?? data.readyForDelivery ?? 0,
});

const toClientTransaction = (t: any): Transaction => {
  const rawType: string = t.type ?? '';
  let mapped: Transaction['type'];
  switch (rawType) {
    case 'PRODUCT_ADDED':
      mapped = 'product_added';
      break;
    case 'STOCK_INCREASE':
    case 'STOCK_DECREASE':
      mapped = 'stock_adjustment';
      break;
    case 'ORDER_PLACED':
      mapped = 'order_placed';
      break;
    case 'ORDER_FULFILLED':
      mapped = 'order_processed';
      break;
    default:
      // Fallback to lowercase mapping
      mapped = (rawType.toLowerCase() as Transaction['type']);
  }

  return {
    id: t.id,
    timestamp: t.timestamp,
    type: mapped,
    productId: t.product_id ?? t.productId,
    quantity: t.quantity,
    details: t.details,
  };
};

// Inventory API
export const inventoryAPI = {
  // Get all inventory items
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/inventory');
    return response.data;
  },

  // Add new product
  addProduct: async (product: NewProduct): Promise<{ status: string; product_id: number } | any> => {
    const response = await api.post('/inventory', product);
    return response.data;
  },

  // Update stock for a product
  updateStock: async (id: number, stockUpdate: StockUpdate): Promise<any> => {
    const response = await api.put(`/inventory/${id}`, stockUpdate);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  // Place a new order
  placeOrder: async (order: Omit<Order, 'id' | 'status' | 'timestamp'>): Promise<any> => {
    const priorityMap: Record<'low' | 'medium' | 'high', number> = { low: 1, medium: 2, high: 3 };
    const payload = {
      productId: order.productId,
      quantity: order.quantity,
      customerName: order.customerName,
      priority: priorityMap[order.priority],
    };
    const response = await api.post('/orders', payload);
    return response.data;
  },

  // Process orders
  processOrders: async (count?: number): Promise<{ processed: number; message: string }> => {
    const response = await api.post('/orders/process', count ? { count } : {});
    const processedOrders = response.data?.processed_orders ?? [];
    return {
      processed: Array.isArray(processedOrders) ? processedOrders.length : 0,
      message: Array.isArray(processedOrders)
        ? `Processed ${processedOrders.length} order(s)`
        : 'Processed orders',
    };
  },
};

// Transactions API
export const transactionsAPI = {
  // Get transaction history
  getAll: async (limit?: number): Promise<Transaction[]> => {
    const response = await api.get('/transactions', {
      params: limit ? { limit } : {},
    });
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(toClientTransaction);
  },
};

// System Status API
export const statusAPI = {
  // Get system status
  getStatus: async (): Promise<SystemStatus> => {
    const response = await api.get('/status');
    return toClientStatus(response.data);
  },
};

// Composite Products API
export const compositeAPI = {
  // Calculate composite product cost
  calculateCost: async (components: { productId: number; quantity: number }[]): Promise<{ totalCost: number }> => {
    const response = await api.post('/composite-cost', { components });
    const data = response.data || {};
    return { totalCost: data.total_cost ?? data.totalCost ?? 0 };
  },
};

export default api;
