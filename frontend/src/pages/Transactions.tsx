import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
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

export const Transactions: React.FC = () => {
  const { state, actions } = useInventory();
  const { fetchTransactions } = actions;
  const [filterType, setFilterType] = useState<string>('all');
  const [limit, setLimit] = useState<number>(50);

  useEffect(() => {
    fetchTransactions(limit);
  }, [fetchTransactions, limit]);

  const filteredTransactions = filterType === 'all' 
    ? state.transactions 
    : state.transactions.filter(t => t.type === filterType);

  const transactionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'product_added', label: 'Product Added' },
    { value: 'stock_adjustment', label: 'Stock Adjustment' },
    { value: 'order_placed', label: 'Order Placed' },
    { value: 'order_processed', label: 'Order Processed' },
  ];

  const limitOptions = [
    { value: 25, label: '25 transactions' },
    { value: 50, label: '50 transactions' },
    { value: 100, label: '100 transactions' },
    { value: 200, label: '200 transactions' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
        <p className="text-muted-foreground mt-1">
          View all system transactions and activities
        </p>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Transaction Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Limit</label>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {limitOptions.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <Badge variant="outline">
              {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {state.loading.transactions ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 flex-1" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        #{transaction.id}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTransactionVariant(transaction.type)}>
                          {getTransactionTypeLabel(transaction.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={transaction.details}>
                          {transaction.details}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.productId ? `#${transaction.productId}` : '-'}
                      </TableCell>
                      <TableCell>
                        {transaction.quantity !== undefined ? transaction.quantity : '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(transaction.timestamp), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};