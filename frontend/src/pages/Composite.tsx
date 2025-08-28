import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { compositeAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface CompositeComponent {
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    category: string;
  };
}

export const Composite: React.FC = () => {
  const { state, actions } = useInventory();
  const { fetchProducts } = actions;
  const [compositeName, setCompositeName] = useState('');
  const [components, setComponents] = useState<CompositeComponent[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [calculating, setCalculating] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Calculate total cost when components change
  useEffect(() => {
    if (components.length > 0) {
      calculateTotalCost();
    } else {
      setTotalCost(0);
    }
  }, [components]);

  const calculateTotalCost = async () => {
    if (components.length === 0) return;
    
    setCalculating(true);
    try {
      const componentsForAPI = components.map(c => ({
        productId: c.productId,
        quantity: c.quantity,
      }));
      
      const result = await compositeAPI.calculateCost(componentsForAPI);
      setTotalCost(result.totalCost);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to calculate total cost',
        variant: 'destructive',
      });
      console.error('Failed to calculate cost:', error);
    } finally {
      setCalculating(false);
    }
  };

  const addComponent = () => {
    if (!selectedProductId || selectedQuantity <= 0) return;

    const productId = parseInt(selectedProductId);
    const product = state.products.find(p => p.id === productId);
    
    if (!product) return;

    // Check if product already exists in components
    const existingIndex = components.findIndex(c => c.productId === productId);
    
    if (existingIndex >= 0) {
      // Update existing component
      const updatedComponents = [...components];
      updatedComponents[existingIndex].quantity += selectedQuantity;
      setComponents(updatedComponents);
    } else {
      // Add new component
      const newComponent: CompositeComponent = {
        productId,
        quantity: selectedQuantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
        },
      };
      setComponents([...components, newComponent]);
    }

    // Reset form
    setSelectedProductId('');
    setSelectedQuantity(1);
  };

  const removeComponent = (productId: number) => {
    setComponents(components.filter(c => c.productId !== productId));
  };

  const updateComponentQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeComponent(productId);
      return;
    }

    setComponents(components.map(c => 
      c.productId === productId ? { ...c, quantity } : c
    ));
  };

  const saveCompositeTemplate = () => {
    if (!compositeName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the composite product',
        variant: 'destructive',
      });
      return;
    }

    if (components.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one component',
        variant: 'destructive',
      });
      return;
    }

    // For now, just show a success message
    // In a real app, you'd save this to a backend
    toast({
      title: 'Success',
      description: `Composite product template "${compositeName}" saved with total cost $${totalCost.toFixed(2)}`,
    });

    // Reset form
    setCompositeName('');
    setComponents([]);
    setTotalCost(0);
  };

  const clearAll = () => {
    setComponents([]);
    setCompositeName('');
    setTotalCost(0);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Composite Product Calculator</h1>
        <p className="text-muted-foreground mt-1">
          Build composite products and calculate total costs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Components */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Add Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="compositeName">Composite Product Name</Label>
              <Input
                id="compositeName"
                value={compositeName}
                onChange={(e) => setCompositeName(e.target.value)}
                placeholder="Enter product name"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Label>Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} (${product.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button 
              onClick={addComponent}
              disabled={!selectedProductId || selectedQuantity <= 0}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </CardContent>
        </Card>

        {/* Cost Summary */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Cost Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Components:</span>
                <Badge variant="outline">{components.length}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Quantity:</span>
                <span className="font-medium">
                  {components.reduce((sum, c) => sum + c.quantity, 0)}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Cost:</span>
                  <div className="text-right">
                    {calculating ? (
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Calculating...</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        ${totalCost.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="gradient" 
                  onClick={saveCompositeTemplate}
                  disabled={components.length === 0 || !compositeName.trim()}
                  className="flex-1"
                >
                  Save Template
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearAll}
                  disabled={components.length === 0}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Components Table */}
      {components.length > 0 && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components.map((component) => {
                    const subtotal = (component.product?.price || 0) * component.quantity;
                    return (
                      <TableRow key={component.productId}>
                        <TableCell className="font-medium">
                          {component.product?.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {component.product?.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          ${component.product?.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            value={component.quantity}
                            onChange={(e) => updateComponentQuantity(
                              component.productId, 
                              parseInt(e.target.value) || 0
                            )}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          ${subtotal.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeComponent(component.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};