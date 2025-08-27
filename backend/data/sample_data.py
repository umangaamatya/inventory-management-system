"""
Sample data for the inventory system
"""

def load_sample_data(inventory_manager):
    """Load sample products into the inventory"""
    sample_products = [
        ("Laptop", 999.99, 10, "Electronics"),
        ("Mouse", 24.99, 50, "Accessories"),
        ("Keyboard", 49.99, 30, "Accessories"),
        ("Monitor", 199.99, 15, "Electronics"),
        ("Webcam", 59.99, 8, "Accessories"),
        ("Headphones", 79.99, 20, "Audio"),
        ("USB Cable", 9.99, 100, "Accessories"),
        ("External HDD", 89.99, 12, "Storage"),
        ("SSD", 129.99, 18, "Storage"),
        ("Router", 69.99, 7, "Networking")
    ]
    
    for name, price, qty, category in sample_products:
        inventory_manager.add_product(name, price, qty, category)
    
    return len(sample_products)