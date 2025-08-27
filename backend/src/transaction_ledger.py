"""
Transaction Ledger
Provides an audit trail of all inventory movements using linked list
"""

class TransactionNode:
    def __init__(self, transaction_data):
        self.data = transaction_data
        self.next = None

class TransactionLedger:
    def __init__(self):
        self.head = None
        self.tail = None
        self.count = 0
    
    def add_transaction(self, transaction_type, product_id, quantity, details=""):
        """Add a new transaction to the ledger"""
        from datetime import datetime
        transaction_data = {
            "id": self.count + 1,
            "timestamp": datetime.now().isoformat(),
            "type": transaction_type,
            "product_id": product_id,
            "quantity": quantity,
            "details": details
        }
        
        new_node = TransactionNode(transaction_data)
        
        if self.head is None:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node
        
        self.count += 1
        return transaction_data["id"]
    
    def get_transaction_history(self, limit=None):
        """Get transaction history as a list"""
        history = []
        current = self.head
        count = 0
        
        while current is not None and (limit is None or count < limit):
            history.append(current.data)
            current = current.next
            count += 1
        
        return history
    
    def get_transactions_by_product(self, product_id, limit=None):
        """Get transactions for a specific product"""
        transactions = []
        current = self.head
        count = 0
        
        while current is not None and (limit is None or count < limit):
            if current.data["product_id"] == product_id:
                transactions.append(current.data)
                count += 1
            current = current.next
        
        return transactions
    
    def get_last_transaction(self):
        """Get the most recent transaction"""
        if self.tail is None:
            return None
        return self.tail.data