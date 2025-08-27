"""
API for React Frontend
Provides methods to interact with the inventory system from a frontend
"""

class InventoryAPI:
    def __init__(self):
        from src.inventory_manager import InventoryManager
        from src.transaction_ledger import TransactionLedger
        from src.order_management import OrderQueue, BackorderPriorityQueue, DeliveryStack
        
        self.inventory_manager = InventoryManager()
        self.transaction_ledger = TransactionLedger()
        self.order_queue = OrderQueue()
        self.backorder_queue = BackorderPriorityQueue()
        self.delivery_stack = DeliveryStack()
        
        # Load sample data
        from data.sample_data import load_sample_data
        load_sample_data(self.inventory_manager)
    
    def get_inventory(self):
        """Get all inventory items"""
        inventory_data = []
        for product in self.inventory_manager.get_inventory_report():
            inventory_data.append({
                "id": product[0],
                "name": product[1],
                "price": product[2],
                "quantity": product[3],
                "category": product[4]
            })
        return inventory_data
    
    def add_product(self, name, price, quantity, category):
        """Add a new product to inventory"""
        product_id = self.inventory_manager.add_product(name, price, quantity, category)
        self.transaction_ledger.add_transaction(
            "PRODUCT_ADDED", product_id, quantity, f"Added product: {name}"
        )
        return {"status": "success", "product_id": product_id}
    
    def update_stock(self, product_id, quantity_change):
        """Update product stock levels"""
        success = self.inventory_manager.update_stock(product_id, quantity_change)
        if success:
            transaction_type = "STOCK_INCREASE" if quantity_change > 0 else "STOCK_DECREASE"
            self.transaction_ledger.add_transaction(
                transaction_type, product_id, abs(quantity_change), "Stock adjustment"
            )
            return {"status": "success"}
        return {"status": "error", "message": "Product not found"}
    
    def place_order(self, product_id, quantity, customer_name, priority=1):
        """Place a new order"""
        # Check if product exists
        product = self.inventory_manager.get_product_by_id(product_id)
        if not product:
            return {"status": "error", "message": "Product not found"}
        
        order_id = self.transaction_ledger.count + 1
        order_details = {
            "order_id": order_id,
            "product_id": product_id,
            "product_name": product[1],
            "quantity": quantity,
            "customer_name": customer_name,
            "priority": priority,
            "status": "pending"
        }
        
        self.order_queue.enqueue(order_details)
        self.transaction_ledger.add_transaction(
            "ORDER_PLACED", product_id, quantity, f"Order #{order_id} by {customer_name}"
        )
        
        return {"status": "success", "order_id": order_id}
    
    def process_orders(self, count=1):
        """Process orders from the queue"""
        results = []
        for _ in range(count):
            if self.order_queue.is_empty():
                break
                
            order = self.order_queue.peek()  # Look at next order without removing
            product_id = order["product_id"]
            quantity = order["quantity"]
            
            product = self.inventory_manager.get_product_by_id(product_id)
            if product and product[3] >= quantity:
                # Sufficient stock - fulfill order
                order = self.order_queue.dequeue()
                self.inventory_manager.update_stock(product_id, -quantity)
                self.delivery_stack.push(order)
                order["status"] = "fulfilled"
                results.append(order)
                
                self.transaction_ledger.add_transaction(
                    "ORDER_FULFILLED", product_id, quantity, f"Order #{order['order_id']}"
                )
            else:
                # Insufficient stock - move to backorders
                order = self.order_queue.dequeue()
                self.backorder_queue.enqueue(order, order["priority"])
                order["status"] = "backordered"
                results.append(order)
                
                self.transaction_ledger.add_transaction(
                    "BACKORDER_CREATED", product_id, quantity, f"Order #{order['order_id']}"
                )
        
        return {"status": "success", "processed_orders": results}
    
    def get_transactions(self, limit=10):
        """Get transaction history"""
        return self.transaction_ledger.get_transaction_history(limit)
    
    def get_system_status(self):
        """Get current system status"""
        return {
            "total_products": len(self.inventory_manager.inventory),
            "pending_orders": self.order_queue.size(),
            "backorders": self.backorder_queue.size(),
            "items_ready_for_delivery": self.delivery_stack.size(),
            "total_transactions": self.transaction_ledger.count
        }
    
    def calculate_composite_cost(self, components):
        """Calculate cost of a composite product"""
        from src.composite_product import CompositeProduct
        composite = CompositeProduct("Custom Composite", components)
        total_cost = composite.calculate_cost(self.inventory_manager)
        return {"status": "success", "total_cost": total_cost}