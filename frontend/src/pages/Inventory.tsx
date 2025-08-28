import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { useInventory } from '@/context/InventoryContext';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderForm } from '@/components/orders/OrderForm';

export const Inventory: React.FC = () => {
  const { state, actions } = useInventory();
  const { fetchProducts } = actions;
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToOrder = (product: Product) => {
    setSelectedProduct(product);
    setOrderDialogOpen(true);
  };

  const handleOrderClose = () => {
    setOrderDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your products and stock levels
          </p>
        </div>
        
        <Button variant="gradient" onClick={() => navigate('/add-product')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Inventory Table */}
      {state.loading.products ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      ) : (
        <InventoryTable 
          products={state.products} 
          onAddToOrder={handleAddToOrder}
        />
      )}

      {/* Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
            <DialogDescription>
              Create a new order for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <OrderForm 
              preselectedProduct={selectedProduct}
              onSuccess={handleOrderClose}
              onCancel={handleOrderClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
