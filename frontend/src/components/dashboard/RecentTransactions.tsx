import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useInventory } from '@/context/InventoryContext';
import { Transaction } from '@/types';

const getTransactionTypeLabel = (type: Transaction['type']) => {
  switch (type) {
    case 'stock_adjustment':
      return 'Stock Adjustment';
    case 'order_placed':
      return 'Order Placed';
    case 'order_processed':
      return 'Order Processed';
    case 'product_added':
      return 'Product Added';
    default:
      return type;
  }
};

const getTransactionVariant = (type: Transaction['type']) => {
  switch (type) {
    case 'product_added':
      return 'default';
    case 'order_placed':
      return 'secondary';
    case 'order_processed':
      return 'outline';
    case 'stock_adjustment':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const RecentTransactions: React.FC = () => {
  const { state, actions } = useInventory();
  const { fetchTransactions } = actions;

  useEffect(() => {
    fetchTransactions(5);
  }, [fetchTransactions]);

  if (state.loading.transactions) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentTransactions = state.transactions.slice(0, 5);

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No recent transactions</p>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={getTransactionVariant(transaction.type)}>
                    {getTransactionTypeLabel(transaction.type)}
                  </Badge>
                  <span className="text-sm font-medium truncate">
                    {transaction.details}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};