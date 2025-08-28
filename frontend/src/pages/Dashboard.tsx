import React, { useEffect } from 'react';
import { Package, ShoppingCart, AlertTriangle, Truck } from 'lucide-react';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useInventory } from '@/context/InventoryContext';
import { Skeleton } from '@/components/ui/skeleton';

export const Dashboard: React.FC = () => {
  const { state, actions } = useInventory();
  const { fetchSystemStatus, fetchProducts } = actions;

  useEffect(() => {
    fetchSystemStatus();
    fetchProducts();
  }, [fetchSystemStatus, fetchProducts]);

  const isLoading = state.loading.status || state.loading.products;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your inventory and manage operations
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[120px] w-full rounded-lg" />
            </div>
          ))
        ) : (
          <>
            <StatusCard
              title="Total Products"
              value={state.systemStatus?.totalProducts || 0}
              icon={Package}
              variant="default"
            />
            <StatusCard
              title="Pending Orders"
              value={state.systemStatus?.pendingOrders || 0}
              icon={ShoppingCart}
              variant="warning"
            />
            <StatusCard
              title="Backorders"
              value={state.systemStatus?.backorders || 0}
              icon={AlertTriangle}
              variant="destructive"
            />
            <StatusCard
              title="Ready for Delivery"
              value={state.systemStatus?.readyForDelivery || 0}
              icon={Truck}
              variant="success"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>

      {/* Low Stock Alert */}
      {state.products.length > 0 && (
        <div className="bg-warning-light border border-warning/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h3 className="font-medium text-warning-foreground">Low Stock Alert</h3>
              <p className="text-sm text-warning-foreground/80 mt-1">
                {state.products.filter(p => p.quantity < 10).length} products have low stock levels
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};