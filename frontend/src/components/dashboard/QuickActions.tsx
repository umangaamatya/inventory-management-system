import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShoppingCart, Package, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Product',
      icon: PlusCircle,
      variant: 'gradient' as const,
      onClick: () => navigate('/add-product'),
    },
    {
      label: 'Place Order',
      icon: ShoppingCart,
      variant: 'success-gradient' as const,
      onClick: () => navigate('/orders'),
    },
    {
      label: 'View Inventory',
      icon: Package,
      variant: 'secondary' as const,
      onClick: () => navigate('/inventory'),
    },
    {
      label: 'Transactions',
      icon: FileText,
      variant: 'outline' as const,
      onClick: () => navigate('/transactions'),
    },
  ];

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              size="lg"
              onClick={action.onClick}
              className="h-auto p-4 flex-col gap-2"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};