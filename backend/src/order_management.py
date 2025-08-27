"""
Order Management
Manages orders, backorders, and delivery using appropriate data structures
"""

# i. Queue for customer orders (FIFO)
class OrderQueue:
    def __init__(self):
        self.orders = []
    
    def enqueue(self, order):
        """Add an order to the queue"""
        self.orders.append(order)
    
    def dequeue(self):
        """Remove and return the next order from the queue"""
        if self.is_empty():
            return None
        return self.orders.pop(0)
    
    def is_empty(self):
        """Check if the queue is empty"""
        return len(self.orders) == 0
    
    def size(self):
        """Get the number of orders in the queue"""
        return len(self.orders)
    
    def peek(self):
        """View the next order without removing it"""
        if self.is_empty():
            return None
        return self.orders[0]

# ii. Priority Queue for backorders
class BackorderPriorityQueue:
    def __init__(self):
        self.orders = []
    
    def enqueue(self, order, priority=1):
        """Add a backorder with a priority level"""
        # Higher priority numbers are processed first
        self.orders.append((priority, order))
        # Sort by priority (descending)
        self.orders.sort(key=lambda x: x[0], reverse=True)
    
    def dequeue(self):
        """Remove and return the highest priority backorder"""
        if self.is_empty():
            return None
        return self.orders.pop(0)[1]
    
    def is_empty(self):
        """Check if the priority queue is empty"""
        return len(self.orders) == 0
    
    def size(self):
        """Get the number of backorders in the queue"""
        return len(self.orders)

# iii. Stack for delivery truck loading (LIFO)
class DeliveryStack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        """Add an item to the stack"""
        self.items.append(item)
    
    def pop(self):
        """Remove and return the top item from the stack"""
        if self.is_empty():
            return None
        return self.items.pop()
    
    def is_empty(self):
        """Check if the stack is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Get the number of items in the stack"""
        return len(self.items)
    
    def peek(self):
        """View the top item without removing it"""
        if self.is_empty():
            return None
        return self.items[-1]