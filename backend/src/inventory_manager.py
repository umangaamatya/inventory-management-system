"""
Inventory Manager
Manages products and generates reports from 2D lists
"""

class InventoryManager:
    def __init__(self):
        # 2D list representing inventory: [product_id, name, price, quantity, category]
        self.inventory = []
        self.next_id = 1
    
    def add_product(self, name, price, quantity, category):
        """Add a new product to inventory"""
        product_id = self.next_id
        self.inventory.append([product_id, name, price, quantity, category])
        self.next_id += 1
        return product_id
    
    def update_stock(self, product_id, quantity_change):
        """Update stock level for a product"""
        for product in self.inventory:
            if product[0] == product_id:
                product[3] += quantity_change
                if product[3] < 0:
                    product[3] = 0
                return True
        return False
    
    def get_inventory_report(self):
        """Generate inventory report from the 2D list"""
        return self.inventory
    
    def get_low_stock_report(self, threshold=5):
        """Generate report of products with low stock"""
        return [product for product in self.inventory if product[3] < threshold]
    
    def get_product_by_id(self, product_id):
        """Find a product by ID"""
        for product in self.inventory:
            if product[0] == product_id:
                return product
        return None
    
    def get_product_by_name(self, name):
        """Find products by name (partial match)"""
        return [product for product in self.inventory if name.lower() in product[1].lower()]
    
    def get_products_by_category(self, category):
        """Find products by category"""
        return [product for product in self.inventory if product[4].lower() == category.lower()]