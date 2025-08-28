import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Package } from 'lucide-react';
import { OrderForm } from '@/components/orders/OrderForm';
import { useInventory } from '@/context/InventoryContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const Orders: React.FC = () => {
  const { state, actions } = useInventory();
  const { fetchProducts, fetchSystemStatus, processOrders } = actions;
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchSystemStatus();
  }, [fetchProducts, fetchSystemStatus]);

  const handleProcessOrders = async () => {
    try {
      await processOrders();
      // Refresh system status after processing
      await fetchSystemStatus();
    } catch (error) {
      console.error('Failed to process orders:', error);
    }
  };

  const availableProducts = state.products.filter(p => p.quantity > 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
        <p className="text-muted-foreground mt-1">
          Place new orders and process existing ones
        </p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {state.systemStatus?.pendingOrders || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backorders</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {state.systemStatus?.backorders || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Delivery</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {state.systemStatus?.readyForDelivery || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Place New Order */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Place New Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create orders for customers from available inventory
            </p>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {availableProducts.length} products available
              </Badge>
            </div>

            <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="gradient" 
                  className="w-full"
                  disabled={availableProducts.length === 0}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                  <DialogDescription>
                    Select a product and enter order details
                  </DialogDescription>
                </DialogHeader>
                <OrderForm 
                  onSuccess={() => setOrderDialogOpen(false)}
                  onCancel={() => setOrderDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Process Orders */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Process Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Process pending orders to update inventory and prepare for delivery
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pending Orders:</span>
                <span className="font-medium">{state.systemStatus?.pendingOrders || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Backorders:</span>
                <span className="font-medium text-destructive">
                  {state.systemStatus?.backorders || 0}
                </span>
              </div>
            </div>

            <Button 
              variant="success-gradient" 
              className="w-full"
              onClick={handleProcessOrders}
              disabled={state.loading.orders || (state.systemStatus?.pendingOrders || 0) === 0}
            >
              <Play className="h-4 w-4 mr-2" />
              {state.loading.orders ? 'Processing...' : 'Process All Orders'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      {availableProducts.length === 0 && (
        <Card className="card-elevated border-warning/20 bg-warning-light">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-warning" />
              <div>
                <h3 className="font-medium text-warning-foreground">No Products Available</h3>
                <p className="text-sm text-warning-foreground/80">
                  Add products to your inventory before placing orders
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};