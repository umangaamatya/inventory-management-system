// Core data types for the inventory management system

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface Order {
  id?: number;
  productId: number;
  quantity: number;
  customerName: string;
  priority: 'low' | 'medium' | 'high';
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  timestamp?: string;
}

export interface Transaction {
  id: number;
  timestamp: string;
  type: 'stock_adjustment' | 'order_placed' | 'order_processed' | 'product_added';
  productId?: number;
  quantity?: number;
  details: string;
}

export interface SystemStatus {
  totalProducts: number;
  pendingOrders: number;
  backorders: number;
  readyForDelivery: number;
}

export interface CompositeProduct {
  name: string;
  components: {
    productId: number;
    quantity: number;
  }[];
  totalCost: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface NewProduct {
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface StockUpdate {
  quantityChange: number;
}