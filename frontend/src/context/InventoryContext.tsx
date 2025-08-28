import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Product, Order, Transaction, SystemStatus } from '@/types';
import { inventoryAPI, ordersAPI, transactionsAPI, statusAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

// State interface
interface InventoryState {
  products: Product[];
  transactions: Transaction[];
  systemStatus: SystemStatus | null;
  loading: {
    products: boolean;
    transactions: boolean;
    status: boolean;
    orders: boolean;
  };
  error: string | null;
}

// Action types
type InventoryAction =
  | { type: 'SET_LOADING'; payload: { section: keyof InventoryState['loading']; loading: boolean } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_SYSTEM_STATUS'; payload: SystemStatus };

// Initial state
const initialState: InventoryState = {
  products: [],
  transactions: [],
  systemStatus: null,
  loading: {
    products: false,
    transactions: false,
    status: false,
    orders: false,
  },
  error: null,
};

// Reducer
const inventoryReducer = (state: InventoryState, action: InventoryAction): InventoryState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.section]: action.payload.loading,
        },
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'SET_SYSTEM_STATUS':
      return { ...state, systemStatus: action.payload };
    default:
      return state;
  }
};

// Context interface
interface InventoryContextType {
  state: InventoryState;
  actions: {
    fetchProducts: () => Promise<void>;
    addProduct: (product: { name: string; price: number; quantity: number; category: string }) => Promise<void>;
    updateStock: (id: number, quantityChange: number) => Promise<void>;
    placeOrder: (order: { productId: number; quantity: number; customerName: string; priority: 'low' | 'medium' | 'high' }) => Promise<void>;
    processOrders: (count?: number) => Promise<void>;
    fetchTransactions: (limit?: number) => Promise<void>;
    fetchSystemStatus: () => Promise<void>;
    clearError: () => void;
  };
}

// Create context
const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Provider component
export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  const setLoading = useCallback((section: keyof InventoryState['loading'], loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { section, loading } });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading('products', true);
      setError(null);
      const products = await inventoryAPI.getAll();
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading('products', false);
    }
  }, [setError, setLoading]);

  // Add new product
  const addProduct = useCallback(async (productData: { name: string; price: number; quantity: number; category: string }) => {
    try {
      setLoading('products', true);
      setError(null);
      await inventoryAPI.addProduct(productData);
      // Refresh from server to get canonical data shape
      await fetchProducts();
      toast({
        title: 'Success',
        description: 'Product added successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add product';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading('products', false);
    }
  }, [setError, setLoading, fetchProducts]);

  // Update stock
  const updateStock = useCallback(async (id: number, quantityChange: number) => {
    try {
      setLoading('products', true);
      setError(null);
      await inventoryAPI.updateStock(id, { quantityChange });
      // Refresh products after stock update
      await fetchProducts();
      toast({
        title: 'Success',
        description: 'Stock updated successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update stock';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading('products', false);
    }
  }, [setError, setLoading, fetchProducts]);

  // Place order
  const placeOrder = useCallback(async (orderData: { productId: number; quantity: number; customerName: string; priority: 'low' | 'medium' | 'high' }) => {
    try {
      setLoading('orders', true);
      setError(null);
      await ordersAPI.placeOrder(orderData);
      toast({
        title: 'Success',
        description: 'Order placed successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading('orders', false);
    }
  }, [setError, setLoading]);

  // Process orders
  const processOrders = useCallback(async (count?: number) => {
    try {
      setLoading('orders', true);
      setError(null);
      const result = await ordersAPI.processOrders(count);
      toast({
        title: 'Success',
        description: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process orders';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading('orders', false);
    }
  }, [setError, setLoading]);

  // Fetch transactions
  const fetchTransactions = useCallback(async (limit?: number) => {
    try {
      setLoading('transactions', true);
      setError(null);
      const transactions = await transactionsAPI.getAll(limit);
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch transactions';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading('transactions', false);
    }
  }, [setError, setLoading]);

  // Fetch system status
  const fetchSystemStatus = useCallback(async () => {
    try {
      setLoading('status', true);
      setError(null);
      const status = await statusAPI.getStatus();
      dispatch({ type: 'SET_SYSTEM_STATUS', payload: status });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch system status';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading('status', false);
    }
  }, [setError, setLoading]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const value: InventoryContextType = {
    state,
    actions: {
      fetchProducts,
      addProduct,
      updateStock,
      placeOrder,
      processOrders,
      fetchTransactions,
      fetchSystemStatus,
      clearError,
    },
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};

// Custom hook to use inventory context
export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};