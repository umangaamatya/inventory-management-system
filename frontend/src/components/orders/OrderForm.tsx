import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Product } from '@/types';
import { useInventory } from '@/context/InventoryContext';

const orderSchema = z.object({
  productId: z.number().min(1, 'Please select a product'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  customerName: z.string().min(1, 'Customer name is required'),
  priority: z.enum(['low', 'medium', 'high']),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  preselectedProduct?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ 
  preselectedProduct, 
  onSuccess, 
  onCancel 
}) => {
  const { state, actions } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      productId: preselectedProduct?.id || 0,
      quantity: 1,
      customerName: '',
      priority: 'medium',
    },
  });

  const selectedProductId = form.watch('productId');
  const selectedProduct = state.products.find(p => p.id === selectedProductId);
  const maxQuantity = selectedProduct?.quantity || 0;

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        productId: data.productId,
        quantity: data.quantity,
        customerName: data.customerName,
        priority: data.priority as 'low' | 'medium' | 'high',
      };
      await actions.placeOrder(orderData);
      onSuccess();
      form.reset();
    } catch (error) {
      // Error is handled in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!preselectedProduct && (
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {state.products
                      .filter(p => p.quantity > 0)
                      .map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} (Stock: {product.quantity})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {preselectedProduct && (
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm font-medium">Selected Product</Label>
            <p className="text-sm">{preselectedProduct.name}</p>
            <p className="text-xs text-muted-foreground">
              Available stock: {preselectedProduct.quantity}
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1}
                  max={maxQuantity}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              {selectedProduct && (
                <p className="text-xs text-muted-foreground">
                  Maximum available: {maxQuantity}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="gradient"
            disabled={isSubmitting || !selectedProduct || maxQuantity === 0}
            className="flex-1"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};