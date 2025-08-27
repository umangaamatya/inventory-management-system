"""
User Interface
Main interface for warehouse managers with menu-driven system
"""

class UserInterface:
    def __init__(self, inventory_manager):
        self.inventory_manager = inventory_manager
        self.running = True
    
    def display_menu(self):
        """Display the main menu"""
        print("\n=== Warehouse Management System ===")
        print("1. Add Product")
        print("2. Update Stock")
        print("3. View Inventory Report")
        print("4. View Low Stock Report")
        print("5. Calculate Composite Product Cost")
        print("6. Search Products")
        print("7. Exit")
    
    def handle_choice(self, choice):
        """Handle user menu selection"""
        if choice == "1":
            self.add_product_ui()
        elif choice == "2":
            self.update_stock_ui()
        elif choice == "3":
            self.view_inventory_report()
        elif choice == "4":
            self.view_low_stock_report()
        elif choice == "5":
            self.calculate_composite_cost_ui()
        elif choice == "6":
            self.search_products_ui()
        elif choice == "7":
            self.running = False
        else:
            print("Invalid choice. Please try again.")
    
    def add_product_ui(self):
        """UI for adding a product"""
        print("\n--- Add New Product ---")
        name = input("Product name: ")
        try:
            price = float(input("Price: "))
            quantity = int(input("Initial quantity: "))
            category = input("Category: ")
            product_id = self.inventory_manager.add_product(name, price, quantity, category)
            print(f"Product added successfully with ID: {product_id}")
        except ValueError:
            print("Invalid input. Please enter numbers for price and quantity.")
    
    def update_stock_ui(self):
        """UI for updating stock"""
        print("\n--- Update Stock ---")
        try:
            product_id = int(input("Product ID: "))
            quantity_change = int(input("Quantity change (use negative to reduce): "))
            success = self.inventory_manager.update_stock(product_id, quantity_change)
            if success:
                print("Stock updated successfully.")
            else:
                print("Product not found.")
        except ValueError:
            print("Invalid input. Please enter numbers for ID and quantity.")
    
    def view_inventory_report(self):
        """Display inventory report"""
        print("\n--- Inventory Report ---")
        inventory = self.inventory_manager.get_inventory_report()
        print(f"{'ID':<5} {'Name':<20} {'Price':<10} {'Qty':<5} {'Category':<15}")
        print("-" * 60)
        for product in inventory:
            print(f"{product[0]:<5} {product[1]:<20} ${product[2]:<9.2f} {product[3]:<5} {product[4]:<15}")
    
    def view_low_stock_report(self):
        """Display low stock report"""
        print("\n--- Low Stock Report ---")
        try:
            threshold = int(input("Low stock threshold (default 5): ") or "5")
        except ValueError:
            threshold = 5
        
        low_stock = self.inventory_manager.get_low_stock_report(threshold)
        if not low_stock:
            print("No products with low stock.")
            return
            
        print(f"{'ID':<5} {'Name':<20} {'Qty':<5} {'Category':<15}")
        print("-" * 45)
        for product in low_stock:
            print(f"{product[0]:<5} {product[1]:<20} {product[3]:<5} {product[4]:<15}")
    
    def calculate_composite_cost_ui(self):
        """UI for calculating composite product cost"""
        print("\n--- Calculate Composite Product Cost ---")
        name = input("Composite product name: ")
        components = []
        
        while True:
            print("\nAdd component:")
            try:
                product_id = int(input("Product ID (0 to finish): "))
                if product_id == 0:
                    break
                quantity = int(input("Quantity: "))
                components.append([product_id, quantity])
            except ValueError:
                print("Invalid input. Please enter numbers.")
        
        from src.composite_product import CompositeProduct
        composite = CompositeProduct(name, components)
        total_cost = composite.calculate_cost(self.inventory_manager)
        print(f"Total cost for '{name}': ${total_cost:.2f}")
    
    def search_products_ui(self):
        """UI for searching products"""
        print("\n--- Search Products ---")
        print("1. Search by name")
        print("2. Search by category")
        choice = input("Enter your choice: ")
        
        if choice == "1":
            name = input("Enter product name to search: ")
            results = self.inventory_manager.get_product_by_name(name)
        elif choice == "2":
            category = input("Enter category to search: ")
            results = self.inventory_manager.get_products_by_category(category)
        else:
            print("Invalid choice.")
            return
        
        if not results:
            print("No products found.")
            return
            
        print(f"{'ID':<5} {'Name':<20} {'Price':<10} {'Qty':<5} {'Category':<15}")
        print("-" * 60)
        for product in results:
            print(f"{product[0]:<5} {product[1]:<20} ${product[2]:<9.2f} {product[3]:<5} {product[4]:<15}")
    
    def run(self):
        """Main loop for the user interface"""
        while self.running:
            self.display_menu()
            choice = input("Enter your choice (1-7): ")
            self.handle_choice(choice)
        print("Thank you for using the Warehouse Management System!")